import { defaultContent } from './data.js';

class Store {
    constructor() {
        this.state = {
            content: this.loadLocalContent(), // Initial load from local/default
            editMode: localStorage.getItem('ks_drives_admin_static') === 'true',
            user: null,
            cart: this.loadCart()
        };
        this.listeners = [];
        this.history = []; // Undo stack

        // Check backend auth status on init
        this.checkAuth();

        // Sync with backend on init
        this.fetchBackendContent();
    }

    loadCart() {
        try {
            const stored = JSON.parse(localStorage.getItem('ks_drives_cart') || '[]');
            // Validate: Ensure it is an array and items have IDs
            if (Array.isArray(stored)) {
                return stored.filter(item => item && item.name); // Filter out bad objects
            }
            return [];
        } catch { return []; }
    }

    addToCart(product) {
        if (!product) return;

        // Ensure cart is array
        if (!Array.isArray(this.state.cart)) this.state.cart = [];

        this.state.cart.push({
            ...product,
            cartId: String(Date.now() + Math.random().toString(36).substr(2, 9))
        });

        console.log("Cart updated:", this.state.cart);
        this.saveCart();
        if (window.refreshCartUI) window.refreshCartUI();
    }

    removeFromCart(cartId) {
        // Instant delete, type-safe comparison
        this.state.cart = this.state.cart.filter(item => String(item.cartId) !== String(cartId));
        this.saveCart();
        if (window.refreshCartUI) window.refreshCartUI();
    }

    clearCart() {
        this.state.cart = [];
        this.saveCart();
        if (window.refreshCartUI) window.refreshCartUI();
    }

    saveCart() {
        localStorage.setItem('ks_drives_cart', JSON.stringify(this.state.cart));
        this.notify();
    }

    async checkAuth() {
        try {
            const res = await fetch('/api/auth-status');
            const data = await res.json();
            if (data.authenticated) {
                this.state.editMode = true;
                this.notify();
            }
        } catch (e) {
            console.error("Auth check failed:", e);
        }
    }

    // Load from LocalStorage (Sync) - Instant render
    loadLocalContent() {
        const storedStr = localStorage.getItem('ks_drives_content_v12');
        if (storedStr) {
            const stored = JSON.parse(storedStr);

            // FIX: Force Add Industrial Automation if missing (for legacy v8->v9 migrations)
            if (stored.pages && stored.pages.domains && stored.pages.domains.sections) {
                const hasAuto = stored.pages.domains.sections.some(s => s.title === 'Industrial Automation');
                if (!hasAuto) {
                    stored.pages.domains.sections.push({
                        title: "Industrial Automation",
                        content: "Reliable PLC and SCADA systems for streamlined manufacturing processes.",
                        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"
                    });
                }
            }
            // Ensure Home Page also has it
            if (stored.pages && stored.pages.home && stored.pages.home.domains && stored.pages.home.domains.items) {
                const hasAutoHome = stored.pages.home.domains.items.some(i => i.title === 'Industrial Automation');
                if (!hasAutoHome) {
                    stored.pages.home.domains.items.push({ title: "Industrial Automation", desc: "Reliable controllers for heavy industry.", icon: "Factory" });
                }
            }

            // Merge defaults for missing fields (simple migration)
            if (!stored.companyInfo.phone && defaultContent.companyInfo.phone) {
                stored.companyInfo.phone = defaultContent.companyInfo.phone;
            }
            return stored;
        }

        // Return default if no storage or outdated
        return JSON.parse(JSON.stringify(defaultContent));
    }

    // Fetch from Backend (Async) - Server truth
    async fetchBackendContent() {
        try {
            const res = await fetch('/api/content');
            if (res.ok) {
                const data = await res.json();
                if (Object.keys(data).length > 0) {
                    this.state.content = data;
                    // Update local cache
                    localStorage.setItem('ks_drives_content_v12', JSON.stringify(data));
                    this.notify();
                    console.log("Synced with backend.");
                } else {
                    // First time: backend empty, save current default
                    this.saveContent();
                }
            }
        } catch (e) {
            console.warn("Backend unavailable, using local content:", e);
        }
    }

