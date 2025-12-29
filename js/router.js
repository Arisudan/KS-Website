import { store } from './store.js';
import { renderHome, setupHomeInteractions } from './pages/home.js?v=HERO_MOBILE_OPT';
import { renderAbout } from './pages/about.js';
import { renderProducts } from './pages/products.js?v=PROD_SEARCH_MOVED';
import { renderDomains } from './pages/domains.js?v=DOMAINS_FORCE_FIX';
import { renderServices } from './pages/services.js?v=SERVICES_GLASS';
import { renderContact } from './pages/contact.js?v=STATIC_MIGRATION';
import { renderNavbar } from './components/navbar.js?v=MOBILE_MENU_FIX';
import { renderFooter } from './components/footer.js?v=FOOTER_ALIGN_FIX';
import { renderAdmin } from './pages/admin.js?v=HYBRID_UPLOAD_V2';
import { renderSearch } from './pages/search.js?v=SEARCH_PAGE_FIX';

export function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('load', handleRoute); // Keep this for initial load
}

async function handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const app = document.getElementById('app');
    await renderApp(hash);
}

export async function renderApp(route) {
    const app = document.getElementById('app');
    const { content, editMode } = store.state;

    // Handle Search Route specially if it contains query params
    const cleanRoute = route.split('?')[0];

    // Header
    const headerHTML = renderNavbar(cleanRoute);

    // Page Content
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

    // Footer
    const footerHTML = renderFooter();

    app.innerHTML = `
        ${headerHTML}
        <main class="flex-grow pt-16">
            ${pageHTML}
        </main>
        ${footerHTML}
    `;

    // Post-render hooks
    if (cleanRoute === 'home' || cleanRoute === '') {
        setupHomeInteractions();
    }

    // Re-initialize icons
    // @ts-ignore
    if (window.lucide) window.lucide.createIcons();

    // Post-render hooks (scroll to top)
    window.scrollTo(0, 0);
}
