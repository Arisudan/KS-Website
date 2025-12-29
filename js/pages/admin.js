import { store } from '../store.js';

export async function renderAdmin() {
    // Security check: redirect if not in edit mode (logged in)
    if (!store.state.editMode) {
        window.location.hash = 'home';
        return '<div class="pt-24 text-center">Redirecting...</div>';
    }

    // Fetch messages from backend
    let messages = [];
    try {
        const res = await fetch('/api/messages');
        if (res.ok) {
            messages = await res.json();
        }
    } catch (e) {
        console.error("Failed to load messages:", e);
    }

    // Sort messages: Newest first
    messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Expose delete handler globally for the onclick events
    window.deleteMessage = async (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            if (res.ok) {
                // Refresh the page to show latest data
                const currentRoute = window.location.hash.slice(1);
                if (currentRoute === 'admin') {
                    // Simple re-render trigger
                    import('../router.js').then(module => module.renderApp('admin'));
                }
            } else {
                alert('Failed to delete message.');
            }
        } catch (e) {
            console.error(e);
            alert('Error deleting message.');
        }
    };

    return `
        <div class="pt-24 bg-slate-50 min-h-screen">
            <div class="container mx-auto px-6 py-8">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-brand-dark">Admin Dashboard</h1>
                        <p class="text-slate-600">Manage your website content and inquiries.</p>
                    </div>
                    <div class="flex gap-3">
                         <a href="#home" class="px-4 py-2 bg-white text-slate-600 rounded-lg shadow hover:bg-slate-50 transition-colors font-medium">
                            <i data-lucide="home" class="w-4 h-4 inline mr-2"></i> View Site
                        </a>
                        <button onclick="store.logout(); window.location.hash='home';" class="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium">
                            <i data-lucide="log-out" class="w-4 h-4 inline mr-2"></i> Logout
                        </button>
                    </div>
                </div>
                
                <!-- Stats / Overview (Placeholder for future expansion) -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <i data-lucide="mail" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <p class="text-sm text-slate-500 font-medium">Total Messages</p>
                                <h3 class="text-2xl font-bold text-slate-800">${messages.length}</h3>
                            </div>
                        </div>
                    </div>
                     <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-green-100 text-green-600 rounded-lg">
                                <i data-lucide="check-circle" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <p class="text-sm text-slate-500 font-medium">System Status</p>
                                <h3 class="text-xl font-bold text-slate-800">Online</h3>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-orange-100 text-orange-600 rounded-lg">
                                <i data-lucide="users" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <p class="text-sm text-slate-500 font-medium">Daily Visitors</p>
                                <h3 class="text-2xl font-bold text-slate-800">124</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SEO Settings Section -->
                <div class="bg-white rounded-xl shadow-lg border border-slate-100 mb-8 overflow-hidden">
                    <div class="p-6 border-b border-slate-100">
                         <h2 class="text-xl font-bold text-brand-dark flex items-center gap-2">
                            <i data-lucide="search" class="w-5 h-5 text-brand-accent"></i>
                            SEO Settings
                        </h2>
                        <p class="text-sm text-slate-500 mt-1">Manage how your website appears on Google.</p>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Home SEO -->
                        <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h3 class="font-bold text-slate-700 mb-3">Home Page</h3>
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Meta Title</label>
                                    <input type="text" value="${store.state.content.seo?.home?.title || 'KS Drives and Controls - Industrial Automation Experts'}" 
                                        class="w-full p-2 text-sm border border-slate-300 rounded focus:border-brand-accent outline-none"
                                        onchange="store.update('seo.home.title', this.value)">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Meta Description</label>
                                    <textarea rows="2" class="w-full p-2 text-sm border border-slate-300 rounded focus:border-brand-accent outline-none"
                                        onchange="store.update('seo.home.description', this.value)">${store.state.content.seo?.home?.description || 'Leading distributor of industrial automation products including PLCs, VFDs, and Motors in Tamil Nadu.'}</textarea>
                                </div>
                            </div>
                        </div>

                         <!-- Products SEO -->
                        <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h3 class="font-bold text-slate-700 mb-3">Products Page</h3>
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Meta Title</label>
                                    <input type="text" value="${store.state.content.seo?.products?.title || 'Our Products - VFDs, Motors, PLCs | KS Drives'}" 
                                        class="w-full p-2 text-sm border border-slate-300 rounded focus:border-brand-accent outline-none"
                                        onchange="store.update('seo.products.title', this.value)">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Meta Description</label>
                                    <textarea rows="2" class="w-full p-2 text-sm border border-slate-300 rounded focus:border-brand-accent outline-none"
                                        onchange="store.update('seo.products.description', this.value)">${store.state.content.seo?.products?.description || 'Explore our wide range of industrial automation products. Authorized dealers for major brands.'}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Messages Section -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
                    <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 class="text-xl font-bold text-brand-dark">Recent Inquiries</h2>
                        <span class="text-xs font-semibold bg-brand-light text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                            ${messages.length} Messages
                        </span>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th class="p-4 font-semibold text-slate-600 text-sm">Date</th>
                                    <th class="p-4 font-semibold text-slate-600 text-sm">Name</th>
                                    <th class="p-4 font-semibold text-slate-600 text-sm">Email</th>
                                    <th class="p-4 font-semibold text-slate-600 text-sm w-1/3">Message</th>
                                    <th class="p-4 font-semibold text-slate-600 text-sm text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${messages.length === 0 ?
            '<tr><td colspan="5" class="p-8 text-center text-slate-500 italic">No messages received yet.</td></tr>' :
            messages.map(msg => `
                                    <tr class="hover:bg-slate-50 transition-colors group">
                                        <td class="p-4 text-sm text-slate-500 whitespace-nowrap">
                                            ${new Date(msg.timestamp).toLocaleDateString()} <br>
                                            <span class="text-xs text-slate-400">${new Date(msg.timestamp).toLocaleTimeString()}</span>
                                        </td>
                                        <td class="p-4 font-medium text-slate-800">${msg.name || 'N/A'}</td>
                                        <td class="p-4 text-sm">
                                            <a href="mailto:${msg.email}" class="text-brand-accent hover:underline flex items-center gap-1">
                                                ${msg.email}
                                            </a>
                                        </td>
                                        <td class="p-4 text-sm text-slate-600">
                                            <div class="max-w-md break-words">${msg.message}</div>
                                        </td>
                                        <td class="p-4 text-center">
                                            <button onclick="deleteMessage(${msg.id})" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all" title="Delete Message">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}