    async saveContent(silent = false) {
        // 1. Save to LocalStorage (Optimistic UI)
        try {
            localStorage.setItem('ks_drives_content_v12', JSON.stringify(this.state.content));
            if (!silent) {
                this.notify(); // Update UI
                // Flash "Auto-saved" badge
                const badge = document.getElementById('save-badge');
                if (badge) {
                    badge.classList.remove('opacity-0');
                    setTimeout(() => badge.classList.add('opacity-0'), 2000);
                }
            }
        } catch (e) {
            console.error("Local storage save failed", e);
            // Handle quota exceeded?
        }

        // 2. Save to Backend (Secure)
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state.content)
            });

            if (res.status === 401) {
                console.warn("Session expired. Content saved locally only.");
                alert("Session expired. Please login again to save changes permanently.");
                this.state.editMode = false;
                this.notify();
            }
        } catch (e) {
            // console.error("Backend save failed:", e);
            // alert("Warning: Changes could not be saved to server. " + e.message);
            // Silent fail for static hosting
        }
    }

    // New: Upload Image to Backend
    // New: Upload Image to Cloudinary (Preferred)
    async uploadImage(file) {
        // 1. Try Cloudinary Upload (Free Usage Tier)
        try {
            const CLOUD_NAME = 'dpkbzdodo';
            const UPLOAD_PRESET = 'Products'; // Must be Unsigned
            const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            console.log("Uploading to Cloudinary...");
            const res = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Cloudinary upload success:", data.secure_url);
                return data.secure_url; // Return the remote URL
            } else {
                const err = await res.json();
                console.error("Cloudinary error:", err);
                alert("Cloudinary Upload Failed: " + (err.error?.message || "Unknown error"));
            }
        } catch (e) {
            console.warn("Cloudinary upload failed (Offline?):", e);
        }

        // 2. Fallback: Direct Client-Side Compression (Base64)
        // Allows upload without internet or backend.
        console.warn("Falling back to local Base64 storage (Not recommended for many images).");
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const MAX_WIDTH = 1000;
                    const MAX_HEIGHT = 1000;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
                    resolve(dataUrl);
                };
            };
            reader.onerror = reject;
        });
    }

    resetContent() {
        if (confirm("Are you sure you want to reset all content to default? This cannot be undone.")) {
            this.state.content = JSON.parse(JSON.stringify(defaultContent));
            this.saveContent();
        }
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => {
            try {
                listener(this.state);
            } catch (e) {
                console.error("Listener failed:", e);
            }
        });
    }

    async login(password) {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                this.state.editMode = true;
                this.notify();
                return true;
            }
        } catch (e) {
            console.warn("Backend login failed (Static Mode?):", e);
        }

        // Static Fallback
        // WARNING: This is client-side only and visible in source code.
        // Intended for static hosting (GitHub Pages) where no backend exists.
        if (password === 'admin') {
            console.log("Logged in via Static Mode (Local Admin).");
            localStorage.setItem('ks_drives_admin_static', 'true');
            this.state.editMode = true;
            this.notify();
            return true;
        }

        return false;
    }

    async logout() {
        try {
            await fetch('/api/logout', { method: 'POST' });
        } catch (e) { console.error(e); }
        localStorage.removeItem('ks_drives_admin_static');
        this.state.editMode = false;
        this.notify();
    }

    // Generic update function for deep paths
    update(path, value, silent = false) {
        this.pushHistory(); // Save state before change
        const keys = path.split('.');
        let current = this.state.content;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        this.saveContent(silent);
    }

    // Array manipulation
    addItem(path, item) {
        this.pushHistory(); // Save state before change
        const keys = path.split('.');
        let current = this.state.content;
        for (let i = 0; i < keys.length; i++) {
            current = current[keys[i]];
        }
        if (Array.isArray(current)) {
            current.push(item);
            this.saveContent();
        }
    }

    removeItem(path, index) {
        this.pushHistory(); // Save state before change
        const keys = path.split('.');
        let current = this.state.content;
        for (let i = 0; i < keys.length; i++) {
            current = current[keys[i]];
        }
        if (Array.isArray(current)) {
            current.splice(index, 1);
            this.saveContent();
        }
    }

    moveItem(path, index, direction) {
        this.pushHistory(); // Save state before change
        const keys = path.split('.');
        let current = this.state.content;
        for (let i = 0; i < keys.length; i++) {
            current = current[keys[i]];
        }
        if (Array.isArray(current)) {
            if (direction === 'up' && index > 0) {
                [current[index], current[index - 1]] = [current[index - 1], current[index]];
            } else if (direction === 'down' && index < current.length - 1) {
                [current[index], current[index + 1]] = [current[index + 1], current[index]];
            }
            this.saveContent();
        }
    }

    // History / Undo System
    pushHistory() {
        this.history.push(JSON.stringify(this.state.content));
        if (this.history.length > 50) this.history.shift(); // Limit history
    }

    undo() {
        if (this.history.length > 0) {
            const previousState = this.history.pop();
            this.state.content = JSON.parse(previousState);
            this.saveContent(); // Save restored state
            // Explicitly notify to ensure UI updates
            this.notify();
            console.log("Undid last action.");
            return true;
        } else {
            alert("Nothing to undo!");
            return false;
        }
    }

    // Download current JSON
    downloadConfig() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state.content, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "site_content.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}

export const store = new Store();
