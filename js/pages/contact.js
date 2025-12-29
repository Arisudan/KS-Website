import { store } from '../store.js';

export function renderContact() {
    const { content, editMode } = store.state;
    // Fix: contact is inside pages
    const { companyInfo } = content;
    const { contact } = content.pages;
    const editClass = editMode ? 'editable-active' : '';

    // Default Map URL if missing (Embed URL)
    const mapUrl = companyInfo.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.628236556408!2d-122.08374688469227!3d37.42199997982461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425dad8f%3A0x27b4d0937a098869!2sGoogleplex!5e0!3m2!1sen!2sus!4v1615392000000!5m2!1sen!2sus";

    // Expose submit handler globally for the inline onsubmit
    window.submitContactForm = async (e) => {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector('button');
        const originalText = btn.innerText;

        const data = {
            name: form.querySelector('input[type="text"]').value,
            email: form.querySelector('input[type="email"]').value,
            interest: form.querySelector('select').value,
            message: form.querySelector('textarea').value
        };

        try {
            btn.disabled = true;
            btn.innerText = "Sending...";

            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert("Message sent successfully!");
                form.reset();
            } else {
                throw new Error("Backend unavailable");
            }
        } catch (err) {
            console.warn("Backend failed, using Mailto fallback:", err);
            // Fallback: Open Mail Client
            const subject = `Inquiry: ${data.interest} (${data.name})`;
            const body = `Name: ${data.name}\nEmail: ${data.email}\nInterest: ${data.interest}\n\nMessage:\n${data.message}`;
            // Use the company email from store if available, else fallback
            const toEmail = store.state.content.companyInfo.email || "contact@ksdrives.com";
            window.location.href = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            alert("Opening your email client to send the message...");
        } finally {
            btn.disabled = false;
            btn.innerText = originalText;
        }
    };

    return `
        <div class="pt-10 bg-slate-50 min-h-screen">
             <div class="container mx-auto px-6 py-12">
                <div class="text-center mb-16">
                    <h1 class="text-4xl font-bold text-brand-dark mb-4 ${editClass}" data-editable="pages.contact.title">${contact.title}</h1>
                    <p class="text-slate-600 ${editClass}" data-editable="pages.contact.subtitle">${contact.subtitle}</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <!-- Contact Form -->
                    <div class="bg-white p-8 rounded-2xl shadow-lg h-fit">
                        <h2 class="text-2xl font-bold mb-6 text-brand-dark">Send us a message</h2>
                        <form onsubmit="submitContactForm(event)" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input type="text" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all" placeholder="Your Name" required>
                            </div>
                            <div>
                                <input type="email" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all" placeholder="your@email.com" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">I am interested in</label>
                                <select class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all bg-white text-slate-700 cursor-pointer appearance-none">
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Motors & Drives">Motors & Drives</option>
                                    <option value="Control Panels">Control Panels</option>
                                    <option value="Inverters">Inverters</option>
                                    <option value="Service & Maintenance">Service & Maintenance</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                <textarea rows="4" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all" placeholder="How can we help?" required></textarea>
                            </div>
                            <button type="submit" class="w-full bg-brand-accent text-white font-bold py-4 rounded-lg hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/30">
                                Send Message
                            </button>
                        </form>
                    </div>

                    <!-- Info & Map -->
                    <div class="space-y-8">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
                                 <i data-lucide="user" class="text-brand-accent mb-4 w-8 h-8"></i>
                                 <h3 class="font-bold text-brand-dark mb-1">Director Proprietor</h3>
                                 <p class="text-slate-600 ${editClass}" data-editable="companyInfo.owner">${companyInfo.owner}</p>
                             </div>
                             
                             <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
                                 <i data-lucide="phone" class="text-brand-accent mb-4 w-8 h-8"></i>
                                 <h3 class="font-bold text-brand-dark mb-1">Call Us</h3>
                                 <p class="text-slate-600 ${editClass}" data-editable="companyInfo.phone">${companyInfo.phone}</p>
                             </div>

                             <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
                                 <i data-lucide="file-text" class="text-brand-accent mb-4 w-8 h-8"></i>
                                 <h3 class="font-bold text-brand-dark mb-1">GST Number</h3>
                                 <p class="text-slate-600 ${editClass}" data-editable="companyInfo.gst">${companyInfo.gst}</p>
                             </div>

                             <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
                                 <i data-lucide="mail" class="text-brand-accent mb-4 w-8 h-8"></i>
                                 <h3 class="font-bold text-brand-dark mb-1">Email</h3>
                                 <p class="text-slate-600 ${editClass}" data-editable="companyInfo.email">${companyInfo.email}</p>
                             </div>
                        </div>

                        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <i data-lucide="map-pin" class="text-brand-accent mb-4 w-8 h-8"></i>
                            <h3 class="font-bold text-brand-dark mb-1">Headquarters</h3>
                            <p class="text-slate-600 mb-6 ${editClass}" data-editable="companyInfo.address">${companyInfo.address}</p>
                            
                            <div class="rounded-lg overflow-hidden h-64 bg-slate-200 relative">
                                <iframe src="${mapUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                                ${editMode ? `<button class="absolute top-2 right-2 bg-white text-brand-blue text-xs p-2 rounded shadow font-bold" onclick="const url=prompt('Enter Maps Embed URL:', '${mapUrl}'); if(url) store.update('companyInfo.mapUrl', url);">Change Map</button>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    `;
}
