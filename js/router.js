import { store } from './store.js';
import { renderHome } from './pages/home.js';
import { renderAbout } from './pages/about.js';
import { renderProducts } from './pages/products.js';
import { renderDomains } from './pages/domains.js';
import { renderServices } from './pages/services.js';
import { renderContact } from './pages/contact.js?v=2025_FINAL';
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js?v=2025_FINAL';

export function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('load', handleRoute);
}

function handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const app = document.getElementById('app');

    // Clear and Re-render (Simple SPA approach)
    // In a real app we might diff, but for this scale, full re-render is fine
    // especially since we need to re-bind edit listeners potentially.
    // Actually, store subscription will handle re-renders. 
    // Router just sets the current page in state? No, router drives the "Main" view.

    renderApp(hash);
}

export function renderApp(route) {
    const app = document.getElementById('app');
    const { content, editMode } = store.state;

    // Header
    const headerHTML = renderNavbar(route);

    // Page Content
    let pageHTML = '';
    switch (route) {
        case 'home': pageHTML = renderHome(); break;
        case 'about': pageHTML = renderAbout(); break;
        case 'products': pageHTML = renderProducts(); break;
        case 'domains': pageHTML = renderDomains(); break;
        case 'services': pageHTML = renderServices(); break;
        case 'contact': pageHTML = renderContact(); break;
        default: pageHTML = renderHome();
    }

    // Footer
    const footerHTML = renderFooter();

    app.innerHTML = `
        ${headerHTML}
        <main class="flex-grow pt-16">
            ${pageHTML}
        </main>
        ${footerHTML}
    `;

    // Re-initialize icons
    // @ts-ignore
    if (window.lucide) window.lucide.createIcons();

    // Post-render hooks (scroll to top)
    window.scrollTo(0, 0);
}
