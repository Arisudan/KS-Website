import { store } from '../store.js';

export function renderNavbar(currentRoute) {
    const { content } = store.state;
    const links = [
        { name: 'Home', path: 'home' },
        { name: 'About Us', path: 'about' },
        { name: 'Products', path: 'products' },
        { name: 'Domains', path: 'domains' },
        { name: 'Services', path: 'services' },
        { name: 'Contact', path: 'contact' },
    ];

    const navLinks = links.map(link => `
        <a href="#${link.path}" 
           class="${currentRoute === link.path ? 'text-brand-accent font-semibold' : 'text-slate-600 hover:text-brand-blue'} transition-colors duration-200">
           ${link.name}
        </a>
    `).join('');

    return `
        <nav class="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div class="container mx-auto px-6 h-16 flex items-center justify-between">
                <a href="#home" class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-brand-blue rounded-md flex items-center justify-center text-white font-bold">KS</div>
                    <span class="text-xl font-bold text-brand-blue tracking-tight">KS Drives and Controls</span>
                </a>
                
                <div class="hidden md:flex items-center gap-8">
                    ${navLinks}
                </div>

                <!-- Mobile Menu Button (simplified) -->
                <button class="md:hidden p-2 text-slate-600">
                    <i data-lucide="menu"></i>
                </button>
            </div>
        </nav>
    `;
}
