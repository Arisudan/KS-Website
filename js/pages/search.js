import { store } from '../store.js';

export function renderSearch() {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const query = (params.get('q') || '').toLowerCase().trim();

    if (!query) {
        return `
            <div class="pt-24 min-h-screen bg-slate-50">
                <div class="container mx-auto px-6 text-center">
                    <h1 class="text-3xl font-bold text-slate-800 mb-4">Search</h1>
                    <p class="text-slate-600 mb-8">Please enter a keyword to search.</p>
                    
                    <div class="max-w-xl mx-auto">
                        <div class="relative group">
                            <input type="text" placeholder="Search..." 
                                onkeyup="if(event.key === 'Enter') window.location.hash='#search?q='+this.value"
                                class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full focus:ring-2 focus:ring-brand-accent/30 outline-none shadow-sm transition-all text-slate-700">
                            <i data-lucide="search" class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    const { content } = store.state;
    const results = [];

    // Search Products
    // Fix: Access correct path in store (content.pages.products)
    const productData = content.pages && content.pages.products;
    if (productData && productData.categories) {
        productData.categories.forEach(cat => {
            if (cat.title && cat.title.toLowerCase().includes(query)) {
                results.push({ type: 'Category', title: cat.title, link: '#products' });
            }
            if (cat.products) {
                cat.products.forEach(item => {
                    // Check name, specs, description if exists
                    const textToSearch = (item.name + ' ' + (item.specs || '')).toLowerCase();
                    if (textToSearch.includes(query)) {
                        results.push({
                            type: 'Product',
                            title: item.name,
                            desc: item.specs, // Using specs as desc
                            link: '#products', // Ideally #products?id=... but simplistic for now
                            image: item.image
                        });
                    }
                });
            }
        });
    }

    // Search Services
    if (content.services && content.services.items) {
        content.services.items.forEach(svc => {
            if (svc.title.toLowerCase().includes(query) || svc.description.toLowerCase().includes(query)) {
                results.push({
                    type: 'Service',
                    title: svc.title,
                    desc: svc.description,
                    link: '#services',
                    icon: svc.icon
                });
            }
        });
    }

    // Search Domains
    if (content.domains && content.domains.items) {
        content.domains.items.forEach(dom => {
            if (dom.title.toLowerCase().includes(query) || dom.text.toLowerCase().includes(query)) {
                results.push({
                    type: 'Domain',
                    title: dom.title,
                    desc: dom.text,
                    link: '#domains',
                    icon: dom.icon
                });
            }
        });
    }

    return `
        <div class="pt-24 min-h-screen bg-slate-50">
            <div class="container mx-auto px-6 py-8">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-brand-dark mb-2">Search Results</h1>
                    <p class="text-slate-600">Found ${results.length} result(s) for "<span class="font-semibold text-brand-accent">${query}</span>"</p>
                    
                    <div class="mt-6 max-w-xl">
                        <div class="relative group">
                            <input type="text" placeholder="Search again..." 
                                value="${query}"
                                onkeyup="if(event.key === 'Enter') window.location.hash='#search?q='+this.value"
                                class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full focus:ring-2 focus:ring-brand-accent/30 outline-none shadow-sm transition-all text-slate-700">
                            <i data-lucide="search" class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                        </div>
                    </div>
                </div>

                ${results.length === 0 ? `
                    <div class="bg-white p-12 rounded-xl shadow-sm text-center">
                        <div class="inline-block p-4 bg-slate-100 rounded-full mb-4">
                            <i data-lucide="search-x" class="w-8 h-8 text-slate-400"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-slate-800 mb-2">No matches found</h3>
                        <p class="text-slate-500">Try checking your spelling or using different keywords.</p>
                    </div>
                ` : `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${results.map(res => `
                            <a href="${res.link}" class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col h-full group">
                                <div class="flex items-start justify-between mb-4">
                                    <span class="text-xs font-bold uppercase tracking-wider text-brand-accent bg-blue-50 px-2 py-1 rounded">
                                        ${res.type}
                                    </span>
                                    ${res.icon ? `<i data-lucide="${res.icon}" class="w-5 h-5 text-slate-400 group-hover:text-brand-accent transition-colors"></i>` : ''}
                                </div>
                                
                                ${res.image ? `
                                    <div class="w-full h-32 mb-4 overflow-hidden rounded-lg bg-slate-50">
                                        <img src="${res.image}" alt="${res.title}" class="w-full h-full object-cover">
                                    </div>
                                ` : ''}

                                <h3 class="text-lg font-bold text-slate-800 mb-2 group-hover:text-brand-accent transition-colors">${res.title}</h3>
                                ${res.desc ? `<p class="text-slate-600 text-sm line-clamp-3">${res.desc}</p>` : ''}
                            </a>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
}
