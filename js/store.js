import { defaultContent } from './data.js';

class Store {
    constructor() {
        this.state = {
            content: this.loadLocalContent(), // Initial load from local/default
            editMode: false,
            user: null
        };
        this.listeners = [];
        this.history = []; // Undo stack

        // Sync with backend on init
        this.fetchBackendContent();
    }

    // Load from LocalStorage (Sync) - Instant render
    loadLocalContent() {
        const storedStr = localStorage.getItem('ks_drives_content_v5');
        if (storedStr) {
            const stored = JSON.parse(storedStr);
            // Merge defaults for missing fields (simple migration)
            if (!stored.companyInfo.phone && defaultContent.companyInfo.phone) {
                stored.companyInfo.phone = defaultContent.companyInfo.phone;
            }
            if (!stored.companyInfo.owner && defaultContent.companyInfo.owner) {
                stored.companyInfo.owner = defaultContent.companyInfo.owner;
            }
            if (!stored.companyInfo.gst && defaultContent.companyInfo.gst) {
                stored.companyInfo.gst = defaultContent.companyInfo.gst;
            }
            if (!stored.companyInfo.mapUrl && defaultContent.companyInfo.mapUrl) {
                stored.companyInfo.mapUrl = defaultContent.companyInfo.mapUrl;
            }
            return stored;
        }
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
                    localStorage.setItem('ks_drives_content_v5', JSON.stringify(data));
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
            localStorage.setItem('ks_drives_content_v5', JSON.stringify(this.state.content));
            if (!silent) this.notify();
        } catch (e) {
            console.error("Local save failed:", e);
            alert("Storage Limit Exceeded! Check console.");
        }

        // 2. Save to Backend
        try {
            await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state.content)
            });
        } catch (e) {
            console.error("Backend save failed:", e);
        }
    }

    // New: Upload Image to Backend
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                return data.url; // Returns relative path e.g. "assets/uploads/123_dog.jpg"
            } else {
                throw new Error("Upload failed");
            }
        } catch (e) {
            console.error("Upload error:", e);
            // Fallback: Return Base64 if server fails (so it still works in session)
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        }
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
        this.listeners.forEach(listener => listener(this.state));
    }

    login(password) {
        if (password === 'admin') {
            this.state.editMode = true;
            this.notify();
            return true;
        }
        return false;
    }

    logout() {
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
