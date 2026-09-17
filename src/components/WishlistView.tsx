import React from 'react';
import { useShop } from '../context/ShopContext';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart, setCurrentView, setActiveProductModal } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  // Empty state matching Screenshot_20260916-121243
  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight text-left mb-8">
          Wishlist
        </h1>

        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-14 shadow-2xs max-w-md mx-auto flex flex-col items-center">
          {/* Large Heart Outline matching Screenshot_20260916-121243 */}
          <div className="w-16 h-16 flex items-center justify-center text-stone-600 mb-4">
            <Heart className="w-12 h-12 stroke-[1.4]" />
          </div>

          <h2 className="text-xl font-extrabold text-stone-800 tracking-tight">
            Wishlist
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xs leading-relaxed">
            Browse our products and add something you like.
          </p>

          <button
            id="wishlist-start-shopping"
            onClick={() => setCurrentView('products')}
            className="mt-6 px-8 py-3 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            Start shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Wishlist ({wishlistedProducts.length})
        </h1>
        <button
          onClick={() => setCurrentView('products')}
          className="text-xs font-semibold text-orange-600 hover:underline"
        >
          Explore More Products
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {wishlistedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div
              onClick={() => setActiveProductModal(product)}
              className="relative bg-stone-50 p-4 aspect-square flex items-center justify-center cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className="absolute top-2.5 right-2.5 p-1.5 bg-white rounded-full shadow-xs text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase">
                  {product.brand}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-stone-800 line-clamp-2 mt-0.5">
                  {product.name}
                </h3>
                <div className="text-sm font-extrabold text-orange-600 mt-2">
                  BDT {product.price.toLocaleString()}
                </div>
              </div>

              <div className="pt-3 mt-auto">
                <button
                  onClick={() => addToCart(product, 1)}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
