import React from 'react';
import { useShop } from '../context/ShopContext';
import { Home, Package, ShoppingCart, Heart, User } from 'lucide-react';
import { AppView } from '../types';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, cartCount, wishlist, setSelectedCategory } = useShop();

  const navItems: { id: AppView; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home
    },
    {
      id: 'products',
      label: 'All Products',
      icon: Package
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingCart,
      badge: cartCount
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      badge: wishlist.length
    },
    {
      id: 'account',
      label: 'Account',
      icon: User
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => {
                if (item.id === 'products') {
                  setSelectedCategory('All');
                }
                setCurrentView(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] relative transition-colors ${
                isActive ? 'text-orange-600 font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-none whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
