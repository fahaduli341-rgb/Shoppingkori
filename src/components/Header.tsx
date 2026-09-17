import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, ShoppingCart, User, Search, Menu, X, Heart, Package, ShieldCheck } from 'lucide-react';
import { ProductCategory } from '../types';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    wishlist,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    isAdminLoggedIn,
    setShowAdminLoginModal,
    storeSettings
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (currentView !== 'products') {
      setCurrentView('products');
    }
  };

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

  const cleanWhatsApp = storeSettings.whatsappNumber ? storeSettings.whatsappNumber.replace(/[^0-9]/g, '') : '';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-[#155e3c] text-emerald-50 px-4 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
        <span>{storeSettings.announcement || '100% Genuine Products & Cash on Delivery Available Across Bangladesh'}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-2.5">
        {/* Main Header Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Mobile Menu & Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 text-stone-700 hover:text-orange-600 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo */}
            <button
              id="brand-logo-btn"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setCurrentView('home');
              }}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 sm:w-5 sm:h-5 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-orange-600 font-sans">
                  Shopping<span className="text-stone-900">Kori</span>
                </span>
                <span className="text-[10px] text-stone-500 font-medium -mt-1 hidden sm:inline">
                  Everyday Essentials Online
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <input
                id="desktop-search-input"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search for products..."
                className="w-full bg-[#fbf8f3] border border-stone-300 rounded-full py-2.5 pl-5 pr-14 text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              <button
                id="desktop-search-submit"
                type="submit"
                className="absolute right-1.5 w-9 h-9 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Quick All Products Link for desktop */}
            <button
              id="desktop-all-products-btn"
              onClick={() => {
                setSelectedCategory('All');
                setCurrentView('products');
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Catalogue</span>
            </button>

            {/* Wishlist Icon */}
            <button
              id="header-wishlist-btn"
              onClick={() => setCurrentView('wishlist')}
              className="relative p-2 text-stone-700 hover:text-orange-600 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              id="header-cart-btn"
              onClick={() => setCurrentView('cart')}
              className="relative p-2 text-stone-700 hover:text-orange-600 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              id="header-account-btn"
              onClick={() => setCurrentView('account')}
              className="p-2 text-stone-700 hover:text-orange-600 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Hidden admin badge if logged in */}
            {isAdminLoggedIn && (
              <button
                id="header-admin-portal-btn"
                onClick={() => setCurrentView('admin')}
                className="ml-1 px-2.5 py-1 bg-stone-900 text-amber-400 text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar Row (matches exact screenshot layout) */}
        <div className="md:hidden mt-2.5">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              id="mobile-search-input"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search for products..."
              className="w-full bg-[#fbf8f3] border border-stone-300 rounded-full py-2.5 pl-4 pr-12 text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
            <button
              id="mobile-search-submit"
              type="submit"
              className="absolute right-1.5 w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center active:scale-95 shadow-sm"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Slide-out Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative w-72 sm:w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg text-orange-600">Shopping Kori</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-900 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Quick Views */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Navigation
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setCurrentView('home');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                      currentView === 'home' ? 'bg-orange-50 text-orange-600' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>Home</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setCurrentView('products');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                      currentView === 'products' ? 'bg-orange-50 text-orange-600' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>All Products</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('tracking');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    <span>Track My Order</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('account');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    <span>My Account</span>
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Categories
                </h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentView('products');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-600 hover:text-orange-600 hover:bg-orange-50/50 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Support & Admin info */}
              <div className="pt-4 border-t border-stone-200">
                <div className="text-xs text-stone-500 space-y-1.5">
                  <p className="font-semibold text-stone-700">Need Help?</p>
                  <p>
                    Hotline:{' '}
                    <a href={`tel:${storeSettings.phone}`} className="text-stone-700 font-semibold hover:text-orange-600">
                      {storeSettings.phone}
                    </a>
                  </p>
                  <p>
                    WhatsApp:{' '}
                    {cleanWhatsApp ? (
                      <a
                        href={`https://wa.me/${cleanWhatsApp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-semibold hover:underline"
                      >
                        {storeSettings.whatsappNumber}
                      </a>
                    ) : (
                      <span>{storeSettings.whatsappNumber}</span>
                    )}
                  </p>
                </div>

                {/* Discrete Seller/Admin Portal button */}
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (isAdminLoggedIn) {
                        setCurrentView('admin');
                      } else {
                        setShowAdminLoginModal(true);
                      }
                    }}
                    className="text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1.5 py-1"
                  >
                    <span>Seller & Merchant Portal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
