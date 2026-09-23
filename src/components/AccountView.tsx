import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  User,
  Package,
  LogOut,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Truck,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  Search
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

export const AccountView: React.FC = () => {
  const {
    customerUser,
    setCustomerUser,
    registerCustomerAccount,
    loginCustomerAccount,
    logoutCustomer,
    orders,
    storeSettings,
    showToast,
    setCurrentView,
    language
  } = useShop();

  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Login form state (supports mobile number or email)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      showToast(language === 'bn' ? 'মোবাইল নম্বর ও পাসওয়ার্ড দিন' : 'Please fill in your phone/email and password', 'error');
      return;
    }
    setIsSubmittingLogin(true);
    const res = await loginCustomerAccount(loginIdentifier.trim(), loginPassword);
    setIsSubmittingLogin(false);
    if (!res.success) {
      showToast(res.message, 'error');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regPassword) {
      showToast(language === 'bn' ? 'পূর্ণ নাম, মোবাইল নম্বর এবং পাসওয়ার্ড দিন' : 'Please complete all required fields', 'error');
      return;
    }
    if (regPhone.trim().length < 11) {
      showToast(language === 'bn' ? '১১ ডিজিটের সঠিক মোবাইল নম্বর দিন' : 'Please provide a valid 11-digit mobile number', 'error');
      return;
    }
    if (regPassword.length < 4) {
      showToast(language === 'bn' ? 'পাসওয়ার্ড অন্তত ৪ ডিজিটের হতে হবে' : 'Password must be at least 4 characters', 'error');
      return;
    }

    setIsSubmittingReg(true);
    const res = await registerCustomerAccount({
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim() || undefined,
      password: regPassword,
      address: regAddress.trim() || undefined
    });
    setIsSubmittingReg(false);
    if (!res.success) {
      showToast(res.message, 'error');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(language === 'bn' ? 'কপি করা হয়েছে!' : 'Copied!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper for Stepper status index
  const getStatusStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Out for Delivery':
        return 4;
      case 'Delivered':
        return 5;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const STEPS: { labelBn: string; labelEn: string; descBn: string; descEn: string }[] = [
    { labelBn: 'পেন্ডিং', labelEn: 'Pending', descBn: 'অর্ডার গ্রহণ করা হয়েছে', descEn: 'Order received' },
    { labelBn: 'কনফার্মড', labelEn: 'Confirmed', descBn: 'অর্ডার নিশ্চিত করা হয়েছে', descEn: 'Order confirmed' },
    { labelBn: 'প্রসেসিং', labelEn: 'Processing', descBn: 'প্যাকেজিং চলছে', descEn: 'Packaging in progress' },
    { labelBn: 'শিপড', labelEn: 'Shipped', descBn: 'কুরিয়ারে হস্তান্তর করা হয়েছে', descEn: 'Handed to courier' },
    { labelBn: 'ডেলিভারিতে', labelEn: 'Out for Delivery', descBn: 'ডেলিভারি ম্যানের কাছে আছে', descEn: 'Out for delivery' },
    { labelBn: 'ডেলিভার্ড', labelEn: 'Delivered', descBn: 'সফলভাবে পৌঁছে দেওয়া হয়েছে', descEn: 'Successfully delivered' }
  ];

  // If Logged in: Customer Account & Live Order Tracking
  if (customerUser) {
    // Filter orders belonging to this customer
    const customerOrders = orders.filter((o) => {
      const phoneMatch = customerUser.phone && o.phone?.replace(/[^0-9]/g, '') === customerUser.phone?.replace(/[^0-9]/g, '');
      const emailMatch = customerUser.email && o.email && o.email.toLowerCase() === customerUser.email.toLowerCase();
      const nameMatch = customerUser.name && o.customerName && o.customerName.toLowerCase() === customerUser.name.toLowerCase();
      return Boolean(phoneMatch || emailMatch || nameMatch);
    });

    return (
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        {/* Profile Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-[#1F6F4A] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#E85D2C] to-amber-400 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-lg shrink-0">
                {(customerUser.name || 'C').charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {customerUser.name}
                  </h2>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                    Verified Customer
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 font-mono flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#E85D2C]" />
                  <span>{customerUser.phone}</span>
                </p>
                {customerUser.email && (
                  <p className="text-xs text-stone-400">
                    {customerUser.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('products')}
                className="px-4 py-2.5 bg-white text-stone-900 hover:bg-stone-100 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                {language === 'bn' ? 'কেনাকাটা করুন' : 'Continue Shopping'}
              </button>
              <button
                onClick={logoutCustomer}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-800/80 hover:bg-red-600/80 text-stone-200 hover:text-white border border-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === 'bn' ? 'লগআউট' : 'Sign out'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-700/60 text-xs">
            <div className="bg-stone-800/60 rounded-xl p-3">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">মোট অর্ডার (Total Orders)</span>
              <span className="text-lg font-black text-white">{customerOrders.length}</span>
            </div>
            <div className="bg-stone-800/60 rounded-xl p-3">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">চলতি ডেলিভারি (Active)</span>
              <span className="text-lg font-black text-amber-400">
                {customerOrders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length}
              </span>
            </div>
            <div className="bg-stone-800/60 rounded-xl p-3">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">ডেলিভার্ড (Delivered)</span>
              <span className="text-lg font-black text-emerald-400">
                {customerOrders.filter((o) => o.status === 'Delivered').length}
              </span>
            </div>
            <div className="bg-stone-800/60 rounded-xl p-3">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">ক্যাশব্যাক / রিওয়ার্ড</span>
              <span className="text-lg font-black text-[#E85D2C]">৳ ০</span>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#E85D2C] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-stone-900">
                {language === 'bn' ? 'আমার অর্ডার ও লাইভ ট্র্যাকিং' : 'My Orders & Live Tracking'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'bn'
                  ? 'আপনার প্রতিটি অর্ডারের রিয়েল-টাইম কুরিয়ার ও ডেলিভারি স্ট্যাটাস দেখুন'
                  : 'Real-time parcel status, courier dispatch, and delivery updates'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('tracking')}
            className="text-xs font-bold text-[#E85D2C] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ট্র্যাকিং আইডি দিয়ে খুঁজুন' : 'Search by ID'}</span>
          </button>
        </div>

        {/* Orders List */}
        {customerOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#E85D2C] flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-stone-800">
                {language === 'bn' ? 'এখনো কোনো অর্ডার করেননি' : 'No orders placed yet'}
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'আমাদের আকর্ষণীয় কালেকশন থেকে আপনার পছন্দের পণ্য এখনই অর্ডার করুন।'
                  : 'Browse our extensive catalog and enjoy fast cash on delivery across Bangladesh.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('products')}
              className="px-6 py-2.5 bg-[#E85D2C] hover:bg-[#c94b1f] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'পণ্য দেখুন ও অর্ডার করুন' : 'Browse Products'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {customerOrders.map((ord) => {
              const currentStep = getStatusStepIndex(ord.status);
              const isCancelled = ord.status === 'Cancelled';
              const cleanWhatsApp = storeSettings.whatsappNumber?.replace(/[^0-9]/g, '');

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Order Top Bar */}
                  <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <span className="text-[11px] text-stone-500 block">অর্ডার নম্বর:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-extrabold text-sm text-[#E85D2C]">
                            #{ord.id}
                          </span>
                          <button
                            onClick={() => handleCopy(ord.id, `ord-${ord.id}`)}
                            className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
                            title="Copy Order ID"
                          >
                            {copiedId === `ord-${ord.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="h-6 w-px bg-stone-200 hidden sm:block" />

                      <div>
                        <span className="text-[11px] text-stone-500 block">অর্ডারের তারিখ:</span>
                        <span className="text-xs font-semibold text-stone-700">
                          {ord.createdAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : ord.status === 'Shipped' || ord.status === 'Out for Delivery'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : ord.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        <span>{ord.status}</span>
                      </span>

                      {/* Payment Status Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        ord.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}>
                        {ord.paymentMethod} • {ord.paymentStatus || 'Unpaid'}
                      </span>
                    </div>
                  </div>

                  {/* LIVE TRACKING STEPPER */}
                  <div className="p-5 sm:p-6 bg-[#FAF9F5] border-b border-stone-200/80">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-xs font-bold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
                        <Truck className="w-4 h-4 text-[#1F6F4A]" />
                        <span>লাইভ ডেলিভারি ট্র্যাকিং প্রগ্রেস (Live Stepper)</span>
                      </h5>

                      {ord.courier && (
                        <div className="text-xs font-semibold text-stone-600 bg-white border border-stone-200 px-3 py-1 rounded-xl shadow-2xs">
                          কুরিয়ার: <strong className="text-[#1F6F4A]">{ord.courier}</strong>
                          {(ord.trackingCode || ord.consignmentId || ord.courierTrackingId) && (
                            <span className="font-mono text-[#E85D2C] ml-1.5 font-bold">
                              #{ord.trackingCode || ord.consignmentId || ord.courierTrackingId}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {!isCancelled ? (
                      <div className="relative">
                        {/* Stepper bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                          {STEPS.map((step, idx) => {
                            const isDone = currentStep >= idx;
                            const isCurrent = currentStep === idx;

                            return (
                              <div
                                key={idx}
                                className={`p-2.5 rounded-2xl border transition-all ${
                                  isCurrent
                                    ? 'bg-white border-[#E85D2C] ring-2 ring-[#E85D2C]/20 shadow-xs'
                                    : isDone
                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                    : 'bg-white/60 border-stone-200 opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                      isDone
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-stone-200 text-stone-600'
                                    }`}
                                  >
                                    {isDone ? '✓' : idx + 1}
                                  </span>
                                  {isCurrent && (
                                    <span className="w-2 h-2 rounded-full bg-[#E85D2C] animate-ping" />
                                  )}
                                </div>
                                <div className="font-bold text-xs text-stone-900 leading-tight">
                                  {language === 'bn' ? step.labelBn : step.labelEn}
                                </div>
                                <div className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                                  {language === 'bn' ? step.descBn : step.descEn}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>এই অর্ডারটি বাতিল (Cancelled) করা হয়েছে। যেকোনো তথ্যের জন্য আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন।</span>
                      </div>
                    )}
                  </div>

                  {/* Items in this Order */}
                  <div className="p-5 space-y-3">
                    <h6 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      অর্ডারের পণ্যসমূহ ({ord.items.length} Items)
                    </h6>
                    <div className="divide-y divide-stone-100">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={it.image}
                              alt={it.name}
                              className="w-12 h-12 rounded-xl object-contain bg-stone-50 border border-stone-200 p-1 shrink-0"
                            />
                            <div className="min-w-0">
                              <h6 className="font-bold text-stone-900 truncate">{it.name}</h6>
                              <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                                <span>পরিমাণ: <strong>{it.quantity} টি</strong></span>
                                {it.selectedSize && <span>| সাইজ: <strong>{it.selectedSize}</strong></span>}
                                {it.selectedColor && <span>| রঙ: <strong>{it.selectedColor}</strong></span>}
                              </div>
                            </div>
                          </div>
                          <span className="font-extrabold text-stone-900 shrink-0 text-sm">
                            BDT {(it.price * it.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-stone-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>ঠিকানা: <strong>{ord.address}, {ord.district} ({ord.deliveryZone})</strong></span>
                      </div>
                      <div className="text-[11px] text-stone-500 pl-5">
                        ডেলিভারি চার্জ: ৳{ord.shippingCost} {ord.discountAmount ? `| ডিসকাউন্ট: -৳${ord.discountAmount}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-500 block">সর্বমোট প্রদেয়:</span>
                        <span className="text-base font-black text-[#E85D2C]">
                          BDT {ord.totalAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Direct WhatsApp Support */}
                      {cleanWhatsApp && (
                        <a
                          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                            `হ্যালো Shopping Kori, আমি আমার অর্ডার #${ord.id} সম্পর্কে জানতে চাচ্ছি। কাস্টমার নাম: ${ord.customerName}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp Support</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // If Not logged in: Show Daraz-Style Sign In / Sign Up Form
  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E85D2C] to-amber-500 text-white flex items-center justify-center mx-auto shadow-md shadow-[#E85D2C]/20 mb-3">
            <User className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            {isRegistering
              ? (language === 'bn' ? 'নতুন একাউন্ট খুলুন' : 'Create Customer Account')
              : (language === 'bn' ? 'কাস্টমার লগইন' : 'Customer Sign In')}
          </h2>
          <p className="text-xs text-stone-500">
            {language === 'bn'
              ? 'অর্ডার করতে ও রিয়েল-টাইম পার্সেল ট্র্যাকিং দেখতে একাউন্ট থাকা আবশ্যক।'
              : 'Required for fast checkout and real-time live parcel tracking.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              !isRegistering
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isRegistering
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {language === 'bn' ? 'নতুন একাউন্ট' : 'Register'}
          </button>
        </div>

        {/* LOGIN FORM */}
        {!isRegistering ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {language === 'bn' ? '১১ ডিজিটের মোবাইল নম্বর বা ইমেইল *' : 'Mobile Number or Email *'}
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="01XXXXXXXXX / user@gmail.com"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-[#E85D2C] focus:ring-2 focus:ring-[#E85D2C]/20 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {language === 'bn' ? 'পাসওয়ার্ড *' : 'Password *'}
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-[#E85D2C] focus:ring-2 focus:ring-[#E85D2C]/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full py-3 bg-[#E85D2C] hover:bg-[#c94b1f] active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-md shadow-[#E85D2C]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmittingLogin ? 'লগইন হচ্ছে...' : (language === 'bn' ? 'লগইন করুন' : 'Sign In to Account')}
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed / তানভীর আহমেদ"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'bn' ? '১১ ডিজিটের মোবাইল নম্বর *' : 'Mobile Number (11 Digits) *'}
              </label>
              <input
                type="tel"
                required
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email Address (Optional)'}
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'bn' ? 'ডেলিভারি ঠিকানা (ঐচ্ছিক)' : 'Delivery Address (Optional)'}
              </label>
              <input
                type="text"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                placeholder="বাসা নম্বর, রোড, এলাকা/থানা..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড সেট করুন *' : 'Create Password *'}
              </label>
              <input
                type="password"
                required
                minLength={4}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="ন্যূনতম ৪ ডিজিট"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-sm focus:outline-hidden focus:border-[#E85D2C]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReg}
              className="w-full py-3 bg-[#E85D2C] hover:bg-[#c94b1f] active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-md shadow-[#E85D2C]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmittingReg ? 'তৈরি হচ্ছে...' : (language === 'bn' ? 'একাউন্ট তৈরি করুন' : 'Create Account')}
            </button>
          </form>
        )}

        {/* Security Seals */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-3 text-[11px] text-stone-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F6F4A]" />
            <span>১০০% সুরক্ষিত ডেটা</span>
          </span>
          <span>•</span>
          <span>ক্যাশ অন ডেলিভারি</span>
        </div>
      </div>
    </div>
  );
};
