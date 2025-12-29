import { store } from './store.js?v=FIX_STORE_V10';
// Expose store globally for inline onclick handlers
window.store = store;

import { initRouter, renderApp } from './router.js';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    setupAdminControls();
    setupGlobalListeners();
    setupScrollToTop();
    setupWhatsApp();
    setupScrollReveal();
    setup3DTilt();

    // Initial Render
    store.subscribe(() => {
        // Re-render current route on state change
        const currentRoute = window.location.hash.slice(1) || 'home';
        renderApp(currentRoute);

        // Toggle Global Edit Mode Class
        document.body.classList.toggle('edit-mode', store.state.editMode);

        setupAdminControls(); // Re-render controls if state changed
        setupScrollReveal(); // Re-bind scroll animations
        setup3DTilt(); // Re-bind tilt
    });

    // Initial check
    document.body.classList.toggle('edit-mode', store.state.editMode);

    // Render controls once
    updateAdminControlsUI();
});

function setup3DTilt() {
    // Only apply on desktop to save battery/performance on mobile
    if (window.innerWidth < 1024) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        // Add transition for smooth reset
        card.style.transition = 'transform 0.1s ease-out';

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Limit rotation to +/- 5 degrees for a subtle effect
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease-out'; // Slower reset
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            setTimeout(() => { card.style.transition = 'transform 0.1s ease-out'; }, 500);
        });
    });
}

function setupAdminControls() {
    // Only bind modal events once
    const modal = document.getElementById('login-modal');
    const form = document.getElementById('login-form');
    const closeBtn = document.getElementById('close-modal');
    const passwordInput = document.getElementById('admin-password');
    const errorMsg = document.getElementById('login-error');

    // Prevent duplicate bindings if called multiple times
    if (!modal.dataset.bound) {
        modal.dataset.bound = "true";

        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            passwordInput.value = '';
            errorMsg.classList.add('hidden');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeBtn.click();
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = passwordInput.value;
            const success = await store.login(password);
            if (success) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                passwordInput.value = '';
                errorMsg.classList.add('hidden');
            } else {
                errorMsg.classList.remove('hidden');
                passwordInput.select();
            }
        });
    }

    updateAdminControlsUI();
}

function updateAdminControlsUI() {
    const container = document.getElementById('admin-controls');
    const { editMode } = store.state;
    // const isAdminUrl = new URLSearchParams(window.location.search).has('admin'); // Legacy check

    // Security: Hide controls for public users unless they are already logged in
    if (!editMode) {
        container.innerHTML = '';
        return;
    }

    // Create buttons
    container.innerHTML = `
        ${editMode ? `<div class="flex items-center gap-1.5 mr-3 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-100 shadow-sm select-none" id="auto-save-status" title="Your changes are saved automatically"><i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i><span>Auto-saved</span></div>` : ''}
    
        <button id="toggle-edit" class="shadow-lg flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${editMode ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-brand-blue text-white hover:bg-brand-dark'}">
            <i data-lucide="${editMode ? 'save' : 'edit-2'}" class="w-4 h-4"></i>
            ${editMode ? 'Save Changes' : 'Edit Mode'}
        </button>
        ${editMode ? `
        <button id="undo-change" class="shadow-lg bg-slate-600 text-white p-2 rounded-full hover:bg-slate-700" title="Undo Last Change">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
        </button>
        <button id="download-config" class="shadow-lg bg-green-600 text-white p-2 rounded-full hover:bg-green-700" title="Download Config">
            <i data-lucide="download" class="w-4 h-4"></i>
        </button>
        <button id="reset-config" class="shadow-lg bg-red-600 text-white p-2 rounded-full hover:bg-red-700" title="Factory Reset (Clear All Changes)">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
        ` : ''}
    `;

    // Bind Button Events
    const toggleBtn = document.getElementById('toggle-edit');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (store.state.editMode) {
                store.logout();
            }
        });
    }

    if (editMode) {
        document.getElementById('undo-change').addEventListener('click', () => store.undo());
        document.getElementById('download-config').addEventListener('click', () => store.downloadConfig());
        document.getElementById('reset-config').addEventListener('click', () => store.resetContent());
    }

    // Initialize Icons
    if (window.lucide) window.lucide.createIcons({ root: container });
}

