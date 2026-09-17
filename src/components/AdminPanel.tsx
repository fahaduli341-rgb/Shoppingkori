import React, { useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Order, OrderStatus, ProductCategory } from '../types';
import { compressImageToDataUrl } from '../lib/imageCompressor';
import { AdminSettingsTab } from './AdminSettingsTab';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  LogOut,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  X,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  RefreshCw,
  Settings as SettingsIcon
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    adminLogout,
    setCurrentView,
    showToast,
    authUser
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'All'>('All');
  const [productSearch, setProductSearch] = useState('');

  // Product modal (Add / Edit)
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product form state
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Home & Kitchen');
  const [prodPrice, setProdPrice] = useState<number>(500);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number>(650);
  const [prodStock, setProdStock] = useState<number>(20);
  const [prodUnit, setProdUnit] = useState('1 pc');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodTag, setProdTag] = useState<'NEW' | 'BEST SELLER' | 'HOT' | 'EXCLUSIVE' | undefined>(undefined);
  const [prodInStock, setProdInStock] = useState(true);

  // Gallery image upload state
  const [imageInputMode, setImageInputMode] = useState<'gallery' | 'url'>('gallery');
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image (JPG, PNG, WebP)', 'error');
      return;
    }
    setIsCompressingImage(true);
    try {
      const compressedDataUrl = await compressImageToDataUrl(file, 800, 0.82);
      setProdImage(compressedDataUrl);
      showToast('Photo loaded from gallery successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to load image: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsCompressingImage(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
    // reset input so same file can be re-selected if needed
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;

  const categories: ProductCategory[] = [
    'Clothes',
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Health & Beauty',
    'Mobile Recharge',
    'Sports & Outdoor',
    'Books & Stationery',
    'Office & Computer',
    'Agriculture & Garden',
    'Auto Parts'
  ];

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdBrand('');
    setProdCategory('Home & Kitchen');
    setProdPrice(500);
    setProdOriginalPrice(650);
    setProdStock(25);
    setProdUnit('1 pc');
    setProdDescription('');
    setProdImage('');
    setImageInputMode('gallery');
    setProdTag('NEW');
    setProdInStock(true);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdBrand(p.brand);
    setProdCategory(p.category);
    setProdPrice(p.price);
    setProdOriginalPrice(p.originalPrice || p.price);
    setProdStock(p.stock);
    setProdUnit(p.unit || '1 pc');
    setProdDescription(p.description);
    setProdImage(p.image);
    setImageInputMode(p.image.startsWith('data:') ? 'gallery' : 'url');
    setProdTag(p.tag);
    setProdInStock(p.inStock);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodBrand.trim()) {
      showToast('Product name and brand are required', 'error');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName.trim(),
        brand: prodBrand.trim(),
        category: prodCategory,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        stock: Number(prodStock),
        unit: prodUnit.trim(),
        description: prodDescription.trim(),
        image: prodImage.trim() || editingProduct.image,
        tag: prodTag,
        inStock: prodInStock
      });
    } else {
      addProduct({
        name: prodName.trim(),
        brand: prodBrand.trim(),
        category: prodCategory,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        stock: Number(prodStock),
        unit: prodUnit.trim(),
        description: prodDescription.trim(),
        sku: `SK-${Date.now().toString().slice(-6)}`,
        image: prodImage.trim() || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
        tag: prodTag,
        inStock: prodInStock,
        rating: 5.0,
        reviewCount: 1,
        isSpecialOffer: false,
        isBestSeller: false
      });
    }

    setShowProductModal(false);
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'All') return true;
    return o.status === orderFilter;
  });

  const filteredProducts = products.filter((p) => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-16">
      {/* Admin Top Navigation matching Daraz Seller Center aesthetic */}
      <header className="bg-[#155e3c] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Store</span>
            </button>

            <div className="h-5 w-px bg-emerald-700" />

            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-none">
                Shopping Kori Seller Center
              </h1>
              <span className="text-[10px] text-emerald-200">Merchant Admin Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">Merchant Admin</div>
              <div className="text-[10px] text-emerald-300">{authUser?.email || 'Authorized Merchant'}</div>
            </div>

            <button
              id="admin-logout-btn"
              onClick={adminLogout}
              className="p-2 sm:px-3 sm:py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              BDT {totalRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Active Store Balance
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              {orders.length}
            </div>
            <div className="text-[11px] text-orange-600 font-semibold mt-1">
              {pendingOrders} Pending Verification
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Products</span>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              {products.length}
            </div>
            <div className="text-[11px] text-stone-500 font-semibold mt-1">
              Active in catalog
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Delivery Coverage</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              64 Districts
            </div>
            <div className="text-[11px] text-stone-500 font-semibold mt-1">
              Cash on delivery enabled
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-300 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#155e3c] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            Orders Management ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-[#155e3c] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            Products Catalog ({products.length})
          </button>
          <button
            id="admin-tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-[#155e3c] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Store Settings (সেটিংস)</span>
          </button>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-stone-500" />
                <span className="text-xs font-bold text-stone-700">Filter Status:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        orderFilter === st
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[11px]">
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer & Location</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total & Payment</th>
                      <th className="p-4">Status & Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4 align-top">
                          <span className="font-mono font-bold text-orange-600 text-sm block">
                            {ord.id}
                          </span>
                          <span className="text-[11px] text-stone-400">{ord.createdAt}</span>
                        </td>

                        <td className="p-4 align-top max-w-[220px]">
                          <div className="font-bold text-stone-900">{ord.customerName}</div>
                          <div className="text-stone-600 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-stone-400" />
                            <span>{ord.phone}</span>
                          </div>
                          <div className="text-stone-500 text-[11px] mt-1 line-clamp-2">
                            {ord.address}, {ord.district} ({ord.deliveryZone})
                          </div>
                        </td>

                        <td className="p-4 align-top">
                          <div className="space-y-1">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded bg-stone-100 text-[10px] font-bold flex items-center justify-center">
                                  {it.quantity}
                                </span>
                                <span className="font-medium text-stone-800 truncate max-w-[150px]">
                                  {it.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-4 align-top">
                          <div className="font-bold text-stone-900 text-sm">
                            BDT {ord.totalAmount.toLocaleString()}
                          </div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-semibold">
                            {ord.paymentMethod}
                          </span>
                        </td>

                        <td className="p-4 align-top">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-hidden focus:border-orange-500 cursor-pointer shadow-2xs"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products in catalog..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <button
                id="admin-add-product-btn"
                onClick={handleOpenAddProduct}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[11px]">
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg bg-stone-50 p-1 object-contain border border-stone-200"
                            />
                            <div>
                              <span className="text-[10px] font-bold text-stone-400 uppercase">
                                {p.brand}
                              </span>
                              <h4 className="font-bold text-stone-900">{p.name}</h4>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-stone-600 font-medium">
                          {p.category}
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-orange-600">
                            BDT {p.price.toLocaleString()}
                          </span>
                          {p.originalPrice && (
                            <span className="text-[11px] text-stone-400 line-through block">
                              BDT {p.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-stone-700 font-medium">
                          {p.stock} units
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              p.inStock
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>

                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-stone-600 hover:text-orange-600 rounded-md hover:bg-stone-100 transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-stone-600 hover:text-red-600 rounded-md hover:bg-stone-100 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STORE CONFIGURATION & SETTINGS */}
        {activeTab === 'settings' && <AdminSettingsTab />}
      </div>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-extrabold text-lg text-stone-900">
                {editingProduct ? 'Edit Product' : 'Add New Product to Store'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Walton Rice Cooker"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    placeholder="e.g. WALTON, FRESH"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Selling Price (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Original Price (BDT)
                  </label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Unit / Size
                  </label>
                  <input
                    type="text"
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    placeholder="e.g. 1 pc, 1L"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tag
                  </label>
                  <select
                    value={prodTag || ''}
                    onChange={(e) => setProdTag((e.target.value as any) || undefined)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                  >
                    <option value="">None</option>
                    <option value="NEW">NEW</option>
                    <option value="BEST SELLER">BEST SELLER</option>
                  </select>
                </div>
              </div>

              {/* Product Image Selection: Gallery / Camera upload or URL */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Product Picture (প্রোডাক্টের ছবি) *
                  </label>
                  <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('gallery')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        imageInputMode === 'gallery'
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>গ্যালারি (Upload)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        imageInputMode === 'url'
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>ওয়েব লিঙ্ক (URL)</span>
                    </button>
                  </div>
                </div>

                {/* Hidden input for phone gallery/file picker */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {imageInputMode === 'gallery' ? (
                  <div>
                    {prodImage ? (
                      <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0 shadow-xs">
                          <img
                            src={prodImage}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>ছবি যুক্ত করা হয়েছে (Photo Ready)</span>
                          </div>
                          <p className="text-[11px] text-stone-500">
                            প্রোডাক্টটি সেভ করলে ক্রেতারা এই ছবিটি দেখতে পাবে।
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>অন্য ছবি দিন (Change)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setProdImage('')}
                              className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              মুছুন (Remove)
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                          dragActive
                            ? 'border-emerald-600 bg-emerald-50/50 scale-[1.01]'
                            : 'border-stone-300 hover:border-emerald-600 bg-stone-50/70 hover:bg-emerald-50/20'
                        }`}
                      >
                        {isCompressingImage ? (
                          <div className="flex flex-col items-center justify-center py-2 space-y-2">
                            <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-bold text-stone-700">
                              ছবি প্রসেস হচ্ছে... (Optimizing photo)
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shadow-2xs">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-stone-800">
                                গ্যালারি থেকে ছবি সিলেক্ট করুন (Choose from Gallery)
                              </p>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                মোবাইল ক্যামেরা বা গ্যালারি থেকে ছবি আপলোড করতে এখানে ক্লিক করুন
                              </p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <Upload className="w-3 h-3" />
                              গ্যালারি খুলুন (Browse Files)
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      placeholder="https://images.unsplash.com/... বা ছবির সরাসরি লিঙ্ক"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                    />
                    {prodImage && (
                      <div className="mt-2 flex items-center gap-2">
                        <img
                          src={prodImage}
                          alt="Preview"
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80';
                          }}
                        />
                        <span className="text-[11px] text-stone-500">Image link preview</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Authentic product details, warranty, packaging specifications..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prodInStock}
                  onChange={(e) => setProdInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="text-xs font-semibold text-stone-800">
                  Available in Stock (Ready for Dispatch)
                </span>
              </label>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
