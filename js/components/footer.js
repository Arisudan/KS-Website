import { store } from '../store.js';

export function renderFooter() {
    const { content } = store.state;
    const { companyInfo } = content;

    return `
        <footer class="bg-brand-dark text-slate-300 pt-20 pb-10 mt-auto relative overflow-hidden">
             <!-- Massive Watermark Logo -->
             <div class="absolute -top-10 -right-10 text-[15rem] leading-none font-black text-white opacity-[0.03] select-none pointer-events-none z-0">
                 KS
             </div>

            <div class="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-slate-700/50 pb-12">
                <div class="col-span-1 md:col-span-1">
                    <div class="flex items-center gap-2 mb-6">
                        <div class="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center text-white font-bold text-xl">KS</div>
                        <span class="text-xl font-bold text-white tracking-tight">KS Drives</span>
                    </div>
                    <p class="text-sm opacity-70 leading-relaxed mb-6">
                        Pioneering the future of industrial automation and control systems. Your trusted partner for VFDs, Motors, and PLCs.
                    </p>
                    <div class="flex gap-4">
                        <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-colors"><i data-lucide="linkedin" class="w-4 h-4"></i></a>
                        <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-colors"><i data-lucide="facebook" class="w-4 h-4"></i></a>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-white font-bold mb-6">Quick Links</h4>
                    <ul class="space-y-3 text-sm">
                        <li><a href="#about" class="hover:text-brand-accent transition-colors">About Us</a></li>
                        <li><a href="#products" class="hover:text-brand-accent transition-colors">Product Range</a></li>
                        <li><a href="#services" class="hover:text-brand-accent transition-colors">Services</a></li>
                        <li><a href="#domains" class="hover:text-brand-accent transition-colors">Domains</a></li>
                    </ul>
                </div>

                <div class="col-span-1 md:col-span-2">
                    <h4 class="text-white font-bold mb-6">Contact Information</h4>
                    <ul class="space-y-4 text-sm">
                        <li class="flex items-start gap-4">
                             <div class="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-brand-accent flex-shrink-0"><i data-lucide="map-pin" class="w-5 h-5"></i></div>
                             <div>
                                <span class="block text-white font-medium mb-1">Head Office</span>
                                <span data-editable="companyInfo.address" class="leading-relaxed opacity-80 block text-sm">${companyInfo.address}</span>
                             </div>
                        </li>
                        <li class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-brand-accent flex-shrink-0"><i data-lucide="phone" class="w-5 h-5"></i></div>
                                <span data-editable="companyInfo.phone" class="hover:text-white cursor-pointer font-medium">${companyInfo.phone}</span>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-brand-accent flex-shrink-0"><i data-lucide="mail" class="w-5 h-5"></i></div>
                                <span data-editable="companyInfo.email" class="hover:text-white cursor-pointer font-medium break-all text-sm">${companyInfo.email}</span>
                            </div>
                        </li>
                        <li class="flex items-center gap-4 pt-4 border-t border-slate-700/50">
                             <div class="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0"><i data-lucide="user" class="w-5 h-5"></i></div>
                             <div>
                                 <span class="block text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">Key Personnel</span>
                                 <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                     <span>Dir: <span data-editable="companyInfo.owner" class="text-white font-medium">${companyInfo.owner}</span></span>
                                     <span class="hidden sm:inline text-slate-600">|</span>
                                     <span>GST: <span data-editable="companyInfo.gst" class="font-mono text-slate-400">${companyInfo.gst}</span></span>
                                 </div>
                             </div>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="container mx-auto px-6 text-center">
                 <p class="text-sm opacity-50">&copy; ${new Date().getFullYear()} KS Drives and Controls. All rights reserved.</p>
            </div>
        </footer>
    `;
}
