
import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

interface InventoryProps {
    activePage?: string;
    onNavigate?: (page: string) => void;
}

export default function Inventory({ activePage = 'inventory', onNavigate }: InventoryProps) {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(2); // Default to selected item from design

    // Mock Data
    const products = [
        {
            id: 1,
            name: 'Kerastase Bain Satin 2',
            sku: 'KERA-001',
            category: 'Hair Care',
            stock: 42,
            price: 38.00,
            buyPrice: 22.50,
            status: 'Safe',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-KNbaYP6FgMH8HfOUpM_Dz2vDPnpxLaYPFbeU39jyu4MpY0RDXN4XUNs3zoa6KmNLboht0Z5sy6B4NGGvWvYNmsiUu_In9qU3yLClACs-LjvSQNOWmQdYzrV87aBtbZmaNP2Tmln95YiGhTAYegBuLlZFXauPDfIYPe-gfVDeK60ZHFyf2mFCdx_LDHfmpLRkj5E0g5eESWMuaMxJvQxwLN4MfeEMOKS-SlsU8PgSFW9iTTPAq9LduiDN90v16eGMCaeY9REHjgQ',
            minStock: 10
        },
        {
            id: 2,
            name: "L'Oreal Inoa 5.3",
            sku: 'LOR-INO-53',
            category: 'Coloring',
            stock: 3,
            price: 18.50,
            buyPrice: 8.50,
            status: 'Low Stock',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASp01qBUzHKbYwVfCQEW-sAYPF3gTgp1bPbIQ3pY6ikw6B0WaaCX_6H1N8ZjaxmFJ9oPQhV33L-kby__mZOMtzHFV067BPKmxco5O6rMw6fOpkht5FwS-pfxI24Pf7KVx-I1kqyAqQlJRgd8DmUdFc9MVp4EOZQWTm389ICw7qW1CNRFU1Yi3MVCrtjjbmN9fGvQmGlFRYL5dB0qF7i2sIsCKeo06tvxCdwEEYGyzBHKpJWslMfEqtZbD77ZRKZQNgv1NOCxDo4CM',
            minStock: 5
        },
        {
            id: 3,
            name: 'Moroccanoil Treatment',
            sku: 'MO-OIL-100',
            category: 'Styling',
            stock: 18,
            price: 44.00,
            buyPrice: 28.00,
            status: 'Safe',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-J_MV1ieOFy0eYpGeut7wZFDWyDcH3YoLrLqY2gidv8g_6QmhLSqvg3UIHSrm-Xz-hStZe9qRcslBlRBevkbHYy7rvHhv2tFjx1CVnx13jNvkq-o0aVWuyEwg59DWx_9yB6rNuDUq2gKT76HvloO48tqusGF6aclVW_-W9PBoXERtdV-SkXMUIzdf_F1nn63f0PvppxwO9W1irj_M8u_pyrvisvjEAuhjw7qcArnjIQE9G51zXmrZW18fIn2KKmklsXcwm3S-qb8',
            minStock: 5
        },
        {
            id: 4,
            name: 'Redken Forceful 23',
            sku: 'RK-HSP-23',
            category: 'Styling',
            stock: 2,
            price: 22.00,
            buyPrice: 12.00,
            status: 'Low Stock',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu44p5CNOqZQ1txWDtvihnHZKpiXshZTSFWEGQpZKBRlR8vW5IxqUC7EmTiLkVYGeT-xwHGuEHWC9Nj1FyE2i044o7Ck1T4C-FYprTt9TjQdhSRA0y5WZldkmFvDzJJTDO-lTxWkvNsKgUbNrLAz-5vju84VNUcZdfvCtPlk_rjPzV-JdcoS_yG4qRkaRFG4LElcJk1m8zDokbkyWTw-bfqJJ7AEyp3hrkd32H5c3nxAOiqhmd9uxNB8ZdNgnUIZnQIiiPTb5Q5Js',
            minStock: 8
        },
        {
            id: 5,
            name: 'Olaplex No.4',
            sku: 'OLA-004',
            category: 'Hair Care',
            stock: 12,
            price: 28.00,
            buyPrice: 16.50,
            status: 'Warning',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgF3cbPLLV-H5qIlHGApchcSBmXd_3vrRL3j1MadN61c4jshCBPR6TKrHCP1UdJkPA9ARUrQmSNTUNo7hPsLC32WgFpKKR36rGURSAo5pC4RGuwX_44l2tRqpO_AJy9mvvUidqAmin_Fja3g7wmwzrFhLIZgTnUSPfIbMPQ8ruDFdUc6ERJEJboN6iUgx8nEPvufbar27TKW55hzlLVApcUAJ9UiOifw0a4hExKqIk30VLf-Nf1qthce-IqsSSqlodBVQnytr_ISU',
            minStock: 15
        },
    ];

    const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Safe': return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20';
            case 'Warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20';
            case 'Low Stock': return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
        }
    };

    return (
        <div className="flex bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display min-h-screen overflow-hidden">
            <MainLayout activePage={activePage} onNavigate={onNavigate}>
                <div className="flex flex-1 overflow-hidden relative z-10">
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white/5 dark:bg-background-dark">
                        {/* Header */}
                        <header className="px-8 py-6 flex-shrink-0 z-10 bg-white/70 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold dark:text-white">Inventory Management</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage stock levels, pricing, and orders.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-white dark:hover:bg-white/5 transition-colors dark:text-white">
                                        <span className="material-icons text-lg">file_download</span>
                                        Export Report
                                    </button>
                                    <Button variant="primary" icon="add">New Product</Button>
                                </div>
                            </div>
                            {/* Tabs */}
                            <div className="flex items-center gap-8 text-sm font-medium">
                                <button className="pb-3 border-b-2 border-primary text-primary">
                                    Retail Products
                                </button>
                                <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
                                    Internal Use
                                </button>
                                <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-2">
                                    Low Stock Alerts
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500 border border-red-500/20">3</span>
                                </button>
                            </div>
                        </header>

                        {/* Content Body */}
                        <div className="flex-1 flex flex-col overflow-hidden p-8 pt-6">
                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="relative flex-1">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                    <input className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-[#1e1b2e] border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-500 dark:text-white" placeholder="Search by name, SKU or brand..." type="text" />
                                </div>
                                <div className="w-full sm:w-48">
                                    <select className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#1e1b2e] border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer dark:text-white">
                                        <option>All Categories</option>
                                        <option>Hair Care</option>
                                        <option>Coloring</option>
                                        <option>Styling Tools</option>
                                        <option>Skincare</option>
                                    </select>
                                </div>
                                <div className="w-full sm:w-40">
                                    <select className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#1e1b2e] border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer dark:text-white">
                                        <option>Status: All</option>
                                        <option>In Stock</option>
                                        <option>Low Stock</option>
                                        <option>Out of Stock</option>
                                    </select>
                                </div>
                            </div>

                            {/* Product Table */}
                            <div className="bg-white dark:bg-[#1e1b2e] rounded-xl border border-gray-200 dark:border-white/5 flex-1 overflow-hidden flex flex-col shadow-sm">
                                <div className="overflow-auto custom-scrollbar flex-1">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="sticky top-0 bg-slate-50 dark:bg-[#252038] z-10 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                                            <tr>
                                                <th className="px-6 py-4 rounded-tl-xl">Product Details</th>
                                                <th className="px-6 py-4">Category</th>
                                                <th className="px-6 py-4 text-right">Stock</th>
                                                <th className="px-6 py-4 text-right">Price (Sell)</th>
                                                <th className="px-6 py-4 rounded-tr-xl text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm">
                                            {products.map(product => (
                                                <tr
                                                    key={product.id}
                                                    onClick={() => setSelectedProductId(product.id)}
                                                    className={`cursor-pointer transition-colors ${selectedProductId === product.id ? 'bg-primary/5 dark:bg-primary/10 border-l-2 border-primary' : 'hover:bg-slate-50 dark:hover:bg-white/5 border-l-2 border-transparent'}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/5 flex-shrink-0 overflow-hidden">
                                                                <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-800 dark:text-white">{product.name}</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">SKU: {product.sku}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{product.category}</td>
                                                    <td className="px-6 py-4 text-right font-medium text-slate-800 dark:text-white">{product.stock}</td>
                                                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-300">${product.price.toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                                                            {product.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination */}
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-[#1e1b2e]">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Showing 1-5 of 124 products</p>
                                    <div className="flex items-center gap-2">
                                        <button className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 disabled:opacity-50">
                                            <span className="material-icons text-sm">chevron_left</span>
                                        </button>
                                        <button className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400">
                                            <span className="material-icons text-sm">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detail Panel (Sidebar) */}
                    {selectedProduct && (
                        <aside className="w-[400px] border-l border-gray-200 dark:border-white/10 bg-white dark:bg-[#1e1b2e]/50 backdrop-blur-md flex flex-col transition-all shadow-2xl relative z-20">
                            {/* Product Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-white/10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-white/5 overflow-hidden">
                                        <img alt={selectedProduct.name} className="w-full h-full object-cover" src={selectedProduct.image} />
                                    </div>
                                    <button onClick={() => setSelectedProductId(null)} className="text-slate-400 hover:text-white transition-colors">
                                        <span className="material-icons">close</span>
                                    </button>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{selectedProduct.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{selectedProduct.category} • 60ml</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-3xl font-bold text-slate-800 dark:text-white">{selectedProduct.stock}</span>
                                        {selectedProduct.stock <= selectedProduct.minStock && (
                                            <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Low Stock</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                                {/* Key Metrics */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Buy Price</p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-white">${selectedProduct.buyPrice.toFixed(2)}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sell Price</p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-white">${selectedProduct.price.toFixed(2)}</p>
                                    </div>
                                    <div className="col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Min. Stock Level</p>
                                            <p className="text-lg font-bold text-slate-800 dark:text-white">{selectedProduct.minStock} Units</p>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                            <span className="material-icons text-red-500 text-sm">priority_high</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stock Movement History */}
                                <div>
                                    <h4 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4">Recent Activity</h4>
                                    <div className="relative pl-4 border-l border-gray-200 dark:border-white/10 space-y-6">
                                        {/* Item 1 */}
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-[#1e1b2e]"></div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">Used for Service</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Stylist: Sarah M.</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-red-400">-1</p>
                                                    <p className="text-[10px] text-slate-500">2h ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Item 2 */}
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500 border-2 border-[#1e1b2e]"></div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">Restocked</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Order #8992</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-green-400">+10</p>
                                                    <p className="text-[10px] text-slate-500">Yesterday</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Item 3 */}
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-purple-500 border-2 border-[#1e1b2e]"></div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">Product Sold</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Walk-in Client</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-red-400">-1</p>
                                                    <p className="text-[10px] text-slate-500">3 days ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="p-6 border-t border-gray-200 dark:border-white/10 flex gap-3 bg-slate-50 dark:bg-[#1a1528]">
                                <button className="flex-1 py-3 px-4 rounded-xl border border-gray-300 dark:border-white/10 text-slate-700 dark:text-white text-sm font-bold hover:bg-slate-200 dark:hover:bg-white/5 transition-colors">
                                    Edit Details
                                </button>
                                <button className="flex-1 py-3 px-4 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                    Restock
                                    <span className="material-icons text-sm">add_shopping_cart</span>
                                </button>
                            </div>
                        </aside>
                    )}
                </div>
            </MainLayout>
        </div>
    );
}
