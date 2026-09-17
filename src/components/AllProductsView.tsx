import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { ProductCategory } from '../types';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';

export const AllProductsView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setCurrentView
  } = useShop();

  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'rating'>('relevance');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const categories: (ProductCategory | 'All')[] = [
    'All',
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

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (p.name?.toLowerCase() || '').includes(q) ||
          (p.brand?.toLowerCase() || '').includes(q) ||
          (p.category?.toLowerCase() || '').includes(q) ||
          (p.description?.toLowerCase() || '').includes(q);
        if (!matches) return false;
      }
      // Max price
      if (p.price > maxPrice) return false;
      // In stock
      if (inStockOnly && !p.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // relevance
    });
  }, [products, selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-stone-500 mb-3 flex items-center gap-1.5">
        <button
          onClick={() => setCurrentView('home')}
          className="hover:text-orange-600 transition-colors"
        >
          Home
        </button>
        <span>/</span>
        <span className="text-stone-800 font-medium">All Products</span>
        {selectedCategory !== 'All' && (
          <>
            <span>/</span>
            <span className="text-orange-600 font-semibold">{selectedCategory}</span>
          </>
        )}
      </nav>

      {/* Header matching Screenshot_20260916-121235 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-orange-600 via-amber-500 to-emerald-700" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h1>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex items-center gap-3">
          <button
            id="open-filter-btn"
            onClick={() => setShowFilterDrawer(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 hover:border-orange-500 transition-colors shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-stone-500" />
            <span>Filters</span>
          </button>

          <span className="text-xs text-stone-500 hidden sm:inline">
            {filteredProducts.length} products
          </span>

          {/* Sort Dropdown matching screenshot */}
          <div className="relative">
            <select
              id="sort-products-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-white border border-stone-300 rounded-xl px-3.5 py-2 pr-8 text-xs sm:text-sm font-semibold text-stone-700 focus:outline-hidden focus:border-orange-500 transition-colors shadow-2xs cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Horizontal Category Scroll Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search tag active pill */}
      {searchQuery && (
        <div className="flex items-center gap-2 mb-4 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl w-fit text-xs text-orange-900">
          <span>Search result for: <strong>"{searchQuery}"</strong></span>
          <button
            onClick={() => setSearchQuery('')}
            className="p-0.5 hover:bg-orange-200 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-stone-50 rounded-3xl border border-dashed border-stone-300">
          <p className="text-base font-semibold text-stone-700">No products found</p>
          <p className="text-xs text-stone-500 mt-1">
            Try adjusting your search keywords or category filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setMaxPrice(3000);
            }}
            className="mt-4 px-5 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl hover:bg-orange-700 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Filter Modal / Drawer */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-lg text-stone-900">Filter Catalogue</h3>
              </div>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
                <span>Max Price</span>
                <span className="text-orange-600 font-bold">BDT {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>BDT 100</span>
                <span>BDT 3,000+</span>
              </div>
            </div>

            {/* In Stock Only */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded-sm text-orange-600 focus:ring-orange-500 border-stone-300"
              />
              <span className="text-sm font-medium text-stone-700">In Stock Products Only</span>
            </label>

            {/* Category list */}
            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                Category
              </label>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedCategory === cat
                        ? 'bg-orange-50 text-orange-600 font-bold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setMaxPrice(3000);
                  setInStockOnly(false);
                }}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
