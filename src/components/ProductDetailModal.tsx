import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  Share2,
  Store,
  Check
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    addToCart,
    isInWishlist,
    toggleWishlist,
    setCurrentView,
    language,
    t
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (activeProductModal) {
      setQuantity(1);
      setSelectedSize(activeProductModal.sizes && activeProductModal.sizes.length > 0 ? activeProductModal.sizes[0] : undefined);
      setSelectedColor(activeProductModal.colors && activeProductModal.colors.length > 0 ? activeProductModal.colors[0] : undefined);
    }
  }, [activeProductModal]);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const wishlisted = isInWishlist(product.id);

  const discount = product.discountPercent || (product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setActiveProductModal(null);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setActiveProductModal(null);
    setCurrentView('cart');
  };

  const handleShareWhatsApp = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = encodeURIComponent(
      `🛍️ *${product.name}*\n` +
      `💰 মূল্য: ৳${product.price.toLocaleString()}\n` +
      `${product.originalPrice ? `🏷️ পূর্বের মূল্য: ৳${product.originalPrice.toLocaleString()}\n` : ''}` +
      `🏪 ভেন্ডর: ${product.vendorName || 'Shopping Kori'}\n` +
      `🚚 ক্যাশ অন ডেলিভারিতে সারাদেশে হোম ডেলিভারি!\n\n` +
      `🛒 এখনই অর্ডার করতে লিঙ্কটি ভিজিট করুন:\n${origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-3 border-b border-stone-100 flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {product.category}
            </span>
            {product.subCategory && (
              <span className="text-xs text-stone-400 font-medium">
                / {product.subCategory}
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveProductModal(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image Box */}
            <div className="relative bg-stone-50 rounded-2xl p-6 aspect-square flex items-center justify-center border border-stone-100">
              {discount > 0 && (
                <span className="absolute top-3 left-3 px-2 py-1 bg-[#E85D2C] text-white text-xs font-bold rounded-lg shadow-xs">
                  -{discount}% OFF
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-xs border border-stone-200 text-stone-600 hover:text-red-500 transition-colors cursor-pointer"
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
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E85D2C]">
                  {product.brand}
                </span>
                <span className="inline-flex items-center gap-1 text-[#1F6F4A] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                  <Store className="w-3 h-3" />
                  <span>{product.vendorName || 'Shopping Kori'}</span>
                </span>
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
                  {product.rating} ({product.reviewCount} {language === 'bn' ? 'রিভিউ' : 'reviews'})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-black text-[#E85D2C]">
                  BDT {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    BDT {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status & SKU */}
              <div className="text-xs text-stone-600 flex flex-wrap items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span>{product.inStock ? `In Stock (${product.stock} units)` : 'Out of Stock'}</span>
                {product.sku && <span className="text-stone-400 font-mono">• SKU: {product.sku}</span>}
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-stone-700 block">
                    {language === 'bn' ? 'সাইজ নির্বাচন করুন:' : 'Select Size:'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          selectedSize === s
                            ? 'border-[#E85D2C] bg-orange-50 text-[#E85D2C] shadow-2xs font-bold'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    {language === 'bn' ? 'কালার নির্বাচন করুন:' : 'Select Color:'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          selectedColor === c
                            ? 'border-[#1F6F4A] bg-emerald-50 text-[#1F6F4A] shadow-2xs font-bold'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed pt-1">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs font-bold text-stone-700">
                  {language === 'bn' ? 'পরিমাণ:' : 'Quantity:'}
                </span>
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-stone-200 text-stone-600 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-stone-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-stone-200 text-stone-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Assurance Pills */}
          <div className="grid grid-cols-3 gap-2 bg-[#FDFBF7] p-3 rounded-2xl border border-stone-200 text-[11px] text-stone-700 text-center">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#1F6F4A]" />
              <span>100% Genuine</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#1F6F4A]" />
              <span>Cash on Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-[#1F6F4A]" />
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
            <span className="hidden sm:inline text-xs font-bold">WhatsApp</span>
          </button>
          <button
            id="modal-add-to-cart-btn"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-3 sm:px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t.addToCart}</span>
          </button>
          <button
            id="modal-buy-now-btn"
            onClick={handleBuyNow}
            className="flex-1 py-3 px-3 sm:px-4 bg-[#E85D2C] hover:bg-[#c94b1f] active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#E85D2C]/20"
          >
            <Zap className="w-4 h-4" />
            <span>{t.buyNow}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
