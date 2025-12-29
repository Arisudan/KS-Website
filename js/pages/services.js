import { store } from '../store.js';

export function renderServices() {
    const { content, editMode } = store.state;
    // Fix: access content.pages.services.items assuming recent restructure, or use 'list' if legacy
    // Previous code used 'list'. Let's stick to 'list' based on view_file output.
    const list = content.pages.services.list || [];
    const editClass = editMode ? 'editable-active' : '';

    return `
        <header class="bg-slate-900 py-24 text-center relative overflow-hidden">
             <!-- Abstract Background -->
             <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#64748b 1px, transparent 1px); background-size: 40px 40px;"></div>
             
            <h1 class="text-4xl lg:text-5xl font-bold text-white mb-6 relative z-10">Our Services</h1>
            <p class="text-slate-400 max-w-xl mx-auto relative z-10 text-lg">Beyond products, we offer comprehensive engineering support.</p>
        </header>

        <section class="py-20 bg-slate-50">
            <div class="container mx-auto px-6">
                <!-- Add Button -->
                ${editMode ? `<div class="mb-12 text-center"><button class="bg-brand-accent text-white px-6 py-2 rounded-full font-bold shadow hover:bg-sky-600 transition-colors" onclick="store.addItem('pages.services.list', {title: 'New Service', desc: 'Description of service.', icon: 'Settings'})">+ Add Service</button></div>` : ''}

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${list.map((item, index) => `
                        <div class="relative group overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-white border border-slate-100 h-full">
                            
                            <!-- Glass/Gradient Background Hover Effect -->
                            <div class="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-100 group-hover:opacity-0 transition-opacity"></div>
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <!-- Massive Decorative Icon (Bottom Right) -->
                            <div class="absolute -bottom-8 -right-8 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 pointer-events-none">
                                <i data-lucide="${item.icon}" class="w-40 h-40 text-slate-800 opacity-[0.03] group-hover:opacity-[0.07] group-hover:text-brand-accent"></i>
                            </div>

                            <!-- Content -->
                            <div class="relative z-10 flex flex-col h-full">
                                <div class="w-16 h-16 bg-brand-light text-brand-accent rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300"
                                     data-icon-editable="pages.services.list.${index}.icon" data-lucide-name="${item.icon}">
                                    <i data-lucide="${item.icon}" class="w-8 h-8"></i>
                                </div>

                                <h3 class="text-2xl font-bold text-brand-dark mb-4 group-hover:text-brand-accent transition-colors ${editClass}" 
                                    data-editable="pages.services.list.${index}.title">
                                    ${item.title}
                                </h3>
                                
                                <p class="text-slate-600 leading-relaxed mb-8 flex-grow ${editClass}" 
                                   data-editable="pages.services.list.${index}.desc">
                                    ${item.desc}
                                </p>

                                <div class="mt-auto">
                                    <a href="#contact" class="inline-flex items-center text-sm font-bold text-brand-accent group-hover:text-brand-dark transition-colors">
                                        Enquire Now <i data-lucide="arrow-right" class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"></i>
                                    </a>
                                </div>

                                ${editMode ? `
                                    <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button class="bg-white text-slate-500 p-1.5 rounded-full shadow hover:bg-slate-100" 
                                            onclick="store.moveItem('pages.services.list', ${index}, 'up')"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
                                        <button class="bg-white text-slate-500 p-1.5 rounded-full shadow hover:bg-slate-100" 
                                            onclick="store.moveItem('pages.services.list', ${index}, 'down')"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
                                        <button class="bg-white text-red-500 p-1.5 rounded-full shadow hover:bg-red-50" 
                                            onclick="store.removeItem('pages.services.list', ${index})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="mt-24 text-center px-4">
                <div class="bg-gradient-to-r from-brand-dark to-slate-800 rounded-3xl p-12 mx-auto max-w-5xl text-white shadow-2xl relative overflow-hidden group">
                    <!-- Decor -->
                    <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-brand-accent/20 transition-colors duration-700"></div>
                    <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-brand-accent/20 transition-colors duration-700"></div>
                    
                    <div class="relative z-10">
                        <h2 class="text-3xl lg:text-4xl font-bold mb-6">Need a Custom Automation Solution?</h2>
                        <p class="mb-8 opacity-90 text-lg max-w-2xl mx-auto">Our engineering team specializes in retrofitting, panel building, and complex system integration.</p>
                        <a href="#contact" class="inline-block bg-brand-accent text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-brand-dark transition-all shadow-lg hover:shadow-brand-accent/50">
                            Speak to an Engineer
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `;
}
