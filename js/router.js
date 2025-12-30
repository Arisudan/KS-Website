import { store } from './store.js';
// Assuming store import doesn't have version here, but I will update a page import to force refresh.
import { renderHome, setupHomeInteractions } from './pages/home.js?v=CONTENT_REORDER';
import { renderAbout } from './pages/about.js';
import { renderProducts } from './pages/products.js?v=PROD_SEARCH_MOVED';
import { renderDomains } from './pages/domains.js?v=DOMAINS_FORCE_FIX';
import { renderServices } from './pages/services.js?v=SERVICES_GLASS';
import { renderContact } from './pages/contact.js?v=STATIC_MIGRATION';
import { renderNavbar } from './components/navbar.js?v=MOBILE_MENU_V2';
import { renderFooter } from './components/footer.js?v=FOOTER_ALIGN_FIX';
import { renderAdmin } from './pages/admin.js?v=HYBRID_UPLOAD_V2';
import { renderSearch } from './pages/search.js?v=SEARCH_PAGE_FIX';

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
    if (!document.getElementById('main-content')) {
        app.innerHTML = `
            ${renderNavbar(cleanRoute)}
            <main id="main-content" class="flex-grow pt-16 min-h-screen">
                ${pageHTML}
            </main>
            ${renderFooter()}
        `;
    } else {
        // 2. SPA Update (Subsequent Loads)
        // Only replace the content, keep the shell (Nav/Footer)
        const main = document.getElementById('main-content');
        if (main) main.innerHTML = pageHTML;

        // Update Navbar Active State
        updateNavbarActiveState(cleanRoute);

        // Update Mobile Menu (Close it)
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.classList.add('hidden');
    }

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
