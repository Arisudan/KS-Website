import { store } from '../store.js';

export function renderDomains() {
    const { content, editMode } = store.state;
    // Assuming structure, fall back to empty if undefined (though data.js defines it)
    const sections = content.pages.domains?.sections || [];
    const editClass = editMode ? 'editable-active' : '';

    return `
        <header class="bg-brand-blue py-20 text-center">
            <div class="container mx-auto px-6">
                <h1 class="text-4xl font-bold text-white mb-4">Industries We Serve</h1>
                <p class="text-slate-300 max-w-2xl mx-auto">Providing specialized solutions for diverse technological fields.</p>
            </div>
        </header>

        <div class="py-20 bg-white">
            <div class="container mx-auto px-6 space-y-32">
                ${sections.map((section, index) => `
                    <div class="flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}">
                        <div class="w-full lg:w-1/2 h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl relative editable-img-wrapper">
                             <img src="${section.image}" data-img-editable="pages.domains.sections.${index}.image" class="w-full h-full object-cover" alt="${section.title}">
                             ${editMode ? '<div class="editable-img-overlay text-white"><i data-lucide="camera" class="mr-2"></i> Change Image</div>' : ''}
                        </div>
                        <div class="w-full lg:w-1/2">
                            <h2 class="text-3xl font-bold text-brand-dark mb-6 ${editClass}" data-editable="pages.domains.sections.${index}.title">${section.title}</h2>
                            <p class="text-lg text-slate-600 leading-relaxed ${editClass}" data-editable="pages.domains.sections.${index}.content">${section.content}</p>
                            
                            <ul class="mt-8 space-y-4">
                                <li class="flex items-center text-slate-700">
                                    <i data-lucide="check-circle" class="w-5 h-5 text-green-500 mr-3"></i>
                                    <span>High reliability implementation</span>
                                </li>
                                <li class="flex items-center text-slate-700">
                                    <i data-lucide="check-circle" class="w-5 h-5 text-green-500 mr-3"></i>
                                    <span>Customizable to specific needs</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
