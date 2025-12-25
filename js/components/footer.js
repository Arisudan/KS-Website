import { store } from '../store.js';

export function renderFooter() {
    const { content } = store.state;
    const { companyInfo } = content;

    return `
        <footer class="bg-brand-blue text-slate-300 py-12 mt-auto">
            <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div class="col-span-1 md:col-span-1">
                    <h3 class="text-white text-lg font-bold mb-4">KS Drives and Controls</h3>
                    <p class="text-sm opacity-80 mb-4">
                        Pioneering the future of industrial automation and control systems.
                    </p>
                </div>
                
                <div>
                    <h4 class="text-white font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="#about" class="hover:text-brand-accent">About Us</a></li>
                        <li><a href="#products" class="hover:text-brand-accent">Products</a></li>
                        <li><a href="#services" class="hover:text-brand-accent">Services</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-semibold mb-4">Contact</h4>
                    <ul class="space-y-3 text-sm">
                        <li class="flex items-start gap-3">
                             <i data-lucide="map-pin" class="w-5 h-5 shrink-0 mt-0.5"></i>
                             <span data-editable="companyInfo.address" class="leading-snug">${companyInfo.address}</span>
                        </li>
                        <li class="flex items-center gap-3">
                             <i data-lucide="mail" class="w-5 h-5 shrink-0"></i>
                             <span data-editable="companyInfo.email">${companyInfo.email}</span>
                        </li>
                        <li class="flex items-center gap-3">
                             <i data-lucide="user" class="w-5 h-5 shrink-0"></i>
                             <span>Director Proprietor: <span data-editable="companyInfo.owner">${companyInfo.owner}</span></span>
                        </li>
                        <li class="flex items-center gap-3">
                             <i data-lucide="phone" class="w-5 h-5 shrink-0"></i>
                             <span data-editable="companyInfo.phone">${companyInfo.phone}</span>
                        </li>
                        <li class="flex items-center gap-3">
                             <i data-lucide="file-text" class="w-5 h-5 shrink-0"></i>
                             <span>GST: <span data-editable="companyInfo.gst">${companyInfo.gst}</span></span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-semibold mb-4">Social</h4>
                    <div class="flex gap-4">
                        <a href="#" class="hover:text-white"><i data-lucide="linkedin"></i></a>
                        <a href="#" class="hover:text-white"><i data-lucide="twitter"></i></a>
                    </div>
                </div>
            </div>
            <div class="border-t border-slate-700 mt-12 pt-8 text-center text-sm opacity-60">
                &copy; ${new Date().getFullYear()} KS Drives and Controls. All rights reserved.
            </div>
        </footer>
    `;
}
