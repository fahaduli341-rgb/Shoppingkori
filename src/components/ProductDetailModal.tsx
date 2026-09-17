import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Heart, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, ShoppingCart, Zap, Share2 } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    addToCart,
    isInWishlist,
    toggleWishlist,
    setCurrentView
  } = useShop();

  const [quantity, setQuantity] = useState(1);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const wishlisted = isInWishlist(product.id);

  const discount = product.discountPercent || (product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setActiveProductModal(null);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setActiveProductModal(null);
    setCurrentView('cart');
  };

  const handleShareWhatsApp = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = encodeURIComponent(
      `🛍️ *${product.name}*\n` +
      `💰 মূল্য: ৳${product.price.toLocaleString()}\n` +
      `${product.originalPrice ? `🏷️ আগের মূল্য: ৳${product.originalPrice.toLocaleString()}\n` : ''}` +
      `🚚 ক্যাশ অন ডেলিভারিতে সারাদেশে ডেলিভারি!\n\n` +
      `🛒 অর্ডার করতে ভিজিট করুন:\n${origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-3 border-b border-stone-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            {product.category}
          </span>
          <button
            onClick={() => setActiveProductModal(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Image Box */}
            <div className="relative bg-stone-50 rounded-2xl p-6 aspect-square flex items-center justify-center border border-stone-100">
              {discount > 0 && (
                <span className="absolute top-3 left-3 px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded-lg shadow-xs">
                  -{discount}% OFF
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-xs border border-stone-200 text-stone-600 hover:text-red-500 transition-colors"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            </div>

            {/* Right Information */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
                {product.brand}
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-snug">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
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
                <span className="text-xs text-stone-500 font-medium">
                  {product.rating} ({product.reviewCount} customer reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl font-black text-orange-600">
                  BDT {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    BDT {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="text-xs text-stone-600 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span>{product.inStock ? `In Stock (${product.stock} units available)` : 'Out of Stock'}</span>
                {product.unit && <span className="text-stone-400">• Unit: {product.unit}</span>}
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed pt-1">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs font-bold text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-stone-200 text-stone-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-stone-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-stone-200 text-stone-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Assurance Pills */}
          <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-[11px] text-stone-600 text-center">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Genuine</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Cash on Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
              <span>7 Days Return</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-stone-100 flex items-center gap-2.5 bg-stone-50">
          <button
            id="modal-share-whatsapp-btn"
            onClick={handleShareWhatsApp}
            title="WhatsApp-এ শেয়ার করুন"
            className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline text-xs font-bold">Share</span>
          </button>
          <button
            id="modal-add-to-cart-btn"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-3 sm:px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
          <button
            id="modal-buy-now-btn"
            onClick={handleBuyNow}
            className="flex-1 py-3 px-3 sm:px-4 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-orange-600/20"
          >
            <Zap className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
