import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

export const BestSellers: React.FC = () => {
  const { products, setCurrentView, setSelectedCategory } = useShop();
  const [currentPage, setCurrentPage] = useState(1);

  if (products.length === 0) {
    return null;
  }

  const bestSellers = products.filter((p) => p.isBestSeller || p.rating >= 4.5);
  const displayedSource = bestSellers.length > 0 ? bestSellers : products;

  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(displayedSource.length / itemsPerPage));

  const displayedProducts = displayedSource.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-orange-600 via-amber-500 to-emerald-700" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Best sellers
          </h2>
        </div>

        <button
          id="best-sellers-view-all"
          onClick={() => {
            setSelectedCategory('All');
            setCurrentView('products');
          }}
          className="text-xs sm:text-sm font-semibold text-stone-600 hover:text-orange-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            const isActive = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                id={`best-sellers-page-${pageNum}`}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#155e3c] text-white shadow-sm'
                    : 'bg-white border border-stone-300 text-stone-700 hover:border-emerald-600 hover:text-emerald-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
