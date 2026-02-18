
import { useState } from 'react';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { useProducts } from '../hooks/useInventory';
import { formatRupiah } from '../lib/format';
import type { Product } from '../lib/types';

function getStockStatus(product: Product): { label: string; key: string } {
    if (product.stock_qty <= 0) return { label: 'Out of Stock', key: 'Out' };
    if (product.stock_qty <= product.min_stock_qty) return { label: 'Low Stock', key: 'Low Stock' };
    if (product.stock_qty <= product.min_stock_qty * 1.5) return { label: 'Warning', key: 'Warning' };
    return { label: 'Safe', key: 'Safe' };
}

function getStatusColor(key: string) {
    switch (key) {
        case 'Safe': return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20';
        case 'Warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20';
        case 'Low Stock': return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20';
        case 'Out': return 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
        default: return 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
    }
}

export default function Inventory() {
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const { data: products, isLoading, isError, refetch } = useProducts();

    const selectedProduct: Product | undefined =
        products?.find(p => p.id === selectedProductId) ?? (selectedProductId === null ? products?.[0] : undefined);

    const lowStockCount = products?.filter(p => p.stock_qty <= p.min_stock_qty).length ?? 0;

    return (
        <>
            <div className="flex flex-1 overflow-hidden relative z-10">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-white/5 dark:bg-background-dark">
                    {/* Header */}
                    <header className="px-4 md:px-8 py-6 flex-shrink-0 z-10 bg-white/70 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 pl-14 md:pl-4">
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
                                {lowStockCount > 0 && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500 border border-red-500/20">{lowStockCount}</span>
                                )}
                            </button>
                        </div>
                    </header>

                    {/* Content Body */}
                    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 lg:p-8 pt-6">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-[#1e1b2e] border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-500 dark:text-white" placeholder="Search by name, SKU or brand..." type="text" />
                            </div>
                            <div className="w-full sm:w-48">
                                <select className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#1e1b2e] border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer dark:text-white">
                                    <option>All Categories</option>
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

                        {/* Loading / Error */}
                        {isLoading && <LoadingSpinner message="Loading products..." />}
                        {isError && <ErrorAlert message="Failed to load products." onRetry={() => refetch()} />}

                        {/* Product Table */}
                        {products && (
                            <div className="bg-white dark:bg-[#1e1b2e] rounded-xl border border-gray-200 dark:border-white/5 flex-1 overflow-hidden flex flex-col shadow-sm">
                                <div className="overflow-auto custom-scrollbar flex-1">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
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
                                            {products.map(product => {
                                                const status = getStockStatus(product);
                                                return (
                                                    <tr
                                                        key={product.id}
                                                        onClick={() => setSelectedProductId(product.id)}
                                                        className={`cursor-pointer transition-colors ${selectedProduct?.id === product.id ? 'bg-primary/5 dark:bg-primary/10 border-l-2 border-primary' : 'hover:bg-slate-50 dark:hover:bg-white/5 border-l-2 border-transparent'}`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/5 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                                    {product.image_url ? (
                                                                        <img alt={product.name} className="w-full h-full object-cover" src={product.image_url} />
                                                                    ) : (
                                                                        <span className="material-icons-round text-slate-400 text-lg">inventory_2</span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-slate-800 dark:text-white">{product.name}</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400">SKU: {product.sku}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{product.product_categories?.name ?? '—'}</td>
                                                        <td className="px-6 py-4 text-right font-medium text-slate-800 dark:text-white">{product.stock_qty}</td>
                                                        <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-300">{formatRupiah(product.sell_price)}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status.key)}`}>
                                                                {status.label}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination */}
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-[#1e1b2e]">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Showing {products.length} products</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Panel (Sidebar) */}
                {selectedProduct && (
                    <aside className="w-[400px] border-l border-gray-200 dark:border-white/10 bg-white dark:bg-[#1e1b2e]/50 backdrop-blur-md flex flex-col transition-all shadow-2xl relative z-20">
                        {/* Product Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-white/5 overflow-hidden flex items-center justify-center">
                                    {selectedProduct.image_url ? (
                                        <img alt={selectedProduct.name} className="w-full h-full object-cover" src={selectedProduct.image_url} />
                                    ) : (
                                        <span className="material-icons-round text-slate-400 text-2xl">inventory_2</span>
                                    )}
                                </div>
                                <button onClick={() => setSelectedProductId(null)} className="text-slate-400 hover:text-white transition-colors">
                                    <span className="material-icons">close</span>
                                </button>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{selectedProduct.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{selectedProduct.product_categories?.name ?? '—'} • {selectedProduct.unit}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-3xl font-bold text-slate-800 dark:text-white">{selectedProduct.stock_qty}</span>
                                    {selectedProduct.stock_qty <= selectedProduct.min_stock_qty && (
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
                                    <p className="text-lg font-bold text-slate-800 dark:text-white">{formatRupiah(selectedProduct.buy_price)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sell Price</p>
                                    <p className="text-lg font-bold text-slate-800 dark:text-white">{formatRupiah(selectedProduct.sell_price)}</p>
                                </div>
                                <div className="col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Min. Stock Level</p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-white">{selectedProduct.min_stock_qty} {selectedProduct.unit}</p>
                                    </div>
                                    {selectedProduct.stock_qty <= selectedProduct.min_stock_qty && (
                                        <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                            <span className="material-icons text-red-500 text-sm">priority_high</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stock Movement History */}
                            <div>
                                <h4 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4">Product Info</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">SKU</span>
                                        <span className="font-medium text-slate-800 dark:text-white">{selectedProduct.sku}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Unit</span>
                                        <span className="font-medium text-slate-800 dark:text-white">{selectedProduct.unit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Margin</span>
                                        <span className="font-medium text-green-500">
                                            {selectedProduct.buy_price > 0
                                                ? `${Math.round(((selectedProduct.sell_price - selectedProduct.buy_price) / selectedProduct.buy_price) * 100)}%`
                                                : '—'}
                                        </span>
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
        </>
    );
}
