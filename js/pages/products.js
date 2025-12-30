import { store } from '../store.js';

export function renderProducts() {
    const { content, editMode } = store.state;
    const { categories } = content.pages.products;
    const editClass = editMode ? 'editable-active' : '';

    // Collect all unique tags
    const allTags = new Set();
    categories.forEach(cat => cat.products.forEach(p => {
        if (p.tags) p.tags.forEach(t => allTags.add(t));
    }));

    // Expose Modal Logic
    window.showProductModal = (catIndex, prodIndex) => {
        // Store for Add to Cart
        window.currentCatIndex = catIndex;
        window.currentProdIndex = prodIndex;

        // Find product
        const product = content.pages.products.categories[catIndex].products[prodIndex];
        const modal = document.getElementById('product-modal');

        // Populate Data
        document.getElementById('modal-title').innerText = product.name;
        document.getElementById('modal-desc').innerText = product.specs || "No additional details available.";

        // Image or 3D Model handling
        const mediaContainer = document.getElementById('modal-media-container');
        mediaContainer.innerHTML = ''; // Clear previous

        // Always show Standard Image (3D Removed per request)
        mediaContainer.innerHTML = `
             <div class="w-full h-full min-h-[300px] flex items-center justify-center bg-white rounded-xl overflow-hidden relative group p-4 border border-slate-100">
                <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    class="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-105"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
        `;

        // Detailed Specs List
        const specsList = document.getElementById('modal-specs');
        specsList.innerHTML = `
            <li class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Category</span> <span class="font-medium text-slate-800">${content.pages.products.categories[catIndex].title}</span>
            </li>
            ${product.tags ? `
            <li class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Features</span> 
                <div class="flex flex-wrap gap-1 justify-end max-w-[50%]">
                    ${product.tags.map(t => `<span class="text-xs bg-brand-light text-brand-dark px-2 py-0.5 rounded-full">${t}</span>`).join('')}
                </div>
            </li>` : ''}
            <li class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Availability</span> <span class="font-medium text-green-600">In Stock</span>
            </li>
        `;

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Re-init icons for dynamic content
        if (window.lucide) window.lucide.createIcons();
    };

    window.closeProductModal = () => {
        const modal = document.getElementById('product-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        // Stop 3D animations/videos
        document.getElementById('modal-media-container').innerHTML = '';
    };

    // Filter Logic
    window.filterProducts = (tag) => {
        const items = document.querySelectorAll('.product-item');
        items.forEach(item => {
            const itemTags = item.getAttribute('data-tags') || '';
            if (tag === 'all' || itemTags.includes(tag)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // Update active UI
        document.querySelectorAll('.filter-chip').forEach(btn => {
            if (btn.dataset.tag === tag) btn.classList.add('bg-brand-accent', 'text-white', 'border-brand-accent');
            else btn.classList.remove('bg-brand-accent', 'text-white', 'border-brand-accent');
            if (!btn.classList.contains('bg-brand-accent')) btn.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
        });
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

        <div class="bg-slate-50 py-8 sticky top-0 md:top-[74px] z-40 border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/90">
            <div class="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <!-- Filters -->
                <div class="flex flex-wrap gap-2 justify-center">
                    <button class="filter-chip px-4 py-1.5 rounded-full text-sm font-medium border transition-all shadow-sm bg-brand-accent text-white border-brand-accent" onclick="filterProducts('all')" data-tag="all">All</button>
                    ${Array.from(allTags).map(tag => `
                        <button class="filter-chip px-4 py-1.5 rounded-full text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:border-brand-accent hover:text-brand-accent transition-all shadow-sm" onclick="filterProducts('${tag}')" data-tag="${tag}">${tag}</button>
                    `).join('')}
                </div>

                <!-- Search -->
                 <div class="relative group w-full md:w-64">
                    <input type="text" placeholder="Search specs, names..." 
                        onkeyup="const val = this.value.toLowerCase(); document.querySelectorAll('.product-item').forEach(el => { const txt = el.innerText.toLowerCase(); el.style.display = txt.includes(val) ? 'block' : 'none'; })"
                        class="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-brand-accent/50 transition-all outline-none text-slate-700">
                    <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-brand-accent transition-colors"></i>
                </div>
            </div>
        </div>

        <div class="bg-slate-50 py-12 min-h-[60vh]">
            <div class="container mx-auto px-6 space-y-20">
                ${categories.map((category, catIndex) => `
                    <section id="${category.id}" class="scroll-mt-32">
                        <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                             <h2 class="text-2xl font-bold text-brand-dark border-l-4 border-brand-accent pl-4 ${editClass}" 
                                data-editable="pages.products.categories.${catIndex}.title">
                                ${category.title}
                            </h2>
                            ${editMode ? `<button class="text-sm bg-brand-light border border-slate-300 px-3 py-1 rounded hover:bg-white whitespace-nowrap" onclick="store.addItem('pages.products.categories.${catIndex}.products', {name: 'New Product', specs: 'Specs', image: 'assets/uploads/placeholder_product.jpg'})">+ Add Product</button>` : ''}
                        </div>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            ${category.products.map((product, prodIndex) => `
                                <div class="product-item bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-brand-accent/30 transition-all duration-300 group cursor-pointer relative flex flex-col"
                                     data-tags="${product.tags ? product.tags.join(',') : ''} ${category.title}"
                                     onclick="if(!event.target.closest('button') && !event.target.closest('.editable-img-overlay')) showProductModal(${catIndex}, ${prodIndex})">
                                    
                                    <!-- Image Container -->
                                    <div class="aspect-square relative overflow-hidden bg-white p-6 flex items-center justify-center rounded-t-xl editable-img-wrapper">
                                        <img src="${product.image}" data-img-editable="pages.products.categories.${catIndex}.products.${prodIndex}.image" 
                                             class="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500" alt="${product.name}">
                                        
                                        <!-- 3D Badge -->
                                        ${product.model3d ? `<div class="absolute top-2 left-2 bg-brand-dark/80 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm"><i data-lucide="box" class="w-3 h-3"></i> 3D View</div>` : ''}

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
                                    </div>

                                    <!-- Content -->
                                    <div class="p-4 border-t border-slate-100 flex-grow flex flex-col bg-slate-50/50">
                                        ${product.tags ? `<div class="mb-2 flex flex-wrap gap-1">${product.tags.slice(0, 2).map(t => `<span class="text-[10px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded">${t}</span>`).join('')}</div>` : ''}
                                        
                                        <h3 class="text-sm font-bold text-slate-800 leading-tight mb-1 line-clamp-2 ${editClass}" 
                                            title="${product.name}"
                                            data-editable="pages.products.categories.${catIndex}.products.${prodIndex}.name">
                                            ${product.name}
                                        </h3>
                                        <p class="text-xs text-slate-500 line-clamp-2 mb-2 flex-grow ${editClass}" 
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
            <div id="product-modal" class="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm justify-center items-center p-4 transition-all" onclick="if(event.target===this) closeProductModal()">
                <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative animate-[scaleIn_0.2s_ease-out]">
                    <button onclick="closeProductModal()" class="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-slate-100 text-slate-600 z-10 shadow-sm transition-colors">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                    
                    <!-- Media Side (Image/3D) -->
                    <div id="modal-media-container" class="w-full md:w-1/2 bg-slate-100 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-100 min-h-[300px]">
                        <!-- Injected via JS -->
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
                            <button onclick="store.addToCart(store.state.content.pages.products.categories[window.currentCatIndex].products[window.currentProdIndex]); closeProductModal()" 
                                class="flex-1 bg-brand-accent text-white text-center font-bold py-3.5 rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                <i data-lucide="plus-circle" class="w-5 h-5"></i> Add to Quote
                            </button>
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
