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
  AlertCircle,
  User,
  Lock,
  Phone,
  MapPin,
  ChevronRight
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
    registerCustomerAccount,
    loginCustomerAccount,
    storeSettings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    language,
    showToast,
    t
  } = useShop();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showAuthGateModal, setShowAuthGateModal] = useState(false);
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register');
  const [deliveryZone, setDeliveryZone] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // Customer Auth Gate form state
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authAddress, setAuthAddress] = useState('');
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authLoginPass, setAuthLoginPass] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Coupon input
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; error: boolean } | null>(null);

  // Checkout Form fields
  const [fullName, setFullName] = useState(customerUser?.name || '');
  const [mobileNumber, setMobileNumber] = useState(customerUser?.phone || '');
  const [email, setEmail] = useState(customerUser?.email || '');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka City');
  const [address, setAddress] = useState(customerUser?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState(customerUser?.phone || '');
  const [showPaymentGuideModal, setShowPaymentGuideModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const insideDhakaFee = typeof storeSettings?.deliveryInsideDhaka === 'number' ? storeSettings.deliveryInsideDhaka : 60;
  const outsideDhakaFee = typeof storeSettings?.deliveryOutsideDhaka === 'number' ? storeSettings.deliveryOutsideDhaka : 120;
  
  // Free Shipping Threshold logic
  const isFreeShippingEligible = storeSettings.enableFreeShipping && cartTotal >= (storeSettings.freeShippingThreshold || 1500);
  const baseShippingCost = deliveryZone === 'Inside Dhaka' ? insideDhakaFee : outsideDhakaFee;
  const shippingCost = isFreeShippingEligible ? 0 : baseShippingCost;

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, cartTotal - discountAmount) + shippingCost;

  const currentDivisionObj = BANGLADESH_DIVISIONS.find((d) => d.name === division) || BANGLADESH_DIVISIONS[0];

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

  // Click "Proceed to Checkout" handler
  const handleProceedToCheckout = () => {
    if (!customerUser) {
      setShowAuthGateModal(true);
      return;
    }
    // Pre-fill user profile if empty
    if (!fullName && customerUser.name) setFullName(customerUser.name);
    if (!mobileNumber && customerUser.phone) setMobileNumber(customerUser.phone);
    if (!senderPhone && customerUser.phone) setSenderPhone(customerUser.phone);
    if (!address && customerUser.address) setAddress(customerUser.address);
    setIsCheckoutOpen(true);
  };

  // Auth Gate registration
  const handleAuthGateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim() || !authPhone.trim() || !authPassword) {
      showToast(language === 'bn' ? 'সবগুলো আবশ্যক তথ্য পূরণ করুন' : 'Please fill all required fields', 'error');
      return;
    }
    if (authPhone.trim().length < 11) {
      showToast(language === 'bn' ? '১১ ডিজিটের সঠিক মোবাইল নম্বর দিন' : 'Please enter valid 11-digit phone number', 'error');
      return;
    }
    if (authPassword.length < 4) {
      showToast(language === 'bn' ? 'পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে' : 'Password must be at least 4 chars', 'error');
      return;
    }

    setIsSubmittingAuth(true);
    const res = await registerCustomerAccount({
      name: authName.trim(),
      phone: authPhone.trim(),
      email: authEmail.trim() || undefined,
      password: authPassword,
      address: authAddress.trim() || undefined
    });
    setIsSubmittingAuth(false);

    if (res.success) {
      setFullName(authName.trim());
      setMobileNumber(authPhone.trim());
      setSenderPhone(authPhone.trim());
      if (authAddress.trim()) setAddress(authAddress.trim());
      setShowAuthGateModal(false);
      setIsCheckoutOpen(true);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Auth Gate login
  const handleAuthGateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authIdentifier.trim() || !authLoginPass) {
      showToast(language === 'bn' ? 'মোবাইল নম্বর ও পাসওয়ার্ড দিন' : 'Please provide mobile number and password', 'error');
      return;
    }

    setIsSubmittingAuth(true);
    const res = await loginCustomerAccount(authIdentifier.trim(), authLoginPass);
    setIsSubmittingAuth(false);

    if (res.success) {
      setShowAuthGateModal(false);
      setIsCheckoutOpen(true);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerUser) {
      setShowAuthGateModal(true);
      setErrorMsg(language === 'bn' ? 'অর্ডার করতে অনুগ্রহ করে একাউন্ট তৈরি করুন অথবা লগইন করুন' : 'Please sign in or create an account to place your order');
      return;
    }

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

    // Require TrxID if non-COD
    if (paymentMethod !== 'Cash on Delivery' && paymentMethod !== 'Card' && !trxId.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে পেমেন্ট করার পর ট্রানজেকশন আইডি (TrxID) দিন' : 'Please provide your payment Transaction ID (TrxID)');
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
        email: email.trim() || customerUser.email || undefined,
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
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {language === 'bn' ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order Placed Successfully!'}
            </h2>
            <p className="text-stone-600 text-sm">
              {language === 'bn'
                ? `ধন্যবাদ ${placedOrder.customerName}, আপনার অর্ডারটি রিসিভ করা হয়েছে এবং শিঘ্রই কনফার্ম করা হবে।`
                : `Thank you, ${placedOrder.customerName}! Your order has been placed and will be confirmed shortly.`}
            </p>
            <div className="inline-block px-4 py-2 bg-stone-100 rounded-xl text-stone-800 font-mono font-bold text-sm border border-stone-200">
              Order ID: #{placedOrder.id}
            </div>
          </div>

          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-left text-xs sm:text-sm space-y-2 text-emerald-950">
            <div className="flex justify-between">
              <span className="text-emerald-800">পেমেন্ট মাধ্যম:</span>
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

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setPlacedOrder(null);
                setCurrentView('account');
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#E85D2C] hover:bg-[#c94b1f] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#E85D2C]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>{language === 'bn' ? 'লাইভ পার্সেল ট্র্যাকিং দেখুন' : 'View Live Order Tracking'}</span>
            </button>
            <button
              onClick={() => {
                setPlacedOrder(null);
                setCurrentView('products');
              }}
              className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
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
          className="px-6 py-3 bg-[#E85D2C] hover:bg-[#c94b1f] text-white text-sm font-bold rounded-xl shadow-md shadow-[#E85D2C]/20 transition-all cursor-pointer"
        >
          {language === 'bn' ? 'পণ্যসমূহ দেখুন' : 'Browse Products'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('products')}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {language === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'} ({cart.length})
            </h1>
            <p className="text-xs text-stone-500">
              {storeSettings.tagline || 'ঘরে বসে, বাজার করি'}
            </p>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
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
              key={`${item.product.id}-${item.selectedSize || 'default'}-${item.selectedColor || 'default'}`}
              className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl bg-stone-50 border border-stone-100 p-1 shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 truncate">
                    {item.product.name}
                  </h3>
                  <div className="text-xs text-stone-500 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-stone-700">BDT {item.product.price.toLocaleString()}</span>
                    {item.selectedSize && (
                      <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-bold text-stone-600">
                        Size: {item.selectedSize}
                      </span>
                    )}
                    {item.selectedColor && (
                      <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-bold text-stone-600">
                        Color: {item.selectedColor}
                      </span>
                    )}
                    {item.product.vendorName && (
                      <span className="text-[10px] text-stone-400">
                        by {item.product.vendorName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
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
                  className="p-2 text-stone-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm sticky top-24 space-y-5">
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
                      ? 'border-[#E85D2C] bg-orange-50/70 text-[#E85D2C] font-bold ring-1 ring-[#E85D2C]'
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
                      ? 'border-[#E85D2C] bg-orange-50/70 text-[#E85D2C] font-bold ring-1 ring-[#E85D2C]'
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
            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs sm:text-sm text-stone-600">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
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

            {/* Customer Status badge if logged in */}
            {customerUser ? (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-bold text-emerald-900 truncate max-w-[150px]">{customerUser.name}</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">Account Verified</span>
              </div>
            ) : (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>অর্ডার সম্পন্ন করতে একাউন্ট তৈরি বা লগইন করতে হবে।</span>
              </div>
            )}

            {/* Proceed to Checkout button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 bg-[#E85D2C] hover:bg-[#c94b1f] active:scale-98 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#E85D2C]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{customerUser ? t.proceedCheckout : (language === 'bn' ? 'লগইন করে অর্ডার সম্পন্ন করুন' : 'Login & Proceed to Checkout')}</span>
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

      {/* ========================================================= */}
      {/* 1. CUSTOMER AUTH GATE MODAL (Force Login/Register for Orders) */}
      {/* ========================================================= */}
      {showAuthGateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-stone-900">
                  {authTab === 'register'
                    ? (language === 'bn' ? 'অর্ডার করতে একাউন্ট খুলুন' : 'Create Account to Order')
                    : (language === 'bn' ? 'কাস্টমার লগইন করুন' : 'Customer Sign In')}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === 'bn' ? 'লাইভ পার্সেল ট্র্যাকিং ও দ্রুত চেকআউটের জন্য' : 'For live parcel tracking & secure order placement'}
                </p>
              </div>
              <button
                onClick={() => setShowAuthGateModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Auth Switcher */}
            <div className="flex p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authTab === 'register' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {language === 'bn' ? 'নতুন একাউন্ট (Register)' : 'New Account'}
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authTab === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {language === 'bn' ? 'লগইন করুন (Log In)' : 'Log In'}
              </button>
            </div>

            {/* Registration Form */}
            {authTab === 'register' ? (
              <form onSubmit={handleAuthGateRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. তানভীর আহমেদ / Tanvir Ahmed"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'bn' ? '১১ ডিজিটের মোবাইল নম্বর *' : '11-Digit Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'bn' ? 'ডেলিভারি ঠিকানা (ঐচ্ছিক)' : 'Delivery Address (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={authAddress}
                    onChange={(e) => setAuthAddress(e.target.value)}
                    placeholder="বাসা নম্বর, রোড, এলাকা..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'bn' ? 'পাসওয়ার্ড তৈরি করুন *' : 'Create Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="ন্যূনতম ৪ ডিজিট"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-3 bg-[#E85D2C] hover:bg-[#c94b1f] active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-md shadow-[#E85D2C]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAuth ? 'প্রসেসিং...' : (language === 'bn' ? 'একাউন্ট তৈরি করে এগিয়ে যান' : 'Register & Continue')}
                </button>
              </form>
            ) : (
              /* Login Form */
              <form onSubmit={handleAuthGateLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর বা ইমেইল *' : 'Mobile Number or Email *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={authIdentifier}
                    onChange={(e) => setAuthIdentifier(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'bn' ? 'পাসওয়ার্ড *' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    value={authLoginPass}
                    onChange={(e) => setAuthLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-3 bg-[#E85D2C] hover:bg-[#c94b1f] active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-md shadow-[#E85D2C]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAuth ? 'লগইন হচ্ছে...' : (language === 'bn' ? 'লগইন করে চেকআউট করুন' : 'Sign In & Checkout')}
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-stone-100 text-center text-[11px] text-stone-500">
              নিরাপদ এনক্রিপ্টেড চেকআউট • {storeSettings.storeName}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. DARAZ-STYLE MODERN CHECKOUT MODAL                     */}
      {/* ========================================================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto space-y-5 border border-stone-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg sm:text-xl text-stone-900">
                    {language === 'bn' ? 'অর্ডার কনফার্মেশন ও পেমেন্ট' : 'Complete Delivery & Payment'}
                  </h3>
                  <span className="px-2 py-0.5 bg-orange-100 text-[#E85D2C] rounded-full text-[10px] font-black uppercase tracking-wider">
                    Daraz Standard
                  </span>
                </div>
                <p className="text-xs text-stone-500">{storeSettings.tagline || 'ঘরে বসে, বাজার করি'}</p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Logged in customer badge */}
            {customerUser && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {(customerUser.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-emerald-950">{customerUser.name}</span>
                    <span className="text-emerald-700 text-[11px] ml-2 font-mono">({customerUser.phone})</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  লাইভ ট্র্যাকিং সক্রিয়
                </span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-5">
              {/* Delivery Destination Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E85D2C]" />
                  <span>{language === 'bn' ? 'ডেলিভারি ঠিকানা ও যোগাযোগের তথ্য' : 'Delivery Address & Contact'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#E85D2C]"
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
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#E85D2C]"
                    />
                  </div>
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
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
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
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#E85D2C]"
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
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                {/* Special Order Notes */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.orderNotes} (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>
              </div>

              {/* ======================================================== */}
              {/* DARAZ PAYMENT SYSTEM - MODERN ACCORDION / RADIO CARDS */}
              {/* ======================================================== */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#E85D2C]" />
                    <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
                      {language === 'bn' ? 'পেমেন্ট মাধ্যম বেছে নিন' : 'Select Payment Method'}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPaymentGuideModal(true)}
                    className="text-[11px] font-bold text-[#E85D2C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>কিভাবে পেমেন্ট করবেন?</span>
                  </button>
                </div>

                {/* Payment Option Cards */}
                <div className="space-y-2.5">
                  {/* 1. CASH ON DELIVERY */}
                  <div
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`rounded-2xl border-2 p-3.5 transition-all cursor-pointer ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === 'Cash on Delivery'
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {paymentMethod === 'Cash on Delivery' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs sm:text-sm text-stone-900">
                            Cash on Delivery (ক্যাশ অন ডেলিভারি)
                          </div>
                          <div className="text-[11px] text-stone-500">
                            পণ্য হাতে পেয়ে দেখে টাকা দিন (কোনো অগ্রিম ফি নেই)
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded-full text-[10px] font-extrabold">
                        জনপ্রিয় (0% Fee)
                      </span>
                    </div>

                    {paymentMethod === 'Cash on Delivery' && (
                      <div className="mt-3 pt-3 border-t border-emerald-200/80 text-xs text-emerald-900 space-y-1.5 animate-in fade-in duration-150">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>কোনো প্রকার অগ্রিম টাকা দিতে হবে না।</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>কুরিয়ার ডেলিভারি ম্যানের সামনে পার্সেল বুঝে পেয়ে টাকা পরিশোধ করুন।</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. BKASH */}
                  <div
                    onClick={() => setPaymentMethod('bKash')}
                    className={`rounded-2xl border-2 p-3.5 transition-all cursor-pointer ${
                      paymentMethod === 'bKash'
                        ? 'border-[#E2136E] bg-pink-50/60 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === 'bKash'
                              ? 'border-[#E2136E] bg-[#E2136E] text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {paymentMethod === 'bKash' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-[#E2136E] text-white font-black text-xs flex items-center justify-center shrink-0">
                          bK
                        </div>
                        <div>
                          <div className="font-extrabold text-xs sm:text-sm text-stone-900">
                            bKash Online Payment (বিকাশ)
                          </div>
                          <div className="text-[11px] text-stone-500">
                            মোবাইল থেকে তাৎক্ষণিক বিকাশ পেমেন্ট
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-pink-200 text-pink-900 rounded-full text-[10px] font-extrabold">
                        {storeSettings.bkashType || 'Personal'}
                      </span>
                    </div>

                    {paymentMethod === 'bKash' && (
                      <div className="mt-3 pt-3 border-t border-pink-200 space-y-3 animate-in fade-in duration-150">
                        {/* Copyable Box */}
                        <div className="bg-white border border-pink-300 rounded-xl p-3 flex items-center justify-between shadow-2xs">
                          <div>
                            <span className="text-[10px] text-pink-700 block font-bold uppercase">আমাদের বিকাশ নম্বর:</span>
                            <span className="font-mono font-black text-base text-pink-950 tracking-wider">
                              {storeSettings.bkashNumber || '01700000000'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(storeSettings.bkashNumber || '01700000000');
                              setCopiedField('bkash');
                              showToast('বিকাশ নম্বর কপি করা হয়েছে!', 'success');
                              setTimeout(() => setCopiedField(null), 2500);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E2136E] hover:bg-[#c40e5d] text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-xs"
                          >
                            {copiedField === 'bkash' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedField === 'bkash' ? 'কপি হয়েছে' : 'নম্বর কপি'}</span>
                          </button>
                        </div>

                        {/* Steps */}
                        <div className="bg-white/80 p-2.5 rounded-xl border border-pink-200/60 text-[11px] space-y-1 text-pink-950">
                          <p>১. বিকাশ অ্যাপে গিয়ে <strong>{storeSettings.bkashType === 'Merchant' ? 'Make Payment' : 'Send Money'}</strong> সিলেক্ট করুন।</p>
                          <p>২. প্রাপক নম্বরে এই বিকাশ নম্বর দিয়ে <strong>BDT {grandTotal.toLocaleString()}</strong> টাকা পাঠান।</p>
                          <p>৩. প্রাপ্ত <strong>TrxID</strong> এবং আপনার বিকাশ নম্বরটি নিচে লিখুন।</p>
                        </div>

                        {/* Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              আপনার বিকাশ নম্বর (Sender) *
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
                              TrxID / ট্রানজেকশন আইডি *
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
                  </div>

                  {/* 3. NAGAD */}
                  <div
                    onClick={() => setPaymentMethod('Nagad')}
                    className={`rounded-2xl border-2 p-3.5 transition-all cursor-pointer ${
                      paymentMethod === 'Nagad'
                        ? 'border-[#F7941D] bg-orange-50/60 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === 'Nagad'
                              ? 'border-[#F7941D] bg-[#F7941D] text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {paymentMethod === 'Nagad' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-[#F7941D] text-white font-black text-xs flex items-center justify-center shrink-0">
                          নগদ
                        </div>
                        <div>
                          <div className="font-extrabold text-xs sm:text-sm text-stone-900">
                            Nagad Payment (নগদ)
                          </div>
                          <div className="text-[11px] text-stone-500">
                            বাংলাদেশ ডাক বিভাগের নির্ভরযোগ্য মোবাইল ফাইন্যান্সিয়াল সার্ভিস
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-orange-200 text-orange-950 rounded-full text-[10px] font-extrabold">
                        {storeSettings.nagadType || 'Personal'}
                      </span>
                    </div>

                    {paymentMethod === 'Nagad' && (
                      <div className="mt-3 pt-3 border-t border-orange-200 space-y-3 animate-in fade-in duration-150">
                        <div className="bg-white border border-orange-300 rounded-xl p-3 flex items-center justify-between shadow-2xs">
                          <div>
                            <span className="text-[10px] text-orange-700 block font-bold uppercase">আমাদের নগদ নম্বর:</span>
                            <span className="font-mono font-black text-base text-orange-950 tracking-wider">
                              {storeSettings.nagadNumber || '01800000000'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(storeSettings.nagadNumber || '01800000000');
                              setCopiedField('nagad');
                              showToast('নগদ নম্বর কপি করা হয়েছে!', 'success');
                              setTimeout(() => setCopiedField(null), 2500);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7941D] hover:bg-[#df7d09] text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-xs"
                          >
                            {copiedField === 'nagad' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedField === 'nagad' ? 'কপি হয়েছে' : 'নম্বর কপি'}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              আপনার নগদ নম্বর *
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
                              TrxID / ট্রানজেকশন আইডি *
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
                  </div>

                  {/* 4. ROCKET / CELLFIN / CARDS */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { id: 'Rocket', label: 'Rocket (রকেট)', sub: 'DBBL Mobile', icon: Smartphone, color: 'text-[#8C3494]' },
                      { id: 'CellFin', label: 'CellFin (সেলফিন)', sub: 'IBBL Account', icon: Building, color: 'text-[#0072BC]' },
                      { id: 'Card', label: 'Card (কার্ড)', sub: 'Visa/Mastercard', icon: CreditCard, color: 'text-stone-800' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          paymentMethod === m.id
                            ? 'border-stone-900 bg-stone-100 font-bold ring-1 ring-stone-900'
                            : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className={`font-bold text-xs truncate ${m.color}`}>{m.label}</div>
                        <div className="text-[10px] text-stone-500 truncate">{m.sub}</div>
                      </button>
                    ))}
                  </div>

                  {/* Details for Rocket / CellFin / Card */}
                  {paymentMethod === 'Rocket' && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-purple-950">Rocket নম্বর: {storeSettings.rocketNumber || '01900000000'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="tel"
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          placeholder="Sender 12-Digit Phone"
                          className="bg-white border border-purple-300 rounded-lg p-1.5 text-xs font-mono"
                        />
                        <input
                          type="text"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder="Rocket TrxID"
                          className="bg-white border border-purple-300 rounded-lg p-1.5 text-xs font-mono uppercase"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'CellFin' && (
                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs space-y-2">
                      <div className="text-sky-950">
                        <p className="font-bold">ব্যাংক তথ্য: {storeSettings.bankDetails || 'Islami Bank Bangladesh Ltd'}</p>
                        <p>CellFin: {storeSettings.cellfinNumber || '01700000000'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          placeholder="Sender Account/CellFin"
                          className="bg-white border border-sky-300 rounded-lg p-1.5 text-xs font-mono"
                        />
                        <input
                          type="text"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder="TrxID / Reference"
                          className="bg-white border border-sky-300 rounded-lg p-1.5 text-xs font-mono uppercase"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Card' && (
                    <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-700">
                      নিরাপদ SSLCommerz গেটওয়ে দ্বারা প্রসেস হবে। অর্ডার কনফার্ম করার পর ব্যাংক সিকিউরিটি পেজে নেওয়া হবে।
                    </div>
                  )}
                </div>
              </div>

              {/* Order Payable Summary */}
              <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-stone-200/90 text-xs sm:text-sm space-y-1.5">
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
                <div className="flex justify-between font-black text-stone-900 border-t border-stone-200 pt-2 text-base sm:text-lg">
                  <span>সর্বমোট প্রদেয় মূল্য:</span>
                  <span className="text-[#E85D2C]">BDT {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  {language === 'bn' ? 'ফিরে যান' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  id="confirm-place-order-btn"
                  disabled={isSubmittingOrder}
                  className="flex-1 py-3.5 bg-[#E85D2C] hover:bg-[#c94b1f] active:scale-98 disabled:opacity-60 text-white font-black text-sm rounded-xl shadow-lg shadow-[#E85D2C]/25 cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmittingOrder
                      ? (language === 'bn' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Placing Order...')
                      : (language === 'bn' ? `অর্ডার নিশ্চিত করুন (৳${grandTotal.toLocaleString()})` : `Place Order (BDT ${grandTotal.toLocaleString()})`)}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Instructions Guide Modal */}
      <PaymentInstructionsModal
        isOpen={showPaymentGuideModal}
        onClose={() => setShowPaymentGuideModal(false)}
        defaultMethod={paymentMethod}
        orderAmount={grandTotal}
      />
    </div>
  );
};
