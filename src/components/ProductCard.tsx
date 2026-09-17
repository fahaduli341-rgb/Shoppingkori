import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, Star, ShoppingBag, Store } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInWishlist, toggleWishlist, setActiveProductModal, language, t } = useShop();
  const wishlisted = isInWishlist(product.id);

  const discount = product.discountPercent || (product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0);

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative bg-stone-50/70 p-4 aspect-square flex items-center justify-center overflow-hidden">
        {/* Badges Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <span className="inline-block px-2 py-0.5 bg-[#E85D2C] text-white text-[11px] font-bold rounded-md shadow-xs">
              -{discount}%
            </span>
          )}
          {product.tag === 'NEW' && (
            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-md">
              NEW
            </span>
          )}
          {product.tag === 'BEST SELLER' && (
            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-[#1F6F4A] border border-emerald-200 text-[10px] font-bold rounded-md">
              BEST SELLER
            </span>
          )}
          {product.inFlashSale && (
            <span className="inline-block px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-md shadow-2xs">
              FLASH SALE
            </span>
          )}
        </div>

        {/* Wishlist Button Right */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs shadow-xs border border-stone-200 flex items-center justify-center text-stone-600 hover:text-red-500 hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 ${
              wishlisted ? 'fill-red-500 text-red-500' : 'text-stone-600'
            }`}
          />
        </button>

        {/* Product Image */}
        <div
          onClick={() => setActiveProductModal(product)}
          className="w-full h-full flex items-center justify-center cursor-pointer overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>

      {/* Product Details Bottom */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div
          onClick={() => setActiveProductModal(product)}
          className="cursor-pointer space-y-1"
        >
          {/* Vendor Badge & Brand */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold tracking-wider text-stone-400 uppercase truncate max-w-[100px]">
              {product.brand}
            </span>
            <span className="flex items-center gap-1 text-[#1F6F4A] bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
              <Store className="w-2.5 h-2.5" />
              <span className="truncate max-w-[90px]">{product.vendorName || 'Shopping Kori'}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-stone-800 line-clamp-2 leading-snug group-hover:text-[#E85D2C] transition-colors">
            {product.name}
          </h3>

          {/* Variants hint if applicable */}
          {(product.sizes?.length || product.colors?.length) ? (
            <div className="text-[10px] text-stone-500">
              {product.sizes?.length ? `${product.sizes.length} Sizes` : ''}
              {product.sizes?.length && product.colors?.length ? ' • ' : ''}
              {product.colors?.length ? `${product.colors.length} Colors` : ''}
            </div>
          ) : null}

          {/* Reviews/Stars */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-stone-200 text-stone-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-stone-400 font-medium">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1.5">
            <span className="text-base font-extrabold text-[#E85D2C]">
              BDT {product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                BDT {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="pt-3.5 mt-auto">
          <button
            id={`add-to-cart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
              const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
              addToCart(product, 1, defaultSize, defaultColor);
            }}
            disabled={!product.inStock}
            className="w-full py-2.5 px-4 bg-[#E85D2C] hover:bg-[#c94b1f] active:scale-98 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs shadow-[#E85D2C]/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.inStock ? t.addToCart : (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
