import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCategory } from '../types';
import {
  Shirt,
  Smartphone,
  Sparkles,
  Home,
  HeartPulse,
  Zap,
  Dumbbell,
  BookOpen,
  Laptop,
  Sprout,
  Car,
  ArrowRight
} from 'lucide-react';

export const ShopByCategory: React.FC = () => {
  const { setSelectedCategory, setCurrentView } = useShop();

  const categories: { name: ProductCategory; icon: React.FC<{ className?: string }>; color: string }[] = [
    { name: 'Clothes', icon: Shirt, color: 'text-indigo-600 bg-indigo-50/80' },
    { name: 'Electronics', icon: Smartphone, color: 'text-blue-600 bg-blue-50/80' },
    { name: 'Fashion', icon: Sparkles, color: 'text-rose-600 bg-rose-50/80' },
    { name: 'Home & Kitchen', icon: Home, color: 'text-emerald-600 bg-emerald-50/80' },
    { name: 'Health & Beauty', icon: HeartPulse, color: 'text-purple-600 bg-purple-50/80' },
    { name: 'Mobile Recharge', icon: Zap, color: 'text-amber-600 bg-amber-50/80' },
    { name: 'Sports & Outdoor', icon: Dumbbell, color: 'text-teal-600 bg-teal-50/80' },
    { name: 'Books & Stationery', icon: BookOpen, color: 'text-red-600 bg-red-50/80' },
    { name: 'Office & Computer', icon: Laptop, color: 'text-sky-600 bg-sky-50/80' },
    { name: 'Agriculture & Garden', icon: Sprout, color: 'text-lime-700 bg-lime-50/80' },
    { name: 'Auto Parts', icon: Car, color: 'text-slate-700 bg-slate-100' }
  ];

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setCurrentView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-orange-600 via-amber-500 to-emerald-700" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Shop by category
          </h2>
        </div>

        <button
          id="categories-view-all"
          onClick={() => {
            setSelectedCategory('All');
            setCurrentView('products');
          }}
          className="text-xs sm:text-sm font-semibold text-stone-600 hover:text-orange-600 flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Categories Grid (Matching Screenshot_20260916-121154) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.name}
              id={`cat-card-${(cat.name || 'category').toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => handleCategoryClick(cat.name)}
              className="bg-white rounded-2xl border border-stone-200/80 p-3 sm:p-4 flex flex-col items-center text-center justify-center hover:border-orange-300 hover:shadow-sm transition-all group active:scale-95"
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2 sm:mb-3 transition-transform group-hover:scale-110 ${cat.color}`}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
              </div>
              <span className="text-xs font-semibold text-stone-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
