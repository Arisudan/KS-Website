import { store } from '../store.js';

export function renderProducts() {
    const { content, editMode } = store.state;
    const { categories } = content.pages.products;
    const editClass = editMode ? 'editable-active' : '';

    return `
        <header class="bg-brand-dark py-20 text-center relative overflow-hidden">
             <!-- Background Pattern -->
             <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#64748b 1px, transparent 1px); background-size: 30px 30px;"></div>
             
             <div class="container mx-auto px-6 relative z-10">
                <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">Our Products</h1>
                <p class="text-slate-300 max-w-2xl mx-auto">High-performance solutions for industrial applications.</p>
            </div>
        </header>

        <div class="bg-slate-50 py-12">
            <div class="container mx-auto px-6 space-y-20">
                ${categories.map((category, catIndex) => `
                    <section id="${category.id}" class="scroll-mt-24">
                        <div class="flex items-center justify-between mb-8">
                            <h2 class="text-3xl font-bold text-brand-dark border-l-4 border-brand-accent pl-4 ${editClass}" 
                                data-editable="pages.products.categories.${catIndex}.title">
                                ${category.title}
                            </h2>
                            ${editMode ? `<button class="text-sm bg-brand-light border border-slate-300 px-3 py-1 rounded hover:bg-white" onclick="store.addItem('pages.products.categories.${catIndex}.products', {name: 'New Product', specs: 'Specs', image: 'https://placehold.co/300x200?text=New+Product'})">+ Add Product</button>` : ''}
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            ${category.products.map((product, prodIndex) => `
                                <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 group">
                                    <div class="h-72 overflow-hidden relative editable-img-wrapper bg-white flex items-center justify-center p-4 border-b border-slate-100">
                                        <img src="${product.image}" data-img-editable="pages.products.categories.${catIndex}.products.${prodIndex}.image" 
                                             class="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" alt="${product.name}">
                                        ${editMode ? '<div class="editable-img-overlay text-white"><i data-lucide="camera" class="mr-2"></i> Change</div>' : ''}
                                        
                                        ${editMode ? `
                                            <div class="absolute top-2 right-2 flex gap-1 z-20">
                                                ${prodIndex > 0 ? `
                                                <button class="bg-white text-slate-600 p-1 rounded-full shadow hover:bg-brand-light" 
                                                    title="Move Up"
                                                    onclick="store.moveItem('pages.products.categories.${catIndex}.products', ${prodIndex}, 'up')">
                                                    <i data-lucide="chevron-left" class="w-4 h-4"></i>
                                                </button>` : ''}
                                                ${prodIndex < category.products.length - 1 ? `
                                                <button class="bg-white text-slate-600 p-1 rounded-full shadow hover:bg-brand-light" 
                                                    title="Move Down"
                                                    onclick="store.moveItem('pages.products.categories.${catIndex}.products', ${prodIndex}, 'down')">
                                                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                                </button>` : ''}
                                                <button class="bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                                                    title="Delete"
                                                    onclick="store.removeItem('pages.products.categories.${catIndex}.products', ${prodIndex})">
                                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                </button>
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="p-6">
                                        <h3 class="text-xl font-bold text-brand-dark mb-2 ${editClass}" 
                                            data-editable="pages.products.categories.${catIndex}.products.${prodIndex}.name">
                                            ${product.name}
                                        </h3>
                                        
                                        ${product.description ? `
                                        <p class="text-slate-600 text-sm mb-4 leading-relaxed ${editClass}"
                                            data-editable="pages.products.categories.${catIndex}.products.${prodIndex}.description">
                                            ${product.description}
                                        </p>
                                        ` : ''}

                                        ${product.details ? `
                                        <div class="bg-brand-light rounded-lg p-3 mb-4 space-y-2">
                                            ${Object.entries(product.details).map(([key, val]) => `
                                                <div class="flex justify-between text-xs border-b border-slate-200 last:border-0 pb-1 last:pb-0">
                                                    <span class="font-semibold text-slate-700">${key}:</span>
                                                    <span class="text-slate-600 text-right ml-2">${val}</span>
                                                </div>
                                            `).join('')}
                                        </div>
                                        ` : `
                                        <p class="text-slate-500 font-mono text-sm mb-4 ${editClass}" 
                                           data-editable="pages.products.categories.${catIndex}.products.${prodIndex}.specs">
                                           ${product.specs}
                                        </p>
                                        `}
                                        
                                        <button class="w-full py-2 bg-brand-blue text-white font-semibold rounded hover:bg-brand-dark transition-colors shadow-md">
                                            Contact for Quote
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                `).join('')}
            </div>
        </div>
    `;
}
