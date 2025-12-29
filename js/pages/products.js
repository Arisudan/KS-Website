import { store } from '../store.js';

export function renderProducts() {
    const { content, editMode } = store.state;
    const { categories } = content.pages.products;
    const editClass = editMode ? 'editable-active' : '';

    // Expose Modal Logic
    window.showProductModal = (catIndex, prodIndex) => {
        // Find product
        const product = content.pages.products.categories[catIndex].products[prodIndex];
        const modal = document.getElementById('product-modal');

        // Populate Data
        document.getElementById('modal-img').src = product.image;
        document.getElementById('modal-title').innerText = product.name;
        document.getElementById('modal-desc').innerText = product.specs || "No additional details available.";

        // Mock Detailed Specs List
        const specsList = document.getElementById('modal-specs');
        specsList.innerHTML = `
            <li class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Category</span> <span class="font-medium text-slate-800">${content.pages.products.categories[catIndex].title}</span>
            </li>
            <li class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Availability</span> <span class="font-medium text-green-600">In Stock</span>
            </li>
            <li class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Support</span> <span class="font-medium text-slate-800">24/7 Technical</span>
            </li>
        `;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    window.closeProductModal = () => {
        const modal = document.getElementById('product-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    };

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
                    <section id="${category.id}" class="scroll-mt-32">
                        <div class="flex items-center justify-between mb-8 sticky top-[4.5rem] z-30 bg-slate-50/95 backdrop-blur-sm py-4 border-b border-slate-200 transition-all gap-4">
                            <h2 class="text-3xl font-bold text-brand-dark border-l-4 border-brand-accent pl-4 ${editClass}" 
                                data-editable="pages.products.categories.${catIndex}.title">
                                ${category.title}
                            </h2>
                            
                            <div class="flex items-center gap-3">
                                ${catIndex === 0 ? `
                                <div class="relative group hidden md:block">
                                    <input type="text" placeholder="Search products..." 
                                        onkeyup="if(event.key === 'Enter') window.location.hash='#search?q='+this.value"
                                        class="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-brand-accent/50 w-64 transition-all outline-none text-slate-700 shadow-sm focus:shadow-md">
                                    <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-brand-accent transition-colors"></i>
                                </div>
                                ` : ''}

                                ${editMode ? `<button class="text-sm bg-brand-light border border-slate-300 px-3 py-1 rounded hover:bg-white whitespace-nowrap" onclick="store.addItem('pages.products.categories.${catIndex}.products', {name: 'New Product', specs: 'Specs', image: 'assets/uploads/placeholder_product.jpg'})">+ Add Product</button>` : ''}
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            ${category.products.map((product, prodIndex) => `
                                <div class="bg-white rounded-lg border border-slate-200 hover:border-brand-accent transition-all duration-200 group cursor-pointer relative"
                                     onclick="if(!event.target.closest('button') && !event.target.closest('.editable-img-overlay')) showProductModal(${catIndex}, ${prodIndex})">
                                    
                                    <!-- Image Container -->
                                    <div class="aspect-square relative overflow-hidden bg-white p-4 flex items-center justify-center rounded-t-lg editable-img-wrapper">
                                        <img src="${product.image}" data-img-editable="pages.products.categories.${catIndex}.products.${prodIndex}.image" 
                                             class="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-300" alt="${product.name}">
                                        
                                        <!-- Admin Overlays -->
                                        ${editMode ? '<div class="editable-img-overlay text-white"><i data-lucide="camera" class="mr-2"></i> Change</div>' : ''}
                                        ${editMode ? `
                                            <div class="absolute top-1 right-1 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <button class="bg-red-500 text-white p-1 rounded-sm shadow hover:bg-red-600 scale-75"
                                                    title="Delete"
                                                    onclick="event.stopPropagation(); store.removeItem('pages.products.categories.${catIndex}.products', ${prodIndex})">
                                                    <i data-lucide="trash-2" class="w-3 h-3"></i>
                                                </button>
                                            </div>
                                        ` : ''}

                                        <!-- View Detail Overlay (Professional) -->
                                        <div class="absolute inset-x-0 bottom-0 bg-brand-dark/80 text-white text-center py-1.5 text-xs font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                                            Quick View
                                        </div>
                                    </div>

                                    <!-- Content -->
                                    <div class="p-3 border-t border-slate-100">
                                        <h3 class="text-sm font-semibold text-slate-800 leading-tight mb-1 truncate ${editClass}" 
                                            title="${product.name}"
                                            data-editable="pages.products.categories.${catIndex}.products.${prodIndex}.name">
                                            ${product.name}
                                        </h3>
                                        <p class="text-xs text-slate-500 truncate ${editClass}" 
                                           data-editable="pages.products.categories.${catIndex}.products.${prodIndex}.specs">
                                            ${product.specs || 'Standard Spec'}
                                        </p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                `).join('')}
            </div>
            
            <!-- Product Modal -->
            <div id="product-modal" class="hidden fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm justify-center items-center p-4 transition-all" onclick="if(event.target===this) closeProductModal()">
                <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative animate-[fadeIn_0.2s_ease-out]">
                    <button onclick="closeProductModal()" class="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-slate-100 text-slate-600 z-10 shadow-sm transition-colors">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                    
                    <!-- Image Side -->
                    <div class="w-full md:w-1/2 bg-slate-100 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-100">
                        <img id="modal-img" src="" alt="Product" class="max-w-full max-h-[400px] object-contain drop-shadow-lg">
                    </div>

                    <!-- Content Side -->
                    <div class="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
                        <h2 id="modal-title" class="text-3xl font-bold text-brand-dark mb-2"></h2>
                        <div class="w-12 h-1 bg-brand-accent rounded mb-6"></div>
                        
                        <div class="prose prose-sm text-slate-600 mb-8 max-w-none">
                            <p id="modal-desc" class="text-base leading-relaxed"></p>
                        </div>
                        
                        <div class="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h4 class="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Technical Specifications</h4>
                            <ul id="modal-specs" class="space-y-2 text-sm">
                                <!-- Specs injected here -->
                            </ul>
                        </div>

                        <div class="mt-auto flex gap-4">
                            <a href="#contact" onclick="closeProductModal()" class="flex-1 bg-brand-accent text-white text-center font-bold py-3.5 rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 transform hover:-translate-y-0.5">
                                Request Quote
                            </a>
                            <a href="#" class="flex-none bg-white text-slate-600 p-3.5 rounded-xl hover:bg-slate-50 border border-slate-200 shadow-sm transition-colors" title="Download Datasheet">
                                <i data-lucide="file-down" class="w-5 h-5"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
