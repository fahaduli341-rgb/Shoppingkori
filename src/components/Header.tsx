import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Heart,
  Package,
  ShieldCheck,
  Globe,
  ChevronDown
} from 'lucide-react';
import { CATEGORIES_DATA } from '../data/marketplaceData';
import { ProductCategory } from '../types';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    wishlist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setSelectedSubCategory,
    isAdminLoggedIn,
    setShowAdminLoginModal,
    customerUser,
    storeSettings,
    language,
    setLanguage,
    t
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (currentView !== 'products') {
      setCurrentView('products');
    }
  };

  const cleanWhatsApp = storeSettings.whatsappNumber ? storeSettings.whatsappNumber.replace(/[^0-9]/g, '') : '';

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Banner Notice - Secondary Brand Color (#1F6F4A) */}
      <div className="bg-[#1F6F4A] text-emerald-50 px-4 py-1.5 text-xs text-center font-medium flex items-center justify-between max-w-7xl mx-auto">
        <div className="hidden sm:flex items-center gap-2 text-emerald-200 text-[11px]">
          <span>{storeSettings.tagline || 'ঘরে বসে, বাজার করি'}</span>
        </div>

        <div className="flex items-center justify-center gap-2 mx-auto sm:mx-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span>{storeSettings.announcement || '100% Genuine Products & Cash on Delivery Available Across Bangladesh'}</span>
        </div>

        {/* Top Language Toggle & Support */}
        <div className="flex items-center gap-3">
          <button
            id="lang-toggle-btn-top"
            onClick={toggleLanguage}
            className="flex items-center gap-1 bg-emerald-800/80 hover:bg-emerald-700 text-white px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer"
            title="Toggle Language / ভাষা পরিবর্তন"
          >
            <Globe className="w-3 h-3 text-emerald-200" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5">
        {/* Main Header Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Mobile Menu & Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 text-stone-700 hover:text-[#E85D2C] hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo - Name: Shopping Kori, Tagline: "ঘরে বসে, বাজার করি", Colors: #E85D2C & #1F6F4A */}
            <button
              id="brand-logo-btn"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSubCategory('All');
                setSearchQuery('');
                setCurrentView('home');
              }}
              className="flex items-center gap-2 group text-left cursor-pointer shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#E85D2C] to-amber-500 flex items-center justify-center text-white shadow-sm shadow-[#E85D2C]/20 group-hover:scale-105 transition-transform shrink-0">
                <ShoppingBag className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold tracking-tight text-[#E85D2C] font-sans leading-none whitespace-nowrap">
                  Shopping<span className="text-[#1F6F4A]">Kori</span>
                </span>
                <span className="hidden sm:block text-[11px] text-stone-600 font-medium mt-0.5 tracking-wide">
                  {storeSettings.tagline || 'ঘরে বসে, বাজার করি'}
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
                placeholder={t.searchPlaceholder}
                className="w-full bg-white border border-stone-300 rounded-full py-2.5 pl-5 pr-14 text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-[#E85D2C] focus:ring-2 focus:ring-[#E85D2C]/20 transition-all shadow-xs"
              />
              <button
                id="desktop-search-submit"
                type="submit"
                className="absolute right-1.5 w-9 h-9 rounded-full bg-[#E85D2C] hover:bg-[#c94b1f] text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Quick All Products Link for desktop */}
            <button
              id="desktop-all-products-btn"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSubCategory('All');
                setCurrentView('products');
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-[#E85D2C] hover:bg-orange-50 rounded-full transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>{t.products}</span>
            </button>

            {/* Wishlist Icon */}
            <button
              id="header-wishlist-btn"
              onClick={() => setCurrentView('wishlist')}
              className="relative p-2 text-stone-700 hover:text-[#E85D2C] hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E85D2C] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              id="header-cart-btn"
              onClick={() => setCurrentView('cart')}
              className="relative p-2 text-stone-700 hover:text-[#E85D2C] hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E85D2C] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            <button
              id="header-account-btn"
              onClick={() => setCurrentView('account')}
              className="p-2 text-stone-700 hover:text-[#E85D2C] hover:bg-stone-100 rounded-full transition-colors cursor-pointer relative"
              aria-label="User Account"
              title={customerUser ? `${customerUser.name} (My Account)` : 'User Account / একাউন্ট'}
            >
              <User className="w-5 h-5" />
              {customerUser && (
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Admin portal button - perfectly aligned and compact without overflow */}
            {isAdminLoggedIn ? (
              <button
                id="header-admin-portal-btn"
                onClick={() => setCurrentView('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold rounded-full transition-all shadow-xs shrink-0 cursor-pointer"
                title="Admin Dashboard (অ্যাডমিন প্যানেল)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-semibold tracking-wide">Admin</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAdminLoginModal(true)}
                className="p-2 text-stone-500 hover:text-[#E85D2C] hover:bg-stone-100 rounded-full transition-colors cursor-pointer shrink-0"
                title="Admin Portal Login"
                aria-label="Admin Portal"
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden mt-2.5">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              id="mobile-search-input"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-white border border-stone-300 rounded-full py-2.5 pl-4 pr-12 text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-[#E85D2C] focus:ring-2 focus:ring-[#E85D2C]/20 shadow-xs"
            />
            <button
              id="mobile-search-submit"
              type="submit"
              className="absolute right-1.5 w-8 h-8 rounded-full bg-[#E85D2C] hover:bg-[#c94b1f] text-white flex items-center justify-center active:scale-95 shadow-sm cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Marketplace Category Sub-Navigation Bar (Daraz style horizontal menu) */}
        <div className="hidden md:flex items-center gap-1.5 pt-2 border-t border-stone-200/60 mt-2 overflow-x-auto no-scrollbar text-xs font-medium">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedSubCategory('All');
              setCurrentView('products');
            }}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'All'
                ? 'bg-[#E85D2C] text-white font-bold shadow-2xs'
                : 'text-stone-700 hover:bg-stone-100 hover:text-[#E85D2C]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{t.allCategories}</span>
          </button>

          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedSubCategory('All');
                setCurrentView('products');
              }}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#1F6F4A] text-white font-bold shadow-2xs'
                  : 'text-stone-700 hover:bg-stone-100 hover:text-[#1F6F4A]'
              }`}
            >
              {language === 'bn' ? cat.nameBn : cat.nameEn}
            </button>
          ))}

          <div className="h-4 w-px bg-stone-200 mx-1 shrink-0" />

          {/* Quick Track Order Link */}
          <button
            onClick={() => setCurrentView('tracking')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 text-stone-600 hover:text-[#E85D2C] hover:bg-orange-50 font-semibold ${
              currentView === 'tracking' ? 'text-[#E85D2C] bg-orange-50' : ''
            }`}
          >
            {t.trackOrder}
          </button>
        </div>
      </div>

      {/* Slide-out Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="fixed inset-y-0 left-0 w-[290px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200 overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-[#FDFBF7] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E85D2C] flex items-center justify-center text-white shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base text-[#E85D2C] leading-none">Shopping Kori</span>
                  <span className="text-[10px] text-stone-500">{storeSettings.tagline || 'ঘরে বসে, বাজার করি'}</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Toggle in Drawer */}
            <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
              <span className="text-xs font-semibold text-stone-600">Language / ভাষা:</span>
              <button
                onClick={toggleLanguage}
                className="text-xs font-bold text-[#E85D2C] bg-white hover:bg-orange-50 border border-stone-300 px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'English এ পরিবর্তন করুন' : 'Switch to বাংলা'}
              </button>
            </div>

            {/* If Admin is logged in, show direct admin dashboard button */}
            {isAdminLoggedIn && (
              <div className="p-3 bg-amber-50/80 border-b border-amber-200/80 shrink-0">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setCurrentView('admin');
                  }}
                  className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs rounded-xl flex items-center justify-between shadow-xs transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Admin Panel (অ্যাডমিন)</span>
                  </span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                    Online
                  </span>
                </button>
              </div>
            )}

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Quick Views */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  {language === 'bn' ? 'মেনু' : 'Navigation'}
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setCurrentView('home');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                      currentView === 'home' ? 'bg-orange-50 text-[#E85D2C] font-bold' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{t.home}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedSubCategory('All');
                      setCurrentView('products');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                      currentView === 'products' ? 'bg-orange-50 text-[#E85D2C] font-bold' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{t.products}</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('tracking');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    <span>{t.trackOrder}</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('account');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    <span>{t.account}</span>
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  {t.allCategories}
                </h4>
                <div className="space-y-1">
                  {CATEGORIES_DATA.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedSubCategory('All');
                        setCurrentView('products');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-600 hover:text-[#E85D2C] hover:bg-orange-50/50 transition-colors"
                    >
                      {language === 'bn' ? cat.nameBn : cat.nameEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Support & Admin info */}
              <div className="pt-4 border-t border-stone-200">
                <div className="text-xs text-stone-500 space-y-1.5">
                  <p className="font-semibold text-stone-700">{language === 'bn' ? 'সাহায্য প্রয়োজন?' : 'Need Help?'}</p>
                  <p>
                    Hotline:{' '}
                    <a href={`tel:${storeSettings.phone}`} className="text-stone-700 font-semibold hover:text-[#E85D2C]">
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
                    className="text-xs text-stone-500 hover:text-[#E85D2C] font-medium flex items-center gap-1.5 py-1"
                  >
                    <span>{t.adminLogin} / Seller Portal</span>
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
