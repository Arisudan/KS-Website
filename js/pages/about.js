import { store } from '../store.js';

export function renderAbout() {
    const { content, editMode } = store.state;
    const { mission, vision, timeline } = content.pages.about;
    const editClass = editMode ? 'editable-active' : '';

    return `
        <!-- Header -->
        <header class="bg-brand-light py-20 text-center">
            <div class="container mx-auto px-6">
                <h1 class="text-4xl font-bold text-brand-dark mb-4">About KS Drives and Controls</h1>
                <p class="text-slate-600 max-w-2xl mx-auto">Engineered for excellence, built for reliability.</p>
            </div>
        </header>

        <!-- Mission & Vision -->
        <section class="py-20 bg-white">
            <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-4 opacity-5">
                        <i data-lucide="target" class="w-32 h-32"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-brand-accent mb-4 ${editClass}" data-editable="pages.about.mission.title">${mission.title}</h2>
                    <p class="text-slate-700 leading-relaxed text-lg ${editClass}" data-editable="pages.about.mission.text">${mission.text}</p>
                </div>

                <div class="p-8 rounded-2xl bg-brand-blue text-white shadow-xl relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-4 opacity-10">
                        <i data-lucide="eye" class="w-32 h-32 text-white"></i>
                    </div>
                    <h2 class="text-2xl font-bold mb-4 ${editClass}" data-editable="pages.about.vision.title">${vision.title}</h2>
                    <p class="text-slate-300 leading-relaxed text-lg ${editClass}" data-editable="pages.about.vision.text">${vision.text}</p>
                </div>
            </div>
        </section>

        <!-- Timeline -->
        <section class="py-20 bg-slate-50">
            <div class="container mx-auto px-6 max-w-4xl">
                <h2 class="text-3xl font-bold text-brand-dark mb-12 text-center">Our Journey</h2>
                
                ${editMode ? `<div class="mb-8 text-center"><button class="bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-dark" onclick="store.addItem('pages.about.timeline', {year: 'Year', title: 'Milestone', desc: 'Description.'})">+ Add Milestone</button></div>` : ''}

                <div class="relative border-l-2 border-slate-200 ml-4 md:ml-0 space-y-12">
                    ${timeline.map((item, index) => `
                        <div class="relative pl-8 md:pl-0 group">
                            <!-- Dot -->
                            <div class="absolute top-0 left-[-9px] w-6 h-6 bg-brand-accent rounded-full border-4 border-white shadow-sm md:left-1/2 md:-ml-3 z-10"></div>
                            
                            <!-- Controls -->
                            ${editMode ? `
                                <div class="absolute top-[-2rem] left-0 md:left-1/2 md:-ml-[50px] flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded shadow-sm border border-slate-100">
                                    ${index > 0 ? `
                                    <button class="bg-slate-100 text-slate-600 p-1 rounded hover:bg-slate-200" onclick="store.moveItem('pages.about.timeline', ${index}, 'up')"><i data-lucide="chevron-up" class="w-4 h-4"></i></button>` : ''}
                                    ${index < timeline.length - 1 ? `
                                    <button class="bg-slate-100 text-slate-600 p-1 rounded hover:bg-slate-200" onclick="store.moveItem('pages.about.timeline', ${index}, 'down')"><i data-lucide="chevron-down" class="w-4 h-4"></i></button>` : ''}
                                    <button class="bg-red-50 text-red-500 p-1 rounded hover:bg-red-100" onclick="store.removeItem('pages.about.timeline', ${index})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                </div>
                            ` : ''}

                            <div class="md:grid md:grid-cols-2 md:gap-12 items-start ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}">
                                <div class="${index % 2 === 0 ? 'md:text-right' : 'md:col-start-2'} mb-2 md:mb-0">
                                     <span class="inline-block py-1 px-3 bg-brand-blue/10 text-brand-blue rounded-full text-sm font-bold mb-2 ${editClass}" data-editable="pages.about.timeline.${index}.year">${item.year}</span>
                                </div>
                                <div class="${index % 2 === 0 ? 'md:col-start-2' : 'md:text-right md:col-start-1'}">
                                     <h3 class="text-xl font-bold text-brand-dark ${editClass}" data-editable="pages.about.timeline.${index}.title">${item.title}</h3>
                                     <p class="text-slate-600 ${editClass}" data-editable="pages.about.timeline.${index}.desc">${item.desc}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}
