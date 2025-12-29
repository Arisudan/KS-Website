import { store } from '../store.js';

export function renderHome() {
    const { content, editMode } = store.state;
    const { hero, domains, highlights } = content.pages.home;
    const editClass = editMode ? 'editable-active' : '';

    return `
        <!-- Hero Slider Section -->
        <section class="hero-slider bg-brand-dark">
            <!-- Slide 1 (Active) -->
            <!-- Slide 1 (Active) - Video Background -->
            <div class="hero-slide active relative overflow-hidden min-h-screen flex items-center">
                <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover z-0">
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-robotic-arm-moving-in-a-futuristic-scene-34665-large.mp4" type="video/mp4">
                </video>
                <div class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-blue/90 via-brand-blue/70 to-black/60 z-10"></div>
                
                <div class="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center relative z-40 pt-32 pb-72">
                     <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-snug max-w-5xl tracking-wide uppercase drop-shadow-lg ${editClass}" 
                        data-editable="pages.home.hero.title">${hero.title}</h1>
                     <p class="text-2xl text-slate-200 mb-12 max-w-3xl font-light tracking-wide drop-shadow-md ${editClass}"
                        data-editable="pages.home.hero.subtitle">${hero.subtitle}</p>
                     <a href="#products" class="bg-brand-accent text-white px-10 py-4 rounded-full font-bold hover:bg-sky-400 transition-all shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:shadow-[0_0_30px_rgba(14,165,233,0.8)] text-lg uppercase tracking-wider border border-white/10 backdrop-blur-sm">
                        <span ${editClass} data-editable="pages.home.hero.ctaText">${hero.ctaText}</span>
                     </a>
                </div>
            </div>

            <!-- Slide 2 -->
            <div class="hero-slide" style="background-image: url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2000');"> <!-- Fallback or 2nd image -->
                <div class="absolute inset-0 bg-black/60"></div>
                <div class="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center relative z-20">
                     <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">Expert Control Panel Builders</h1>
                     <p class="text-xl text-slate-200 mb-10 max-w-2xl">Custom designed panels for maximum efficiency and reliability.</p>
                     <a href="#services" class="bg-white text-brand-dark px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-all shadow-lg">Our Services</a>
                </div>
            </div>

            <!-- Slide 3 -->
            <div class="hero-slide" style="background-image: url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000');">
                 <div class="absolute inset-0 bg-black/60"></div>
                 <div class="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center relative z-20">
                     <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">24/7 Automation Support</h1>
                     <p class="text-xl text-slate-200 mb-10 max-w-2xl">Minimize downtime with our rapid response engineering team.</p>
                     <a href="#contact" class="bg-brand-accent text-white px-8 py-3 rounded-full font-bold hover:bg-sky-400 transition-all shadow-lg">Contact Us</a>
                </div>
            </div>

            <!-- Slider Controls -->
            <div class="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
                <button class="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors active-slide-dot"></button>
                <button class="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors"></button>
                <button class="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors"></button>
            </div>
        </section>

        <!-- Animated Stats Counter -->
        <!-- Animated Stats Counter (Glassmorphism) -->
        <section class="relative z-30 -mt-24 mb-16 px-4">
            <div class="container mx-auto">
                <div class="bg-brand-blue/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:-translate-y-1 transition-transform duration-500">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 text-center text-white md:divide-x md:divide-white/10">
                        <div class="p-2">
                            <div class="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-brand-accent to-cyan-200 mb-1 counter" data-target="15">15+</div>
                            <p class="text-xs md:text-sm text-slate-400 uppercase tracking-[0.2em] font-bold">Years Experience</p>
                        </div>
                        <div class="p-2">
                            <div class="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-brand-accent to-cyan-200 mb-1 counter" data-target="500">500+</div>
                             <p class="text-xs md:text-sm text-slate-400 uppercase tracking-[0.2em] font-bold">Projects Done</p>
                        </div>
                        <div class="p-2">
                            <div class="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-brand-accent to-cyan-200 mb-1 counter" data-target="50">50+</div>
                             <p class="text-xs md:text-sm text-slate-400 uppercase tracking-[0.2em] font-bold">Happy Clients</p>
                        </div>
                        <div class="p-2">
                            <div class="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-brand-accent to-cyan-200 mb-1 counter" data-target="24">24/7</div>
                             <p class="text-xs md:text-sm text-slate-400 uppercase tracking-[0.2em] font-bold">Hour Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Domains Overview -->
        <section class="py-24 bg-white">
            <div class="container mx-auto px-6">
                <div class="text-center mb-16">
                     <span class="text-brand-accent font-semibold tracking-wider uppercase text-sm">What We Do</span>
                     <h2 class="text-3xl md:text-4xl font-bold text-brand-dark mt-2 ${editClass}" data-editable="pages.home.domains.title">${domains.title}</h2>
                </div>

                ${editMode ? `<div class="mb-8 text-center"><button class="bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-dark" onclick="store.addItem('pages.home.domains.items', {title: 'New Domain', desc: 'Description.', icon: 'Star'})">+ Add Item</button></div>` : ''}

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    ${domains.items.map((item, index) => `
                    <div class="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full tilt-card cursor-default">
                        <!-- Pseudo Image (Gradient Fallback) since we don't have images for domains yet, or stick to icons -->
                        <!-- Actually, let's use a nice tech gradient top bar -->
                        <div class="h-32 bg-gradient-to-br from-brand-blue to-slate-800 relative overflow-hidden">
                            <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent opacity-10"></div>
                        </div>
                        
                        <div class="p-6 relative pt-12">
                            <!-- Floating Icon -->
                            <div class="absolute -top-8 right-6 bg-brand-accent text-white w-16 h-16 rounded-2xl shadow-lg shadow-sky-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                 data-icon-editable="pages.home.domains.items.${index}.icon" data-lucide-name="${item.icon}">
                                <i data-lucide="${item.icon}" class="w-8 h-8"></i>
                            </div>

                            ${editMode ? `
                                <div class="absolute top-2 left-2 flex gap-1 z-20">
                                    <button class="bg-white text-red-500 p-1 rounded-full shadow hover:bg-red-50" onclick="store.removeItem('pages.home.domains.items', ${index})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                </div>
                            ` : ''}

                            <h3 class="text-xl font-bold text-brand-dark mb-3 leading-tight ${editClass}" 
                                data-editable="pages.home.domains.items.${index}.title">${item.title}</h3>
                            
                            <p class="text-slate-600 leading-relaxed mb-4 text-sm ${editClass}" 
                               data-editable="pages.home.domains.items.${index}.desc">${item.desc}</p>
                            
                            <a href="#domains" class="inline-flex items-center text-brand-accent font-bold text-sm hover:gap-2 transition-all uppercase tracking-wide group-hover:text-sky-600">
                                Explore <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>
                            </a>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </section>

                </div>
            </div>
        </section>

        <!-- Product Highlights (Re-added) -->
        <section class="py-24 bg-brand-light">
             <div class="container mx-auto px-6">
                <div class="flex justify-between items-end mb-12">
                     <div>
                        <h2 class="text-3xl font-bold text-brand-dark ${editClass}" data-editable="pages.home.highlights.title">${highlights.title}</h2>
                     </div>
                     ${editMode ? `<button class="bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-dark" onclick="store.addItem('pages.home.highlights.items', {name: 'New Item', desc: 'Description', image: 'https://placehold.co/400x300'})">+ Add Item</button>` :
            `<a href="#products" class="text-brand-accent hover:text-brand-blue font-semibold flex items-center group">View All <i data-lucide="arrow-right" class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"></i></a>`}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    ${highlights.items.map((item, index) => `
                        <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all flex flex-col md:flex-row group h-full relative">
                            ${editMode ? `
                                <div class="absolute top-2 right-2 flex gap-1 z-30">
                                    <button class="bg-white text-red-500 p-1 rounded-full shadow hover:bg-red-600" onclick="store.removeItem('pages.home.highlights.items', ${index})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                </div>
                            ` : ''}

                            <div class="w-full md:w-1/2 h-64 md:h-auto overflow-hidden relative editable-img-wrapper">
                                <img src="${item.image}" data-img-editable="pages.home.highlights.items.${index}.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${item.name}">
                                ${editMode ? '<div class="editable-img-overlay text-white"><i data-lucide="camera" class="mr-2"></i> Change</div>' : ''}
                            </div>
                            <div class="p-8 md:w-1/2 flex flex-col justify-center">
                                <h3 class="text-2xl font-bold text-brand-dark mb-2 ${editClass}" data-editable="pages.home.highlights.items.${index}.name">${item.name}</h3>
                                <p class="text-slate-600 mb-6 ${editClass}" data-editable="pages.home.highlights.items.${index}.desc">${item.desc}</p>
                                <a href="#products" class="text-brand-accent font-semibold self-start hover:underline">Learn More</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
             </div>
        </section>

        <!-- CTA -->
        <section class="py-24 bg-brand-blue relative overflow-hidden">
             <!-- Abstract Shapes -->
             <div class="absolute top-0 right-0 w-96 h-96 bg-brand-accent rounded-full opacity-10 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
             <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full opacity-5 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
             
             <div class="container mx-auto px-6 text-center relative z-10">
                 <h2 class="text-3xl md:text-5xl font-bold text-white mb-8">Ready to upgrade your systems?</h2>
                 <p class="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Contact our engineering team for a free consultation on your custom drive and control needs.</p>
                 <a href="#contact" class="bg-white text-brand-blue px-10 py-4 rounded-full font-bold hover:bg-slate-100 transition-transform hover:scale-105 shadow-xl">Get a Quote</a>
             </div>
        </section>
    `;
}

export function setupHomeInteractions() {
    // 1. Hero Slider Logic
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        const interval = setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // 5 seconds
        // Cleanup interval on route change is tough without a framework, 
        // but since we re-render, the old elements are removed. 
        // The interval *will* keep running though if we don't clear it.
        // Quick fix: attach to window and clear previous.
        if (window.homeSliderInterval) clearInterval(window.homeSliderInterval);
        window.homeSliderInterval = interval;
    }

    // 2. Stats Counter Logic
    const counters = document.querySelectorAll('.counter');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const scrollY = window.scrollY + window.innerHeight;

            // Only animate if visible? 
            // Better: use IntersectionObserver to start animation
            // Simply use CSS @property for now or simple JS loop

            // Simple JS increment
            const increment = target / 100;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 20);
            } else {
                counter.innerText = target + (target > 200 ? '+' : ''); // Add + for big numbers
            }
        });
    };

    // Trigger counters when Stats section is counted
    const statsSection = document.querySelector('.counter')?.closest('section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        });
        observer.observe(statsSection);
    }
}
