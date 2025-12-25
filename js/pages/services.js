import { store } from '../store.js';

export function renderServices() {
    const { content, editMode } = store.state;
    const { list } = content.pages.services;
    const editClass = editMode ? 'editable-active' : '';

    return `
        <header class="bg-slate-900 py-24 text-center">
            <h1 class="text-4xl font-bold text-white mb-6">Our Services</h1>
            <p class="text-slate-400 max-w-xl mx-auto">Beyond products, we offer comprehensive engineering support.</p>
        </header>

        <section class="py-20 bg-slate-50">
            <div class="container mx-auto px-6">
                <!-- Add Button -->
                ${editMode ? `<div class="mb-8 text-center"><button class="bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-dark" onclick="store.addItem('pages.services.list', {title: 'New Service', desc: 'Description of service.', icon: 'Settings'})">+ Add Service</button></div>` : ''}

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    ${list.map((item, index) => `
                        <div class="bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border border-slate-100 flex flex-col items-center text-center relative group">
                            
                            ${editMode ? `
                                <div class="absolute top-2 right-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${index > 0 ? `
                                    <button class="bg-slate-100 text-slate-600 p-1 rounded-full hover:bg-slate-200" onclick="store.moveItem('pages.services.list', ${index}, 'up')"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>` : ''}
                                    ${index < list.length - 1 ? `
                                    <button class="bg-slate-100 text-slate-600 p-1 rounded-full hover:bg-slate-200" onclick="store.moveItem('pages.services.list', ${index}, 'down')"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>` : ''}
                                    <button class="bg-red-50 text-red-500 p-1 rounded-full hover:bg-red-100" onclick="store.removeItem('pages.services.list', ${index})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                </div>
                            ` : ''}

                            <div class="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-accent mb-6 ${editMode ? 'cursor-pointer hover:bg-brand-blue/20 ring-2 ring-transparent hover:ring-brand-accent' : ''}" 
                                 data-icon-editable="pages.services.list.${index}.icon" data-lucide-name="${item.icon}" title="${editMode ? 'Click to change icon' : ''}">
                                <i data-lucide="${item.icon}" class="w-8 h-8"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-brand-dark mb-4 ${editClass}" data-editable="pages.services.list.${index}.title">${item.title}</h3>
                            <p class="text-slate-600 ${editClass}" data-editable="pages.services.list.${index}.desc">${item.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="mt-20 text-center">
                <div class="bg-brand-accent rounded-3xl p-12 mx-auto max-w-4xl text-white shadow-2xl relative overflow-hidden">
                    <div class="relative z-10">
                        <h2 class="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
                        <p class="mb-8 opacity-90">Our engineering team is ready to tackle your toughest challenges.</p>
                        <a href="#contact" class="inline-block bg-white text-brand-accent px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors">Contact Us</a>
                    </div>
                </div>
            </div>
        </section>
    `;
}
