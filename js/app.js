import { store } from './store.js';
// Expose store globally for inline onclick handlers
window.store = store;

import { initRouter, renderApp } from './router.js';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    setupAdminControls();
    setupGlobalListeners();

    // Initial Render
    store.subscribe(() => {
        // Re-render current route on state change
        const currentRoute = window.location.hash.slice(1) || 'home';
        renderApp(currentRoute);
        setupAdminControls(); // Re-render controls if state changed
    });

    // Render controls once
    updateAdminControlsUI();
});

function setupAdminControls() {
    // Only bind modal events once
    const modal = document.getElementById('login-modal');
    const form = document.getElementById('login-form');
    const closeBtn = document.getElementById('close-modal');
    const passwordInput = document.getElementById('admin-password');
    const errorMsg = document.getElementById('login-error');

    // Prevent duplicate bindings if called multiple times (though we should avoid calling this multiple times for events)
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

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = passwordInput.value;
            if (store.login(password)) {
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

    // Create buttons
    container.innerHTML = `
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
    toggleBtn.addEventListener('click', () => {
        if (store.state.editMode) {
            store.logout();
        } else {
            const modal = document.getElementById('login-modal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.getElementById('admin-password').focus();
        }
    });

    if (editMode) {
        document.getElementById('undo-change').addEventListener('click', () => store.undo());
        document.getElementById('download-config').addEventListener('click', () => store.downloadConfig());
        document.getElementById('reset-config').addEventListener('click', () => store.resetContent());
    }

    // Initialize Icons
    if (window.lucide) window.lucide.createIcons({ root: container });
}

function setupGlobalListeners() {
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
