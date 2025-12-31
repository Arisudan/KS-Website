import { store } from './store.js';
// Assuming store import doesn't have version here, but I will update a page import to force refresh.
import { renderHome, setupHomeInteractions } from './pages/home.js?v=V40';
import { renderAbout } from './pages/about.js?v=V40';
import { renderProducts } from './pages/products.js?v=V40';
import { renderDomains } from './pages/domains.js?v=V40';
import { renderServices } from './pages/services.js?v=V40';
import { renderContact } from './pages/contact.js?v=V40';
import { renderNavbar } from './components/navbar.js?v=V40';
import { renderFooter } from './components/footer.js?v=V40';
import { renderAdmin } from './pages/admin.js?v=V40';
import { renderSearch } from './pages/search.js?v=V40';

export function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('load', handleRoute); // Keep this for initial load
}

async function handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    await renderApp(hash);
}

export async function renderApp(route) {
    // Safety: Ensure scroll is unlocked on route change
    document.body.classList.remove('overflow-hidden');

    // Optimized Rendering (Diffing)
    const app = document.getElementById('app');

    // Handle Search Route specially if it contains query params
    const cleanRoute = route.split('?')[0];

    // Page Content Selection
    let pageHTML = '';
    switch (cleanRoute) {
        case 'home': pageHTML = renderHome(); break;
        case 'about': pageHTML = renderAbout(); break;
        case 'products': pageHTML = renderProducts(); break;
        case 'domains': pageHTML = renderDomains(); break;
        case 'services': pageHTML = renderServices(); break;
        case 'contact': pageHTML = renderContact(); break;
        case 'admin': pageHTML = await renderAdmin(); break;
        case 'search': pageHTML = renderSearch(); break;
        default: pageHTML = renderHome();
    }

    // 1. Initial Setup (First Load)
    const headerHTML = renderNavbar(cleanRoute, store.state.editMode);

    if (!document.getElementById('main-content')) {
        app.innerHTML = `
            <div id="header-container">${headerHTML}</div>
            <main id="main-content" class="flex-grow pt-16 min-h-screen">
                ${pageHTML}
            </main>
            ${renderFooter()}
        `;
    } else {
        // 2. SPA Update (Subsequent Loads)
        const main = document.getElementById('main-content');
        if (main) main.innerHTML = pageHTML;

        // Update Header (To show/hide Dashboard button dynamically)
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) headerContainer.innerHTML = renderNavbar(cleanRoute, store.state.editMode);

        // Update Navbar Active State
        updateNavbarActiveState(cleanRoute);

        // Update Mobile Menu (Close it)
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.classList.add('translate-x-full');
    }

    // Post-render hooks
    if (cleanRoute === 'home' || cleanRoute === '') {
        setupHomeInteractions();
    }

    // Re-initialize icons
    if (window.lucide) window.lucide.createIcons();

    // Post-render hooks (scroll to top)
    window.scrollTo(0, 0);
}

// Helper: Update Nav Links without re-rendering
function updateNavbarActiveState(currentRoute) {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        const href = link.getAttribute('href') || '';
        const route = href.replace('#', '');

        if (route === currentRoute) {
            link.classList.add('text-brand-accent');
            link.classList.remove('text-slate-600');
        } else {
            link.classList.remove('text-brand-accent');
            link.classList.add('text-slate-600');
        }
    });
}
