import { store } from '../store.js';

export function renderNavbar(currentRoute) {
    const navLinks = [
        { name: 'Home', path: '#home' },
        { name: 'About Us', path: '#about' },
        { name: 'Products', path: '#products' },
        { name: 'Domains', path: '#domains' },
        { name: 'Services', path: '#services' },
        { name: 'Contact', path: '#contact' }
    ];

    if (store.state.editMode) {
        navLinks.push({ name: 'Dashboard', path: '#admin', special: true });
    }

    return `
        <nav class="bg-brand-blue/95 backdrop-blur-md shadow-lg fixed w-full z-50 transition-all duration-300 border-b border-white/10" id="navbar">
            <div class="container mx-auto px-6 py-4">
                <div class="flex justify-between items-center">
                    <!-- Logo -->
                    <a href="#home" class="flex items-center gap-3 group">
                        <div class="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">
                            KS
                        </div>
                        <span class="text-2xl font-bold text-white tracking-tight group-hover:text-brand-accent transition-colors">
                            KS Drives and Controls
                        </span>
                    </a>

                    <!-- Desktop Menu -->
                    <div class="hidden lg:flex items-center gap-8">
                        <div class="flex items-center gap-8">
                            ${navLinks.map(link => {
        if (link.special) {
            return `
                <a href="${link.path}" 
                   class="bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-lg font-bold transition-all shadow-lg flex items-center gap-2 ml-4">
                    <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                    <span>${link.name}</span>
                </a>
            `;
        }
        if (link.name === 'Contact') {
            return `
                                        <a href="${link.path}" 
                                           class="bg-brand-accent text-white hover:bg-sky-400 px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-sky-900/20 hover:shadow-sky-500/40 hover:-translate-y-0.5 ml-4 flex items-center gap-2">
                                            <span>${link.name}</span>
                                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                        </a>
                                    `;
        }
        return `
                                    <a href="${link.path}" 
                                       class="text-[15px] font-medium text-slate-300 hover:text-white transition-colors relative group py-2">
                                        ${link.name}
                                        <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-accent transition-all group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                                    </a>
                                `;
    }).join('')}
                        </div>


                    </div>
                    <!-- Mobile Menu Button (simplified) -->
                    <button class="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                        <i data-lucide="menu" class="w-8 h-8"></i>
                    </button>
                </div>
            </div>
        </nav>
    `;
}
