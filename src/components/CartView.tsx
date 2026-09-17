import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Tag,
  Truck,
  CreditCard,
  Smartphone,
  Banknote,
  Check,
  X,
  Copy,
  HelpCircle,
  Building,
  AlertCircle
} from 'lucide-react';
import { BANGLADESH_DIVISIONS } from '../data/initialData';
import { PaymentMethod } from '../types';
import { PaymentInstructionsModal } from './PaymentInstructionsModal';

export const CartView: React.FC = () => {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
    setCurrentView,
    customerUser,
    storeSettings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    language,
    t
  } = useShop();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // Coupon input
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; error: boolean } | null>(null);

  // Form fields
  const [fullName, setFullName] = useState(customerUser?.name || '');
  const [mobileNumber, setMobileNumber] = useState(customerUser?.phone || '');
  const [email, setEmail] = useState(customerUser?.email || '');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka City');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState(customerUser?.phone || '');
  const [showPaymentGuideModal, setShowPaymentGuideModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const insideDhakaFee = typeof storeSettings?.deliveryInsideDhaka === 'number' ? storeSettings.deliveryInsideDhaka : 60;
  const outsideDhakaFee = typeof storeSettings?.deliveryOutsideDhaka === 'number' ? storeSettings.deliveryOutsideDhaka : 120;
  
  // Free Shipping Threshold logic
  const isFreeShippingEligible = storeSettings.enableFreeShipping && cartTotal >= (storeSettings.freeShippingThreshold || 1500);
  const baseShippingCost = deliveryZone === 'Inside Dhaka' ? insideDhakaFee : outsideDhakaFee;
  const shippingCost = isFreeShippingEligible ? 0 : baseShippingCost;

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, cartTotal - discountAmount) + shippingCost;

  const currentDivisionObj = BANGLADESH_DIVISIONS.find((d) => d.name === division) || BANGLADESH_DIVISIONS[0];
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponFeedback({ msg: res.message, error: false });
      setCouponInput('');
    } else {
      setCouponFeedback({ msg: res.message, error: true });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন' : 'Please enter your full name');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.trim().length < 11) {
      setErrorMsg(language === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (01XXXXXXXXX)' : 'Please enter a valid 11-digit mobile number');
      return;
    }
    if (!address.trim()) {
      setErrorMsg(language === 'bn' ? 'বিস্তারিত ডেলিভারি ঠিকানা লিখুন' : 'Please enter your detailed delivery address');
      return;
    }

    setErrorMsg('');
    setIsSubmittingOrder(true);
    try {
      const orderNotesText = [
        notes.trim(),
        paymentMethod !== 'Cash on Delivery' && trxId ? `TrxID: ${trxId.trim()}` : '',
        paymentMethod !== 'Cash on Delivery' && senderPhone ? `Sender: ${senderPhone.trim()}` : ''
      ].filter(Boolean).join(' | ');

      const newOrder = await createOrder({
        customerName: fullName.trim(),
        phone: mobileNumber.trim(),
        email: email.trim() || undefined,
        division,
        district,
        address: address.trim(),
        notes: orderNotesText || undefined,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Unpaid' : 'Paid',
        trxId: trxId.trim() || undefined,
        senderPhone: senderPhone.trim() || undefined,
        deliveryZone,
        shippingCost,
        subtotal: cartTotal,
        discountAmount: discountAmount || undefined,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        totalAmount: grandTotal,
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          vendorName: item.product.vendorName
        })),
        estimatedDelivery: deliveryZone === 'Inside Dhaka' ? '24 - 48 Hours' : '2 - 4 Business Days'
      });

      setPlacedOrder(newOrder);
      setIsCheckoutOpen(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to place order. Please check your connection.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // If order was just placed, show confirmation screen
  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-stone-900">
              {language === 'bn' ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order Placed Successfully!'}
            </h2>
            <p className="text-stone-600 text-sm">
              {language === 'bn'
                ? `ধন্যবাদ ${placedOrder.customerName}, আপনার অর্ডারটি নিশ্চিত করা হয়েছে।`
                : `Thank you, ${placedOrder.customerName}! Your order has been registered.`}
            </p>
            <div className="inline-block px-4 py-2 bg-stone-100 rounded-xl text-stone-800 font-mono font-bold text-sm">
              Order ID: #{placedOrder.id}
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-left text-xs sm:text-sm space-y-2 text-emerald-950">
            <div className="flex justify-between">
              <span className="text-emerald-800">পেমেন্ট মেথড:</span>
              <span className="font-bold">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-800">মোট প্রদেয় মূল্য:</span>
              <span className="font-extrabold text-[#E85D2C]">BDT {placedOrder.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-800">ডেলিভারি ঠিকানা:</span>
              <span className="font-medium">{placedOrder.address}, {placedOrder.district}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-800">প্রত্যাশিত ডেলিভারি:</span>
              <span className="font-semibold text-[#1F6F4A]">{placedOrder.estimatedDelivery}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setPlacedOrder(null);
                setCurrentView('tracking');
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#1F6F4A] hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
            >
              {language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order Status'}
            </button>
            <button
              onClick={() => {
                setPlacedOrder(null);
                setCurrentView('products');
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
            >
              {language === 'bn' ? 'আরও কেনাকাটা করুন' : 'Continue Shopping'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-stone-100 text-stone-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900 mb-2">
          {language === 'bn' ? 'আপনার কার্ট খালি' : 'Your Cart is Empty'}
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          {language === 'bn'
            ? 'আপনার পছন্দের পণ্য কার্টে যোগ করে সহজে ঘরে বসে অর্ডার করুন।'
            : 'Explore our wide catalogue and add items to your cart.'}
        </p>
        <button
          onClick={() => setCurrentView('products')}
          className="px-6 py-3 bg-[#E85D2C] hover:bg-[#c94b1f] text-white font-bold text-sm rounded-xl shadow-md shadow-[#E85D2C]/20 transition-all cursor-pointer"
        >
          {t.products}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('products')}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-extrabold text-stone-900">
            {t.cart} <span className="text-stone-400 text-base font-normal">({cart.length} items)</span>
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'কার্ট খালি করুন' : 'Clear Cart'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`}
              className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs flex items-center gap-4 transition-all hover:border-stone-300"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-xl bg-stone-100 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-bold text-[#1F6F4A] bg-emerald-50 px-2 py-0.5 rounded">
                    {item.product.vendorName || 'Shopping Kori'}
                  </span>
                  {item.product.sku && (
                    <span className="text-[10px] text-stone-400 font-mono">
                      SKU: {item.product.sku}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-stone-900 truncate">
                  {item.product.name}
                </h3>

                {/* Selected Variants */}
                {(item.selectedSize || item.selectedColor) && (
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    {item.selectedSize && <span>Size: <strong className="text-stone-800">{item.selectedSize}</strong></span>}
                    {item.selectedColor && <span>Color: <strong className="text-stone-800">{item.selectedColor}</strong></span>}
                  </div>
                )}

                <div className="text-sm font-extrabold text-[#E85D2C] mt-1">
                  BDT {item.product.price.toLocaleString()}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-stone-400 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Item Subtotal */}
              <div className="text-right hidden sm:block">
                <span className="text-xs text-stone-400">{t.subtotal}</span>
                <div className="text-base font-extrabold text-stone-900">
                  BDT {(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs sticky top-24 space-y-5">
            <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              {language === 'bn' ? 'অর্ডার সারসংক্ষেপ' : 'Order Summary'}
            </h2>

            {/* Free Shipping Alert if active */}
            {isFreeShippingEligible ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">
                  {language === 'bn' ? 'অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন।' : 'Congrats! Free Delivery has been applied.'}
                </span>
              </div>
            ) : storeSettings.enableFreeShipping && (
              <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                {language === 'bn'
                  ? `আর মাত্র ৳${((storeSettings.freeShippingThreshold || 1500) - cartTotal).toLocaleString()} টাকার কেনাকাটায় ফ্রি ডেলিভারি!`
                  : `Add BDT ${((storeSettings.freeShippingThreshold || 1500) - cartTotal).toLocaleString()} more for Free Delivery!`}
              </div>
            )}

            {/* Delivery Zone Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">
                {t.deliveryZone}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryZone('Inside Dhaka')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    deliveryZone === 'Inside Dhaka'
                      ? 'border-[#E85D2C] bg-orange-50/70 text-[#E85D2C] font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <div>{t.insideDhaka}</div>
                  <div className="font-bold text-[#E85D2C]">
                    {isFreeShippingEligible ? <span className="text-emerald-600">FREE</span> : `BDT ${insideDhakaFee}`}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryZone('Outside Dhaka')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    deliveryZone === 'Outside Dhaka'
                      ? 'border-[#E85D2C] bg-orange-50/70 text-[#E85D2C] font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <div>{t.outsideDhaka}</div>
                  <div className="font-bold text-[#E85D2C]">
                    {isFreeShippingEligible ? <span className="text-emerald-600">FREE</span> : `BDT ${outsideDhakaFee}`}
                  </div>
                </button>
              </div>
            </div>

            {/* Coupon Box */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#E85D2C]" />
                <span>{t.applyCoupon}</span>
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-800">{appliedCoupon.code}</span>
                    <span className="text-emerald-700">(-BDT {appliedCoupon.discount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. BAZAR50, EID100"
                    className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-hidden focus:border-[#E85D2C]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t.apply}
                  </button>
                </form>
              )}

              {couponFeedback && (
                <div className={`text-[11px] ${couponFeedback.error ? 'text-red-600' : 'text-emerald-700'}`}>
                  {couponFeedback.msg}
                </div>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm text-stone-600 border-t border-stone-100 pt-4">
              <div className="flex justify-between">
                <span>{t.subtotal} ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="font-semibold text-stone-800">BDT {cartTotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{t.discount}</span>
                  <span>- BDT {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t.deliveryCharge}</span>
                <span className="font-semibold text-stone-800">
                  {shippingCost === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `BDT ${shippingCost}`}
                </span>
              </div>

              <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-extrabold text-stone-900">
                <span>{t.totalAmount}</span>
                <span className="text-[#E85D2C]">BDT {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              id="proceed-to-checkout-btn"
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-3.5 px-4 bg-[#E85D2C] hover:bg-[#c94b1f] active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-[#E85D2C]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.proceedCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Payment Guide Button */}
            <button
              type="button"
              onClick={() => setShowPaymentGuideModal(true)}
              className="w-full py-2.5 px-3 bg-stone-100 hover:bg-orange-50 text-stone-700 hover:text-[#E85D2C] border border-stone-200/80 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#E85D2C]" />
              <span>{language === 'bn' ? 'বিকাশ/নগদ পেমেন্ট নির্দেশিকা দেখুন' : 'View Payment Guide (bKash/Nagad)'}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#1F6F4A]" />
              <span>{t.cashOnDelivery} | {t.fastDelivery}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Drawer / Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-stone-900">
                  {language === 'bn' ? 'ডেলিভারি তথ্য ও পেমেন্ট' : 'Complete Delivery & Payment'}
                </h3>
                <p className="text-xs text-stone-500">{storeSettings.tagline || 'ঘরে বসে, বাজার করি'}</p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.customerName} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed / তানভীর আহমেদ"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-[#E85D2C]"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.mobileNumber} *
                </label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-[#E85D2C]"
                />
                <span className="text-[11px] text-stone-400">
                  {language === 'bn'
                    ? 'কুরিয়ার ডেলিভারি ম্যান এই নম্বরে কল করে পার্সেল পৌঁছে দেবেন।'
                    : 'Our delivery courier will call this number prior to parcel handover.'}
                </span>
              </div>

              {/* Division & District */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    বিভাগ (Division) *
                  </label>
                  <select
                    value={division}
                    onChange={(e) => {
                      const newDiv = e.target.value;
                      setDivision(newDiv);
                      const divObj = BANGLADESH_DIVISIONS.find((d) => d.name === newDiv);
                      if (divObj && divObj.districts.length > 0) {
                        setDistrict(divObj.districts[0]);
                      }
                      if (newDiv === 'Dhaka') {
                        setDeliveryZone('Inside Dhaka');
                      } else {
                        setDeliveryZone('Outside Dhaka');
                      }
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  >
                    {BANGLADESH_DIVISIONS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    জেলা/শহর (District) *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  >
                    {currentDivisionObj.districts.map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.deliveryAddress} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="বাসা নম্বর, রোড নম্বর, এলাকা/থানা, ল্যান্ডমার্ক..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
                />
              </div>

              {/* Special Order Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.orderNotes}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                />
              </div>

              {/* The 6 Payment Methods Requested */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700">
                    {t.paymentMethod} *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPaymentGuideModal(true)}
                    className="text-[11px] font-bold text-[#E85D2C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>কিভাবে পেমেন্ট করবেন?</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Cash on Delivery', label: 'Cash on Delivery', sub: 'হাতে পেয়ে টাকা দিন', icon: Banknote, activeClass: 'border-emerald-600 bg-emerald-50 text-emerald-800' },
                    { id: 'bKash', label: 'bKash (বিকাশ)', sub: 'পার্সোনাল / মার্চেন্ট', icon: Smartphone, activeClass: 'border-[#E2136E] bg-pink-50 text-[#E2136E]' },
                    { id: 'Nagad', label: 'Nagad (নগদ)', sub: 'সহজ পেমেন্ট', icon: Smartphone, activeClass: 'border-[#F7941D] bg-orange-50 text-[#F7941D]' },
                    { id: 'Rocket', label: 'Rocket (রকেট)', sub: 'DBBL পেমেন্ট', icon: Smartphone, activeClass: 'border-[#8C3494] bg-purple-50 text-[#8C3494]' },
                    { id: 'CellFin', label: 'CellFin (সেলফিন)', sub: 'IBBL পেমেন্ট', icon: Smartphone, activeClass: 'border-[#0072BC] bg-sky-50 text-[#0072BC]' },
                    { id: 'Card', label: 'Card (কার্ড)', sub: 'SSLCommerz / ShurjoPay', icon: CreditCard, activeClass: 'border-stone-800 bg-stone-100 text-stone-900' }
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? `${m.activeClass} shadow-xs font-bold ring-1 ring-offset-0`
                            : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <div className="font-bold text-xs truncate">{m.label}</div>
                        </div>
                        <div className="text-[10px] opacity-80 mt-0.5 truncate">{m.sub}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Specific Step-by-Step Payment Box based on selected method */}
                <div className="mt-3">
                  {/* 1. Cash on Delivery */}
                  {paymentMethod === 'Cash on Delivery' && (
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-1.5 text-emerald-950 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span>ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা দিন)</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-emerald-900">
                        কোনো অগ্রিম টাকা দিতে হবে না! ডেলিভারি ম্যান আপনার ঠিকানায় পার্সেল নিয়ে গেলে দেখে-শুনে নিশ্চিত হয়ে সরাসরি নগদ টাকা পরিশোধ করবেন।
                      </p>
                    </div>
                  )}

                  {/* 2. bKash */}
                  {paymentMethod === 'bKash' && (
                    <div className="p-4 bg-pink-50/70 border border-pink-200 rounded-2xl space-y-3 animate-in fade-in duration-150 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-[#E2136E] text-white text-xs font-black flex items-center justify-center">bK</span>
                          <div>
                            <div className="font-bold text-xs text-pink-950">
                              bKash ({storeSettings.bkashType || 'Personal'}) Account
                            </div>
                            <div className="text-[10px] text-pink-700">
                              {storeSettings.bkashType === 'Merchant' ? 'Payment অপশন ব্যবহার করুন' : 'Send Money করুন'}
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-pink-200 text-pink-900 rounded-full text-[10px] font-bold">
                          {storeSettings.bkashType || 'Personal'}
                        </span>
                      </div>

                      {/* Number with 1-click Copy */}
                      <div className="bg-white border border-pink-300 rounded-xl p-2.5 flex items-center justify-between shadow-2xs">
                        <div>
                          <span className="text-[10px] text-pink-700 block font-medium">আমাদের বিকাশ নম্বর:</span>
                          <span className="font-mono font-extrabold text-sm sm:text-base text-pink-950 tracking-wider">
                            {storeSettings.bkashNumber || '01700000000'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(storeSettings.bkashNumber || '01700000000');
                            setCopiedField('bkash');
                            setTimeout(() => setCopiedField(null), 2500);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E2136E] hover:bg-[#c40e5d] text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-xs"
                        >
                          {copiedField === 'bkash' ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>কপি হয়েছে</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>নম্বর কপি করুন</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Step-by-Step Instructions */}
                      <div className="bg-white/80 p-2.5 rounded-xl border border-pink-200/60 text-[11px] space-y-1 text-pink-950 leading-relaxed">
                        <div className="font-bold text-pink-900 mb-1 flex items-center justify-between">
                          <span>বিকাশে যেভাবে টাকা পাঠাবেন:</span>
                          <span className="text-[#E85D2C] font-extrabold">মোট: BDT {grandTotal.toLocaleString()}</span>
                        </div>
                        <p>১. বিকাশ অ্যাপে গিয়ে <strong>{storeSettings.bkashType === 'Merchant' ? 'Make Payment' : 'Send Money'}</strong> সিলেক্ট করুন।</p>
                        <p>২. প্রাপক নম্বরে উপরের কপি করা নম্বরটি পেস্ট করুন এবং টাকার পরিমাণ <strong>BDT {grandTotal.toLocaleString()}</strong> লিখুন।</p>
                        <p>৩. পিন দিয়ে টাকা পাঠিয়ে যে <strong>TrxID</strong> পাবেন, সেটি এবং আপনার ব্যবহৃত বিকাশ নম্বরটি নিচে লিখে দিন।</p>
                      </div>

                      {/* Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            আপনার বিকাশ নম্বর (যে নম্বর থেকে পাঠিয়েছেন) *
                          </label>
                          <input
                            type="tel"
                            value={senderPhone}
                            onChange={(e) => setSenderPhone(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full bg-white border border-pink-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#E2136E]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            TrxID / ট্রানজেকশন কোড *
                          </label>
                          <input
                            type="text"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            placeholder="e.g. 9J28DA10K"
                            className="w-full bg-white border border-pink-300 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-hidden focus:border-[#E2136E]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Nagad */}
                  {paymentMethod === 'Nagad' && (
                    <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-3 animate-in fade-in duration-150 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-[#F7941D] text-white text-xs font-black flex items-center justify-center">নগদ</span>
                          <div>
                            <div className="font-bold text-xs text-orange-950">
                              Nagad ({storeSettings.nagadType || 'Personal'}) Account
                            </div>
                            <div className="text-[10px] text-orange-700">
                              {storeSettings.nagadType === 'Merchant' ? 'Merchant Pay করুন' : 'Send Money করুন'}
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-orange-200 text-orange-900 rounded-full text-[10px] font-bold">
                          {storeSettings.nagadType || 'Personal'}
                        </span>
                      </div>

                      <div className="bg-white border border-orange-300 rounded-xl p-2.5 flex items-center justify-between shadow-2xs">
                        <div>
                          <span className="text-[10px] text-orange-700 block font-medium">আমাদের নগদ নম্বর:</span>
                          <span className="font-mono font-extrabold text-sm sm:text-base text-orange-950 tracking-wider">
                            {storeSettings.nagadNumber || '01800000000'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(storeSettings.nagadNumber || '01800000000');
                            setCopiedField('nagad');
                            setTimeout(() => setCopiedField(null), 2500);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7941D] hover:bg-[#df7d09] text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-xs"
                        >
                          {copiedField === 'nagad' ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>কপি হয়েছে</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>নম্বর কপি করুন</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-white/80 p-2.5 rounded-xl border border-orange-200/60 text-[11px] space-y-1 text-orange-950 leading-relaxed">
                        <div className="font-bold text-orange-900 mb-1 flex items-center justify-between">
                          <span>নগদে যেভাবে টাকা পাঠাবেন:</span>
                          <span className="text-[#E85D2C] font-extrabold">মোট: BDT {grandTotal.toLocaleString()}</span>
                        </div>
                        <p>১. নগদ অ্যাপ বা *167# ডায়াল করে <strong>Send Money</strong> বেছে নিন।</p>
                        <p>২. প্রাপক নম্বরে এই নম্বর দিন এবং <strong>BDT {grandTotal.toLocaleString()}</strong> টাকা পাঠিয়ে দিন।</p>
                        <p>৩. প্রাপ্ত <strong>Transaction ID (TrxID)</strong> এবং আপনার নগদ নম্বর নিচে দিয়ে অর্ডার সম্পন্ন করুন।</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            আপনার নগদ নম্বর (Sender Number) *
                          </label>
                          <input
                            type="tel"
                            value={senderPhone}
                            onChange={(e) => setSenderPhone(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full bg-white border border-orange-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#F7941D]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            TrxID / ট্রানজেকশন কোড *
                          </label>
                          <input
                            type="text"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            placeholder="e.g. 7HB8DA20K"
                            className="w-full bg-white border border-orange-300 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-hidden focus:border-[#F7941D]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Rocket */}
                  {paymentMethod === 'Rocket' && (
                    <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3 animate-in fade-in duration-150 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-[#8C3494] text-white text-xs font-black flex items-center justify-center">DB</span>
                          <div>
                            <div className="font-bold text-xs text-purple-950">Rocket (DBBL) Account</div>
                            <div className="text-[10px] text-purple-700">১২ ডিজিট রকেট নম্বর</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-purple-200 text-purple-900 rounded-full text-[10px] font-bold">
                          12-Digit
                        </span>
                      </div>

                      <div className="bg-white border border-purple-300 rounded-xl p-2.5 flex items-center justify-between shadow-2xs">
                        <div>
                          <span className="text-[10px] text-purple-700 block font-medium">আমাদের রকেট নম্বর:</span>
                          <span className="font-mono font-extrabold text-sm sm:text-base text-purple-950 tracking-wider">
                            {storeSettings.rocketNumber || '01900000000'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(storeSettings.rocketNumber || '01900000000');
                            setCopiedField('rocket');
                            setTimeout(() => setCopiedField(null), 2500);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8C3494] hover:bg-[#722779] text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-xs"
                        >
                          {copiedField === 'rocket' ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>কপি হয়েছে</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>নম্বর কপি করুন</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            আপনার রকেট নম্বর *
                          </label>
                          <input
                            type="tel"
                            value={senderPhone}
                            onChange={(e) => setSenderPhone(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#8C3494]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            TrxID / ট্রানজেকশন আইডি *
                          </label>
                          <input
                            type="text"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            placeholder="e.g. 5K98PA21"
                            className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-hidden focus:border-[#8C3494]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. CellFin / Bank */}
                  {paymentMethod === 'CellFin' && (
                    <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-3 animate-in fade-in duration-150 text-xs">
                      <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-[#0072BC]" />
                        <div>
                          <div className="font-bold text-xs text-sky-950">CellFin (IBBL) & Bank Transfer</div>
                          <div className="text-[10px] text-sky-700">ব্যাংক ট্রান্সফার বা সেলফিন আইডি পেমেন্ট</div>
                        </div>
                      </div>

                      <div className="bg-white border border-sky-300 rounded-xl p-3 text-xs space-y-1.5 font-mono text-sky-950">
                        <p className="font-bold text-stone-900">ব্যাংক হিসাব বিবরণ:</p>
                        <p className="text-[11px]">{storeSettings.bankDetails || 'Islami Bank Bangladesh Ltd, A/C: 2050XXXXXXXXXX, Branch: Dhaka'}</p>
                        <p className="text-[11px] pt-1">CellFin নম্বর: <strong>{storeSettings.cellfinNumber || '01700000000'}</strong></p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            প্রেরক একাউন্ট / সেলফিন নম্বর *
                          </label>
                          <input
                            type="text"
                            value={senderPhone}
                            onChange={(e) => setSenderPhone(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#0072BC]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            TrxID / রেফারেন্স কোড *
                          </label>
                          <input
                            type="text"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            placeholder="e.g. IBBL-839201"
                            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-hidden focus:border-[#0072BC]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. Card */}
                  {paymentMethod === 'Card' && (
                    <div className="p-4 bg-stone-100 border border-stone-200 rounded-2xl space-y-1.5 text-xs text-stone-700 animate-in fade-in duration-150">
                      <div className="font-bold text-stone-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-stone-700" />
                        <span>অনলাইন কার্ড পেমেন্ট (Visa / MasterCard / Amex)</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        নিরাপদ ব্যাংক গেটওয়ে দিয়ে পেমেন্ট সম্পূর্ণ হবে। অর্ডার কনফার্ম করার পর আপনাকে SSLCommerz সুরক্ষিত পেমেন্ট পেজে নিয়ে যাওয়া হবে।
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Payable Summary */}
              <div className="bg-[#FDFBF7] rounded-2xl p-4 border border-stone-200 text-xs sm:text-sm space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>{t.subtotal}:</span>
                  <span>BDT {cartTotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>{t.discount}:</span>
                    <span>- BDT {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>{t.deliveryCharge} ({deliveryZone}):</span>
                  <span>{shippingCost === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `BDT ${shippingCost}`}</span>
                </div>
                <div className="flex justify-between font-extrabold text-stone-900 border-t border-stone-200 pt-2 text-base">
                  <span>{t.totalAmount}:</span>
                  <span className="text-[#E85D2C]">BDT {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  {language === 'bn' ? 'ফিরে যান' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  id="confirm-place-order-btn"
                  disabled={isSubmittingOrder}
                  className="flex-1 py-3 bg-[#E85D2C] hover:bg-[#c94b1f] disabled:opacity-60 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-[#E85D2C]/20 cursor-pointer"
                >
                  {isSubmittingOrder ? (language === 'bn' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Placing Order...') : t.placeOrder}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Instructions Modal */}
      <PaymentInstructionsModal
        isOpen={showPaymentGuideModal}
        onClose={() => setShowPaymentGuideModal(false)}
        defaultMethod={paymentMethod}
        orderAmount={grandTotal}
      />
    </div>
  );
};
