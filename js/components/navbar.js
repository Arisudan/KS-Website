// import { store } from '../store.js'; // REMOVED to prevent module duplication issues

export function renderNavbar(currentRoute, editMode = false) {
    const navLinks = [
        { name: 'Home', path: '#home' },
        { name: 'About Us', path: '#about' },
        { name: 'Products', path: '#products' },
        { name: 'Domains', path: '#domains' },
        { name: 'Services', path: '#services' }
    ];

    // Explicitly add Contact first (so Dashboard appears to its right)
    navLinks.push({ name: 'Contact', path: '#contact' });

    if (editMode) {
        navLinks.push({ name: 'Dashboard', path: '#admin', special: true });
    }

    return `
        <nav class="bg-brand-blue/95 backdrop-blur-md shadow-lg fixed w-full top-0 left-0 z-50 transition-all duration-300 border-b border-white/10" id="navbar">
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
                   class="bg-emerald-500 !text-white hover:bg-emerald-600 px-4 py-2 rounded-lg font-bold transition-all shadow-lg flex items-center gap-2 ml-4">
                    <i data-lucide="layout-dashboard" class="w-4 h-4 text-white"></i>
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

                    <!-- Mobile Menu Button -->
                    <button id="mobile-menu-btn" onclick="toggleMobileMenu()" class="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-50">
                        <i data-lucide="menu" class="w-8 h-8"></i>
                    </button>
                </div>
            </div>
        </nav>

        <!-- Mobile Fullscreen Menu (Moved OUTSIDE nav to avoid backdrop filter clip) -->
        <div id="mobile-menu" class="fixed inset-0 bg-slate-900 z-[100] transform translate-x-full transition-transform duration-300 lg:hidden flex flex-col">
            <!-- Header inside Menu -->
            <div class="flex justify-between items-center p-6 border-b border-white/10">
                <span class="text-2xl font-bold text-white tracking-tight">Menu</span>
                <button onclick="toggleMobileMenu()" class="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                    <i data-lucide="x" class="w-8 h-8"></i>
                </button>
            </div>
            
            <!-- Menu Items -->
            <div class="flex flex-col items-start p-8 gap-6 w-full overflow-y-auto">
                ${navLinks.map(link => `
                    <a href="${link.path}" onclick="toggleMobileMenu()" 
                       class="text-2xl font-semibold text-white/90 hover:text-brand-accent transition-colors w-full flex items-center justify-between group ${link.special ? 'text-emerald-400' : ''}">
                       <span>${link.name}</span>
                       <i data-lucide="chevron-right" class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-accent"></i>
                    </a>
                `).join('')}
            </div>
            
            <!-- Mobile Footer Info -->
            <div class="mt-auto p-8 text-center text-slate-500 border-t border-white/10 bg-slate-900/50">
                <p class="mb-4">KS Drives and Controls</p>
                <div class="flex gap-6 justify-center">
                    <a href="#" class="text-slate-400 hover:text-white transition-colors"><i data-lucide="linkedin" class="w-6 h-6"></i></a>
                    <a href="#" class="text-slate-400 hover:text-white transition-colors"><i data-lucide="mail" class="w-6 h-6"></i></a>
                    <a href="#" class="text-slate-400 hover:text-white transition-colors"><i data-lucide="phone" class="w-6 h-6"></i></a>
                </div>
            </div>
        </div>
    `;
}
