import React, { useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Order, OrderStatus, ProductCategory, CourierProvider } from '../types';
import { compressImageToDataUrl } from '../lib/imageCompressor';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminVendorsTab } from './AdminVendorsTab';
import { AdminCouponsTab } from './AdminCouponsTab';
import { CATEGORIES_DATA } from '../data/marketplaceData';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Store,
  Tag,
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
  RefreshCw,
  Settings as SettingsIcon,
  Truck,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  FileText
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    products,
    orders,
    vendors,
    coupons,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    confirmOrder,
    adminLogout,
    setCurrentView,
    showToast,
    authUser,
    seedMarketplaceProducts
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'vendors' | 'coupons' | 'settings'>('orders');
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'All'>('All');
  const [productSearch, setProductSearch] = useState('');

  // Selected Order for detail & courier dispatch modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [courierSelection, setCourierSelection] = useState<CourierProvider>('Steadfast');
  const [consignmentInput, setConsignmentInput] = useState('');
  const [adminNotesInput, setAdminNotesInput] = useState('');

  // Product modal (Add / Edit / Delete)
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Product form state
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Home & Living');
  const [prodSubCategory, setProdSubCategory] = useState('');
  const [prodVendorId, setProdVendorId] = useState('');
  const [prodVendorName, setProdVendorName] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(500);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number>(650);
  const [prodStock, setProdStock] = useState<number>(20);
  const [prodUnit, setProdUnit] = useState('1 pc');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodSizes, setProdSizes] = useState('');
  const [prodColors, setProdColors] = useState('');
  const [prodInFlashSale, setProdInFlashSale] = useState(false);
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

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdBrand('');
    setProdCategory('Fashion');
    setProdSubCategory('');
    setProdVendorId(vendors[0]?.id || 'v-01');
    setProdVendorName(vendors[0]?.storeName || 'Shopping Kori Official');
    setProdPrice(500);
    setProdOriginalPrice(650);
    setProdStock(25);
    setProdUnit('1 pc');
    setProdDescription('');
    setProdImage('');
    setProdSizes('');
    setProdColors('');
    setProdInFlashSale(false);
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
    setProdSubCategory(p.subCategory || '');
    setProdVendorId(p.vendorId || vendors[0]?.id || '');
    setProdVendorName(p.vendorName || vendors[0]?.storeName || '');
    setProdPrice(p.price);
    setProdOriginalPrice(p.originalPrice || p.price);
    setProdStock(p.stock);
    setProdUnit(p.unit || '1 pc');
    setProdDescription(p.description);
    setProdImage(p.image);
    setProdSizes(p.sizes ? p.sizes.join(', ') : '');
    setProdColors(p.colors ? p.colors.join(', ') : '');
    setProdInFlashSale(!!p.inFlashSale);
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

    const sizesArr = prodSizes.split(',').map((s) => s.trim()).filter(Boolean);
    const colorsArr = prodColors.split(',').map((c) => c.trim()).filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName.trim(),
        brand: prodBrand.trim(),
        category: prodCategory,
        subCategory: prodSubCategory.trim() || undefined,
        vendorId: prodVendorId || undefined,
        vendorName: prodVendorName || undefined,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        stock: Number(prodStock),
        unit: prodUnit.trim(),
        description: prodDescription.trim(),
        image: prodImage.trim() || editingProduct.image,
        sizes: sizesArr.length > 0 ? sizesArr : undefined,
        colors: colorsArr.length > 0 ? colorsArr : undefined,
        inFlashSale: prodInFlashSale,
        tag: prodTag,
        inStock: prodInStock
      });
    } else {
      addProduct({
        name: prodName.trim(),
        brand: prodBrand.trim(),
        category: prodCategory,
        subCategory: prodSubCategory.trim() || undefined,
        vendorId: prodVendorId || undefined,
        vendorName: prodVendorName || undefined,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        stock: Number(prodStock),
        unit: prodUnit.trim(),
        description: prodDescription.trim(),
        sku: `SK-${Date.now().toString().slice(-6)}`,
        image: prodImage.trim() || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
        sizes: sizesArr.length > 0 ? sizesArr : undefined,
        colors: colorsArr.length > 0 ? colorsArr : undefined,
        inFlashSale: prodInFlashSale,
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

  const handleOpenOrderDetails = (ord: Order) => {
    setSelectedOrder(ord);
    setCourierSelection(ord.courier || 'Steadfast');
    setConsignmentInput(ord.consignmentId || ord.trackingCode || '');
    setAdminNotesInput(ord.adminNotes || '');
  };

  const handleSaveCourierDispatch = async () => {
    if (!selectedOrder) return;
    try {
      await updateOrderStatus(
        selectedOrder.id,
        selectedOrder.status,
        courierSelection,
        consignmentInput.trim() || undefined,
        adminNotesInput.trim() || undefined
      );
      showToast(`Courier dispatch details updated for #${selectedOrder.id}`, 'success');
      setSelectedOrder(null);
    } catch (err: any) {
      showToast('Failed to save courier dispatch info', 'error');
    }
  };

  const handleSeedMarketplace = async () => {
    try {
      await seedMarketplaceProducts();
      showToast('Marketplace catalog updated with seed products & vendors!', 'success');
    } catch (err: any) {
      showToast('Failed to seed marketplace: ' + (err.message || 'Error'), 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'All') return true;
    return o.status === orderFilter;
  });

  const filteredProducts = products.filter((p) => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return (
      (p.name?.toLowerCase() || '').includes(q) ||
      (p.brand?.toLowerCase() || '').includes(q) ||
      (p.category?.toLowerCase() || '').includes(q) ||
      (p.vendorName && p.vendorName.toLowerCase().includes(q))
    );
  });

  // Calculate customer fraud risk score
  const getRiskScoreBadge = (ord: Order) => {
    const isCleanBdPhone = /^01[3-9]\d{8}$/.test(ord.phone.replace(/[^0-9]/g, ''));
    if (ord.customerRiskScore) {
      if (ord.customerRiskScore === 'Low') {
        return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Low COD Risk</span>;
      }
      if (ord.customerRiskScore === 'Medium') {
        return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Medium Risk</span>;
      }
      return <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> High Risk</span>;
    }

    if (isCleanBdPhone) {
      return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Low COD Risk</span>;
    }
    return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Check Phone</span>;
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-16">
      {/* Admin Top Navigation */}
      <header className="bg-[#1F6F4A] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <div className="h-5 w-px bg-emerald-700" />

            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-none text-[#FDFBF7]">
                Shopping Kori Seller Center
              </h1>
              <span className="text-[10px] text-emerald-200">
                Multi-Vendor Marketplace Admin Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedMarketplace}
              className="hidden md:flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-stone-900 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Refresh demo marketplace catalog"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seed Marketplace</span>
            </button>

            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">Super Admin</div>
              <div className="text-[10px] text-emerald-200">{authUser?.email || 'admin@shoppingkori.com'}</div>
            </div>

            <button
              id="admin-logout-btn"
              onClick={adminLogout}
              className="p-2 sm:px-3 sm:py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
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
              Store Cashflow
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-[#E85D2C]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              {orders.length}
            </div>
            <div className="text-[11px] text-[#E85D2C] font-semibold mt-1">
              {pendingOrders} Pending Verification
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Vendors</span>
              <Store className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              {vendors.length}
            </div>
            <div className="text-[11px] text-stone-500 font-semibold mt-1">
              Active Merchants
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Products</span>
              <Package className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              {products.length}
            </div>
            <div className="text-[11px] text-stone-500 font-semibold mt-1">
              Active in catalog
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-300 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-[#1F6F4A] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-[#1F6F4A] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'vendors'
                ? 'bg-[#1F6F4A] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Vendors ({vendors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'coupons'
                ? 'bg-[#1F6F4A] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons ({coupons.length})</span>
          </button>

          <button
            id="admin-tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-[#1F6F4A] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Pending Orders Alert Banner */}
            {orders.some((o) => o.status === 'Pending') && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {orders.filter((o) => o.status === 'Pending').length}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                      <span>অপেক্ষমাণ নতুন অর্ডার (Pending Orders to Confirm)</span>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    </h4>
                    <p className="text-xs text-stone-600">
                      নতুন অর্ডার এসেছে। সরাসরি "Confirm Order" বাটনে চাপ দিয়ে নিশ্চিত করুন অথবা ফোনে কথা বলুন।
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOrderFilter('Pending')}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Pending অর্ডারগুলো ফিল্টার করুন ({orders.filter((o) => o.status === 'Pending').length})
                </button>
              </div>
            )}

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
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        orderFilter === st
                          ? 'bg-[#E85D2C] text-white shadow-xs'
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
                      <th className="p-4">Customer & Phone</th>
                      <th className="p-4">Items & Vendor</th>
                      <th className="p-4">Amount & Payment</th>
                      <th className="p-4">Courier & Risk</th>
                      <th className="p-4">Status & Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4 align-top">
                          <span className="font-mono font-bold text-[#E85D2C] text-sm block">
                            #{ord.id}
                          </span>
                          <span className="text-[11px] text-stone-400">{ord.createdAt}</span>
                          {ord.deliveryZone && (
                            <span className="text-[10px] text-stone-500 block mt-0.5">
                              {ord.deliveryZone}
                            </span>
                          )}
                        </td>

                        <td className="p-4 align-top max-w-[200px]">
                          <div className="font-bold text-stone-900">{ord.customerName}</div>
                          <div className="text-stone-600 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span className="font-mono">{ord.phone}</span>
                          </div>
                          <div className="text-stone-500 text-[11px] mt-1 line-clamp-2">
                            {ord.address}, {ord.district}
                          </div>
                        </td>

                        <td className="p-4 align-top">
                          <div className="space-y-1">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs">
                                <span className="w-4 h-4 rounded bg-stone-100 text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {it.quantity}
                                </span>
                                <span className="font-medium text-stone-800 truncate max-w-[140px]">
                                  {it.name}
                                </span>
                                {it.selectedSize && <span className="text-[10px] text-stone-400">({it.selectedSize})</span>}
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-4 align-top">
                          <div className="font-extrabold text-stone-900 text-sm">
                            BDT {ord.totalAmount.toLocaleString()}
                          </div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px] font-semibold">
                            {ord.paymentMethod}
                          </span>
                          {ord.paymentStatus && (
                            <span className={`block text-[10px] font-bold mt-0.5 ${ord.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                              • {ord.paymentStatus}
                            </span>
                          )}
                          {ord.trxId && (
                            <div className="text-[10px] font-mono text-[#E2136E] font-bold mt-1 bg-pink-50 border border-pink-200 px-1.5 py-0.5 rounded">
                              TrxID: {ord.trxId}
                            </div>
                          )}
                          {ord.senderPhone && (
                            <div className="text-[10px] text-stone-600 font-mono mt-0.5">
                              From: {ord.senderPhone}
                            </div>
                          )}
                        </td>

                        <td className="p-4 align-top space-y-1.5">
                          {getRiskScoreBadge(ord)}
                          <div className="text-xs">
                            <span className="text-stone-400 block text-[10px]">Courier:</span>
                            <span className="font-semibold text-stone-800 flex items-center gap-1">
                              <Truck className="w-3 h-3 text-[#1F6F4A]" />
                              <span>{ord.courier || 'Unassigned'}</span>
                            </span>
                          </div>
                        </td>

                        <td className="p-4 align-top space-y-1.5 min-w-[140px]">
                          {/* 1-Click Order Confirmation */}
                          {ord.status === 'Pending' ? (
                            <button
                              onClick={() => confirmOrder(ord.id)}
                              className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer animate-pulse"
                              title="অর্ডার নিশ্চিত করতে ক্লিক করুন"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Confirm (নিশ্চিত করুন)</span>
                            </button>
                          ) : ord.status === 'Confirmed' ? (
                            <div className="w-full py-1 px-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Confirmed (নিশ্চিত)</span>
                            </div>
                          ) : null}

                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs font-semibold text-stone-800 focus:outline-hidden focus:border-[#E85D2C] cursor-pointer shadow-2xs w-full"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => handleOpenOrderDetails(ord)}
                            className="w-full py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Courier Dispatch</span>
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
                  placeholder="Search by title, brand, vendor..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                />
              </div>

              <button
                id="admin-add-product-btn"
                onClick={handleOpenAddProduct}
                className="px-5 py-2.5 bg-[#E85D2C] hover:bg-[#c94b1f] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
                      <th className="p-4">Vendor & Category</th>
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
                              <h4 className="font-bold text-stone-900 line-clamp-1">{p.name}</h4>
                              {p.sku && <span className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</span>}
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="font-semibold text-stone-800 block text-xs">
                            {p.vendorName || 'Shopping Kori'}
                          </span>
                          <span className="text-stone-500 text-[11px]">
                            {p.category} {p.subCategory ? `• ${p.subCategory}` : ''}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-[#E85D2C]">
                            BDT {p.price.toLocaleString()}
                          </span>
                          {p.originalPrice && (
                            <span className="text-[11px] text-stone-400 line-through block">
                              BDT {p.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-stone-600">
                          <span className="font-semibold">{p.stock}</span> {p.unit || 'units'}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              p.inStock
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-stone-500 hover:text-[#E85D2C] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MULTI-VENDOR MANAGEMENT */}
        {activeTab === 'vendors' && <AdminVendorsTab />}

        {/* TAB 4: COUPONS & DISCOUNTS */}
        {activeTab === 'coupons' && <AdminCouponsTab />}

        {/* TAB 5: STORE SETTINGS */}
        {activeTab === 'settings' && <AdminSettingsTab />}
      </div>

      {/* Courier Dispatch & Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#1F6F4A]" />
                  <span>Courier Dispatch - Order #{selectedOrder.id}</span>
                </h3>
                <span className="text-xs text-stone-500">{selectedOrder.customerName} • {selectedOrder.phone}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Courier Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Select Courier Provider (কুরিয়ার পার্টনার)
                </label>
                <select
                  value={courierSelection}
                  onChange={(e) => setCourierSelection(e.target.value as CourierProvider)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:border-[#E85D2C]"
                >
                  <option value="Steadfast">Steadfast Courier (স্টেডফাস্ট)</option>
                  <option value="Pathao">Pathao Courier (পাঠাও)</option>
                  <option value="RedX">RedX Logistics (রেডএক্স)</option>
                  <option value="Sundarban">Sundarban Courier (সুন্দরবন)</option>
                  <option value="eCourier">eCourier</option>
                  <option value="Paperfly">Paperfly</option>
                </select>
              </div>

              {/* Consignment Code */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Consignment ID / Tracking Number
                </label>
                <input
                  type="text"
                  value={consignmentInput}
                  onChange={(e) => setConsignmentInput(e.target.value)}
                  placeholder="e.g. STDF-982412 or REDX-7410"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#E85D2C]"
                />
                <span className="text-[11px] text-stone-400">
                  Customers can track live parcel status with this tracking code.
                </span>
              </div>

              {/* Admin Dispatch Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Admin Internal Logistics Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="e.g. Handed over to courier pickup boy on 17 Sep..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                />
              </div>

              {/* Direct Order Confirmation & Call Customer Actions */}
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">বর্তমান স্ট্যাটাস:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    selectedOrder.status === 'Delivered'
                      ? 'bg-emerald-200 text-emerald-900'
                      : selectedOrder.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedOrder.status === 'Pending' ? (
                    <button
                      type="button"
                      onClick={async () => {
                        await confirmOrder(selectedOrder.id);
                        setSelectedOrder((prev) => (prev ? { ...prev, status: 'Confirmed' } : null));
                      }}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Order (অর্ডার নিশ্চিত করুন)</span>
                    </button>
                  ) : (
                    <div className="flex-1 py-1.5 px-3 bg-white border border-emerald-300 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>অর্ডার ইতিমধ্যে কনফার্ম করা আছে</span>
                    </div>
                  )}

                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="কাস্টমারকে সরাসরি কল করুন"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Customer</span>
                  </a>
                </div>
              </div>

              {/* Order Address Preview */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="font-bold text-stone-800">Delivery Destination:</div>
                <div className="text-stone-600">{selectedOrder.address}, {selectedOrder.district}</div>
                <div className="text-stone-500 font-medium">Zone: {selectedOrder.deliveryZone} | Total: ৳{selectedOrder.totalAmount}</div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCourierDispatch}
                  className="flex-1 py-2.5 bg-[#1F6F4A] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save Dispatch Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base sm:text-lg text-stone-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Premium Cotton Panjabi or Wireless Bluetooth Headphone"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                />
              </div>

              {/* Brand & Vendor Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    placeholder="e.g. Aarong, Samsung, Casio"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Partner Vendor Store
                  </label>
                  <select
                    value={prodVendorId}
                    onChange={(e) => {
                      const selId = e.target.value;
                      setProdVendorId(selId);
                      const found = vendors.find((v) => v.id === selId);
                      if (found) setProdVendorName(found.storeName);
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.storeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => {
                      const newCat = e.target.value as ProductCategory;
                      setProdCategory(newCat);
                      const catObj = CATEGORIES_DATA.find((c) => c.nameEn === newCat || c.id === newCat);
                      if (catObj && catObj.subCategories.length > 0) {
                        setProdSubCategory(catObj.subCategories[0]);
                      }
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameEn} ({c.nameBn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={prodSubCategory}
                    onChange={(e) => setProdSubCategory(e.target.value)}
                    placeholder="e.g. Panjabi, Smart Watch"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Selling Price (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Original / Strike Price (BDT)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>
              </div>

              {/* Stock, Unit & Tag */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Available Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Packaging Unit
                  </label>
                  <input
                    type="text"
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    placeholder="1 pc, 1 kg"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Badge
                  </label>
                  <select
                    value={prodTag || ''}
                    onChange={(e) => setProdTag(e.target.value ? (e.target.value as any) : undefined)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  >
                    <option value="">None</option>
                    <option value="NEW">NEW</option>
                    <option value="BEST SELLER">BEST SELLER</option>
                    <option value="HOT">HOT</option>
                    <option value="EXCLUSIVE">EXCLUSIVE</option>
                  </select>
                </div>
              </div>

              {/* Variants: Sizes & Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Sizes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={prodSizes}
                    onChange={(e) => setProdSizes(e.target.value)}
                    placeholder="M, L, XL, XXL"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Colors (comma separated)
                  </label>
                  <input
                    type="text"
                    value={prodColors}
                    onChange={(e) => setProdColors(e.target.value)}
                    placeholder="Black, Navy, White, Maroon"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>
              </div>

              {/* Flash sale checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="prod-flash-sale"
                  checked={prodInFlashSale}
                  onChange={(e) => setProdInFlashSale(e.target.checked)}
                  className="w-4 h-4 rounded text-[#E85D2C] focus:ring-[#E85D2C]"
                />
                <label htmlFor="prod-flash-sale" className="text-xs font-semibold text-stone-800 cursor-pointer">
                  Feature in Flash Sale (ফ্ল্যাশ সেল অফারে দেখান)
                </label>
              </div>

              {/* Product Image Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Product Image (পণ্যের ছবি) *
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('gallery')}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                        imageInputMode === 'gallery'
                          ? 'bg-[#1F6F4A] text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Gallery / File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                        imageInputMode === 'url'
                          ? 'bg-[#1F6F4A] text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

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
                      <div className="relative border border-stone-200 rounded-2xl p-3 bg-stone-50 flex items-center gap-4">
                        <img
                          src={prodImage}
                          alt="Uploaded product"
                          className="w-16 h-16 rounded-xl object-contain bg-white border border-stone-200"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-stone-800">
                            ছবি সফলভাবে লোড হয়েছে
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Change Photo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setProdImage('')}
                              className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Remove
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
                              Optimizing photo...
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-[#1F6F4A] flex items-center justify-center shadow-2xs">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-stone-800">
                                গ্যালারি বা কম্পিউটার থেকে ছবি আপলোড করুন
                              </p>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                JPG, PNG, WebP সাপোর্টেড
                              </p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1F6F4A] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <Upload className="w-3 h-3" />
                              Browse File
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
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Authentic product details, warranty, material..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prodInStock}
                  onChange={(e) => setProdInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-[#E85D2C] focus:ring-[#E85D2C]"
                />
                <span className="text-xs font-semibold text-stone-800">
                  Available in Stock (Ready for Dispatch)
                </span>
              </label>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#E85D2C] hover:bg-[#c94b1f] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* In-app Product Deletion Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-base text-stone-900">
                Delete Product? (পণ্য মুছে ফেলুন)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <strong className="text-stone-900 font-bold">"{productToDelete.name}"</strong>?
              </p>
              <p className="text-[11px] text-stone-400">
                This item will be removed immediately from your live online storefront.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 active:scale-98 text-stone-700 font-semibold text-xs rounded-xl cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = productToDelete.id;
                  setProductToDelete(null);
                  await deleteProduct(id);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
