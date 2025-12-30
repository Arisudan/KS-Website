// import { store } from '../store.js'; // REMOVED to prevent module duplication issues

export function renderCart(cart) {
    // const { cart } = store.state; // Passed as arg now
    // Always show cart, even if empty, for better UX

    // Check if modal is currently open in the DOM to preserve state during re-render
    const existingModal = document.getElementById('cart-modal');
    const isOpen = existingModal && existingModal.classList.contains('flex');
    const displayClass = isOpen ? 'flex' : 'hidden';

    // Badge Logic
    const badge = cart.length > 0 ? `
        <span class="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white animate-bounce-subtle">
            ${cart.length}
        </span>
    ` : '';


    // If open, remove the animation class to prevent "re-flying in" glitch on list updates
    const animationClass = isOpen ? '' : 'animate-[slideInRight_0.3s_ease-out]';

    // Using a fixed button that opens a modal
    return `
        <!-- Floating Cart Trigger -->
        <button onclick="document.getElementById('cart-modal').classList.remove('hidden'); document.getElementById('cart-modal').classList.add('flex')" 
            class="fixed bottom-24 right-6 z-[200] ${cart.length > 0 ? 'bg-brand-dark text-white' : 'bg-white text-slate-400 border-slate-200'} p-4 rounded-full shadow-2xl hover:scale-105 transition-transform border-2 ${cart.length > 0 ? 'border-brand-accent' : ''} group">
            <div class="relative">
                <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                ${badge}
            </div>
        </button>

        <!-- Cart Modal -->
        <div id="cart-modal" class="${displayClass} fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm justify-end">
            <!-- Close on backdrop click -->
            <div class="absolute inset-0" onclick="document.getElementById('cart-modal').classList.add('hidden'); document.getElementById('cart-modal').classList.remove('flex')"></div>

            <!-- Drawer -->
            <div class="bg-white w-full max-w-md h-full relative z-10 flex flex-col shadow-2xl ${animationClass}">
                
                <!-- Header -->
                <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 class="text-2xl font-bold text-brand-dark flex items-center gap-2">
                        <i data-lucide="file-text" class="text-brand-accent"></i> Request Quote
                    </h2>
                    <button onclick="document.getElementById('cart-modal').classList.add('hidden'); document.getElementById('cart-modal').classList.remove('flex')" 
                        class="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <i data-lucide="x" class="w-6 h-6 text-slate-500"></i>
                    </button>
                </div>

                <!-- Items List -->
                <div class="flex-1 overflow-y-auto p-6 space-y-4">
                    ${cart.length === 0 ? `
                        <div class="text-center text-slate-400 py-12">
                            <i data-lucide="package-open" class="w-16 h-16 mx-auto mb-4 opacity-50"></i>
                            <p>Your quote list is empty.</p>
                            <button onclick="document.getElementById('cart-modal').classList.add('hidden'); document.getElementById('cart-modal').classList.remove('flex')" class="text-brand-accent font-bold mt-4">Browse Products</button>
                        </div>
                    ` : cart.map(item => `
                        <div class="flex gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-brand-accent/50 transition-colors relative group">
                            <div class="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center p-1">
                                <img src="${item.image}" alt="${item.name}" class="max-w-full max-h-full object-contain">
                            </div>
                            <div class="flex-1">
                                <h4 class="font-bold text-slate-800">${item.name}</h4>
                                <p class="text-xs text-slate-500 line-clamp-1">${item.specs}</p>
                            </div>
                            <button onclick="store.removeFromCart('${item.cartId}')" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all active:scale-95" title="Remove Item">
                                <i data-lucide="trash-2" class="w-5 h-5"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>

                <!-- Footer / Action -->
                <div class="p-6 border-t border-slate-100 bg-slate-50">
                    <div class="mb-4 flex justify-between items-center text-sm font-medium text-slate-600">
                        <span>Items Selected:</span>
                        <span class="text-brand-dark font-bold">${cart.length}</span>
                    </div>
                    
                    <button onclick="submitQuote()" class="w-full bg-brand-accent text-white py-4 rounded-xl font-bold shadow-lg shadow-sky-500/30 hover:bg-sky-600 active:scale-95 transition-all flex justify-center items-center gap-2">
                        Submit Enquiry <i data-lucide="send" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Global function to handle submission (since it's an onclick)
window.submitQuote = () => {
    const { cart } = store.state;
    if (cart.length === 0) return alert("Please add items first.");

    const itemsList = cart.map(i => `- ${i.name} (${i.specs || 'Std'})`).join('\n');
    const message = `Halo, I would like to request a quote for the following items:\n\n${itemsList}\n\nPlease contact me with pricing and availability.`;
    const encoded = encodeURIComponent(message);

    // Open WhatsApp
    const phone = store.state.content.companyInfo.phone ? store.state.content.companyInfo.phone.replace(/\D/g, '') : '919876543210';
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');

    // Optional: Clear cart after sending?
    if (confirm("Did you send the message? Clear the list now?")) {
        store.clearCart();
        document.getElementById('cart-modal').classList.add('hidden');
        document.getElementById('cart-modal').classList.remove('flex');
    }
};