function setupGlobalListeners() {
    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl + Shift + / (Question Mark) to toggle Admin Login
        if (e.ctrlKey && e.shiftKey && (e.key === '?' || e.code === 'Slash')) {
            e.preventDefault();
            const modal = document.getElementById('login-modal');
            if (store.state.editMode) {
                store.logout();
            } else {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.getElementById('admin-password').focus();
            }
        }
    });

    // Event Delegation for Editable Elements
    document.addEventListener('click', (e) => {
        const { editMode } = store.state;
        if (!editMode) return;

        // Text Editing
        const target = e.target.closest('[data-editable]');
        if (target && !target.isContentEditable && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            makeEditable(target);
        }

        // Image Editing
        const imgWrapper = e.target.closest('.editable-img-wrapper');
        if (imgWrapper) {
            const img = imgWrapper.querySelector('img');
            const path = img.getAttribute('data-img-editable');
            if (path) handleImageEdit(path);
        }

        // Icon Editing
        const iconWrapper = e.target.closest('[data-icon-editable]');
        if (iconWrapper) {
            const path = iconWrapper.getAttribute('data-icon-editable');
            const currentIcon = iconWrapper.getAttribute('data-lucide-name') || ''; // We'll store the name here
            const newIcon = prompt("Enter Lucide Icon Name (e.g., 'Bot', 'Zap', 'Settings'):", currentIcon);
            if (newIcon && newIcon !== currentIcon) {
                store.update(path, newIcon);
            }
        }
    });
}

function makeEditable(element) {
    const path = element.getAttribute('data-editable');
    const currentText = element.innerText;

    // Create Input
    const input = document.createElement(element.tagName.match(/^H\d$/) ? 'input' : 'textarea');
    input.value = currentText;
    input.className = 'w-full bg-white border-2 border-brand-accent p-1 text-slate-900 rounded focus:outline-none';
    if (element.tagName.match(/^H\d$/)) input.type = 'text';

    // Replace
    element.replaceWith(input);
    input.focus();

    // Save on Blur
    const save = () => {
        const newVal = input.value;
        // Update store silently to avoid full re-render (which causes lag/focus loss)
        store.update(path, newVal, true); // true = silent

        // Manually replace input with original tag to prevent UI flicker/lag
        const newElement = document.createElement(element.tagName);
        newElement.className = element.className;
        // Preserve data attributes
        Array.from(element.attributes).forEach(attr => {
            newElement.setAttribute(attr.name, attr.value);
        });
        newElement.textContent = newVal; // Text content is safe here as it was just typed

        // Restore click listener capability by ensuring it matches the selector
        // (Attributes are already copied)

        input.replaceWith(newElement);
    };

    input.addEventListener('blur', save);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && element.tagName.match(/^H\d$/)) {
            input.blur();
        }
    });
}

function handleImageEdit(path) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Show loading state (optional, but good UX)
                const originalCursor = document.body.style.cursor;
                document.body.style.cursor = 'wait';

                // Upload to backend
                const imageUrl = await store.uploadImage(file);

                // Update store with URL (relative path)
                store.update(path, imageUrl);

                document.body.style.cursor = originalCursor;
            } catch (err) {
                console.error("Image upload failed:", err);
                alert("Failed to upload image.");
                document.body.style.cursor = 'default';
            }
        }
    };

    // Trigger file dialog
    input.click();
}

function setupScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'fixed bottom-6 left-6 z-40 p-3 bg-brand-accent text-white rounded-full shadow-lg transform transition-all duration-300 opacity-0 translate-y-10 hover:bg-sky-600 focus:outline-none';
    btn.innerHTML = '<i data-lucide="arrow-up" class="w-6 h-6"></i>';
    btn.setAttribute('aria-label', 'Scroll to top');

    document.body.appendChild(btn);
    if (window.lucide) window.lucide.createIcons({ root: btn });

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            btn.classList.remove('opacity-0', 'translate-y-10');
            btn.classList.add('opacity-100', 'translate-y-0');
        } else {
            btn.classList.add('opacity-0', 'translate-y-10');
            btn.classList.remove('opacity-100', 'translate-y-0');
        }
    };

    window.addEventListener('scroll', toggleVisibility);
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function setupWhatsApp() {
    // Get phone from store or default
    const phone = store.state.content.companyInfo.phone || '919876543210';
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits

    const waBtn = document.createElement('a');
    waBtn.href = `https://wa.me/${cleanPhone}?text=Hi,%20I%20am%20interested%20in%20your%20products.`;
    waBtn.target = '_blank';
    waBtn.rel = 'noopener noreferrer';
    waBtn.className = 'fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 animate-bounce-subtle';
    waBtn.setAttribute('aria-label', 'Chat on WhatsApp');
    waBtn.title = "Chat with us";

    // WhatsApp Icon (SVG)
    waBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
    `;


    document.body.appendChild(waBtn);
}

function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
