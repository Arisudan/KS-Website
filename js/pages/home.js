import { store } from '../store.js';

export function renderHome() {
    const { content, editMode } = store.state;
    const { hero, domains, highlights } = content.pages.home;

    const editClass = editMode ? 'editable-active' : '';

    return `
        <!-- Hero Section -->
        <section class="relative bg-brand-dark overflow-hidden">
            <div class="absolute inset-0 z-0">
                <div class="relative w-full h-full editable-img-wrapper">
                    <img src="${hero.backgroundImage}" data-img-editable="pages.home.hero.backgroundImage" class="w-full h-full object-cover opacity-20" alt="Hero Background">
                    ${editMode ? '<div class="editable-img-overlay text-white"><i data-lucide="camera" class="mr-2"></i> Change Image</div>' : ''}
                </div>
            </div>
            
            <div class="relative z-10 container mx-auto px-6 py-32 flex flex-col items-center text-center">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl animate-fade-in ${editClass}" 
                    data-editable="pages.home.hero.title">
                    ${hero.title}
                </h1>
                <p class="text-xl text-slate-300 mb-10 max-w-2xl delay-100 animate-fade-in ${editClass}"
                   data-editable="pages.home.hero.subtitle">
                   ${hero.subtitle}
                </p>
                <a href="#products" class="bg-brand-accent text-white hover:bg-sky-400 px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-sky-500/30 delay-200 animate-fade-in inline-flex items-center gap-2">
                    <span ${editClass} data-editable="pages.home.hero.ctaText">${hero.ctaText}</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
            </div>
        </section>

        <!-- Domains Overview -->
        <section class="py-20 bg-white">
            <div class="container mx-auto px-6">
                <div class="text-center mb-16">
                     <span class="text-brand-accent font-semibold tracking-wider uppercase text-sm">What We Do</span>
                     <h2 class="text-3xl md:text-4xl font-bold text-brand-dark mt-2 ${editClass}" data-editable="pages.home.domains.title">${domains.title}</h2>
                </div>

                ${editMode ? `<div class="mb-8 text-center"><button class="bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-dark" onclick="store.addItem('pages.home.domains.items', {title: 'New Domain', desc: 'Description.', icon: 'Star'})">+ Add Item</button></div>` : ''}

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    ${domains.items.map((item, index) => `
                        <div class="p-6 rounded-2xl bg-brand-light hover:bg-white border border-transparent hover:border-slate-200 shadow-sm hover:shadow-xl transition-all group relative">
                            ${editMode ? `
                                <div class="absolute top-2 right-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${index > 0 ? `
                                    <button class="bg-white text-slate-600 p-1 rounded-full shadow hover:bg-slate-100" onclick="store.moveItem('pages.home.domains.items', ${index}, 'up')"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>` : ''}
                                    ${index < domains.items.length - 1 ? `
                                    <button class="bg-white text-slate-600 p-1 rounded-full shadow hover:bg-slate-100" onclick="store.moveItem('pages.home.domains.items', ${index}, 'down')"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>` : ''}
                                    <button class="bg-white text-red-500 p-1 rounded-full shadow hover:bg-red-50" onclick="store.removeItem('pages.home.domains.items', ${index})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                </div>
                            ` : ''}

                            <div class="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-brand-accent mb-4 group-hover:scale-110 transition-transform ${editMode ? 'cursor-pointer hover:bg-brand-blue/10 ring-2 ring-transparent hover:ring-brand-accent' : ''}"
                                 data-icon-editable="pages.home.domains.items.${index}.icon" data-lucide-name="${item.icon}" title="${editMode ? 'Click to change icon' : ''}">
                                <i data-lucide="${item.icon}"></i>
                            </div>
                            <h3 class="text-xl font-bold text-brand-dark mb-2 ${editClass}" data-editable="pages.home.domains.items.${index}.title">${item.title}</h3>
                            <p class="text-slate-600 ${editClass}" data-editable="pages.home.domains.items.${index}.desc">${item.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Product Highlights -->
        <section class="py-20 bg-brand-light">
             <div class="container mx-auto px-6">
                <div class="flex justify-between items-end mb-12">
                     <div>
                        <h2 class="text-3xl font-bold text-brand-dark ${editClass}" data-editable="pages.home.highlights.title">${highlights.title}</h2>
                     </div>
                     ${editMode ? `<button class="bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-dark" onclick="store.addItem('pages.home.highlights.items', {name: 'New Item', desc: 'Description', image: 'https://placehold.co/400x300'})">+ Add Item</button>` :
            `<a href="#products" class="text-brand-accent hover:text-brand-blue font-semibold flex items-center">View All <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i></a>`}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    ${highlights.items.map((item, index) => `
                        <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all flex flex-col md:flex-row group h-full relative">
                            ${editMode ? `
                                <div class="absolute top-2 right-2 flex gap-1 z-30">
                                    ${index > 0 ? `
                                    <button class="bg-white text-slate-600 p-1 rounded-full shadow hover:bg-slate-100" onclick="store.moveItem('pages.home.highlights.items', ${index}, 'up')"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>` : ''}
                                    ${index < highlights.items.length - 1 ? `
                                    <button class="bg-white text-slate-600 p-1 rounded-full shadow hover:bg-slate-100" onclick="store.moveItem('pages.home.highlights.items', ${index}, 'down')"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>` : ''}
                                    <button class="bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600" onclick="store.removeItem('pages.home.highlights.items', ${index})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                </div>
                            ` : ''}

                            <div class="w-full md:w-1/2 h-64 md:h-auto overflow-hidden relative editable-img-wrapper">
                                <img src="${item.image}" data-img-editable="pages.home.highlights.items.${index}.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${item.name}">
                                ${editMode ? '<div class="editable-img-overlay text-white"><i data-lucide="camera" class="mr-2"></i> Change</div>' : ''}
                            </div>
                            <div class="p-8 md:w-1/2 flex flex-col justify-center">
                                <h3 class="text-2xl font-bold text-brand-dark mb-2 ${editClass}" data-editable="pages.home.highlights.items.${index}.name">${item.name}</h3>
                                <p class="text-slate-600 mb-6 ${editClass}" data-editable="pages.home.highlights.items.${index}.desc">${item.desc}</p>
                                <button class="text-brand-accent font-semibold self-start hover:underline">Learn More</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
             </div>
        </section>

        <!-- CTA -->
        <section class="py-20 bg-brand-blue relative overflow-hidden">
             <!-- Abstract Shapes -->
             <div class="absolute top-0 right-0 w-64 h-64 bg-brand-accent rounded-full opacity-10 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
             
             <div class="container mx-auto px-6 text-center relative z-10">
                 <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Ready to upgrade your systems?</h2>
                 <p class="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Contact our engineering team for a free consultation on your custom drive and control needs.</p>
                 <a href="#contact" class="bg-white text-brand-blue px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors shadow-lg">Get a Quote</a>
             </div>
        </section>
    `;
}
