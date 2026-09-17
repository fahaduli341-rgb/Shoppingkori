import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { ArrowRight, PackagePlus, ShieldCheck } from 'lucide-react';

export const SpecialOffers: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    setCurrentView,
    setSelectedCategory,
    isAdminLoggedIn,
    setShowAdminLoginModal
  } = useShop();

  // Filter special offers or fallback to all products
  const specialOffers = products.filter(
    (p) => p.isSpecialOffer || (p.discountPercent && p.discountPercent > 0)
  );

  const displayedList = specialOffers.length > 0 ? specialOffers : products;

  if (isLoadingProducts) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-stone-500 font-medium">Connecting to Firebase catalog...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-orange-600 via-amber-500 to-emerald-700" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Special offers
          </h2>
        </div>

        {displayedList.length > 0 && (
          <button
            id="special-offers-view-all"
            onClick={() => {
              setSelectedCategory('All');
              setCurrentView('products');
            }}
            className="text-xs sm:text-sm font-semibold text-stone-600 hover:text-orange-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {displayedList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {displayedList.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 border border-stone-200/80 rounded-3xl p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
            <PackagePlus className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 text-base">Firebase Store Connected & Ready</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
            All fake items have been removed. Add your real products from the Seller Center (Admin Panel) to start selling to buyers.
          </p>
          <button
            id="empty-state-open-admin-btn"
            onClick={() => {
              if (isAdminLoggedIn) {
                setCurrentView('admin');
              } else {
                setShowAdminLoginModal(true);
              }
            }}
            className="px-5 py-2.5 bg-[#155e3c] hover:bg-[#114b30] active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Seller Center & Add Products</span>
          </button>
        </div>
      )}
    </section>
  );
};
