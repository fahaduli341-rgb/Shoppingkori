import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Coupon } from '../types';
import {
  Tag,
  Plus,
  Trash2,
  Calendar,
  Percent,
  DollarSign,
  Copy,
  Check,
  X,
  Sparkles
} from 'lucide-react';

export const AdminCouponsTab: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon, updateCoupon, showToast } = useShop();

  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat');
  const [discountValue, setDiscountValue] = useState<number>(50);
  const [minSpend, setMinSpend] = useState<number>(500);
  const [maxDiscount, setMaxDiscount] = useState<number>(200);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [expiryDays, setExpiryDays] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    showToast(`Copied code ${couponCode} to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Please enter a coupon code', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);

      await addCoupon({
        id: `cpn-${Date.now().toString().slice(-4)}`,
        code: code.trim().toUpperCase(),
        discount: Number(discountValue),
        minOrder: Number(minSpend) || 0,
        description: discountType === 'percent' ? `${discountValue}% Off Promo` : `Flat ৳${discountValue} Off Voucher`,
        discountType,
        discountValue: Number(discountValue),
        minSpend: Number(minSpend) || 0,
        maxDiscount: discountType === 'percent' ? Number(maxDiscount) : undefined,
        usageLimit: Number(usageLimit) || undefined,
        usedCount: 0,
        validUntil: expiryDate.toISOString().split('T')[0],
        isActive: true
      });

      showToast(`Coupon ${code.toUpperCase()} created successfully!`, 'success');
      setShowAddModal(false);
      setCode('');
      setDiscountValue(50);
      setMinSpend(500);
    } catch (err: any) {
      showToast('Failed to create coupon: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      await updateCoupon(coupon.id, { isActive: !coupon.isActive });
      showToast(`Coupon ${coupon.code} updated`, 'info');
    } catch (err: any) {
      showToast('Failed to update coupon', 'error');
    }
  };

  const handleDelete = (coupon: Coupon) => {
    setCouponToDelete(coupon);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#E85D2C]" />
            <span>Discount & Coupon Codes (ডিসকাউন্ট ও কুপন কোড)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Create promotional vouchers, Eid/Puja campaign codes, and free delivery tokens.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#E85D2C] hover:bg-[#c94b1f] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-3 relative overflow-hidden ${
              coupon.isActive ? 'border-stone-200 hover:border-[#E85D2C]' : 'border-stone-200 opacity-60 bg-stone-50'
            }`}
          >
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-base text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                  {coupon.code}
                </span>
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md cursor-pointer"
                  title="Copy code"
                >
                  {copiedCode === coupon.code ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  coupon.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {coupon.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Discount Value */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#E85D2C]">
                {coupon.discountType === 'percent'
                  ? `${coupon.discountValue}% OFF`
                  : `BDT ${coupon.discountValue} OFF`}
              </span>
              <span className="text-xs text-stone-500">
                (Min Spend: ৳{coupon.minSpend})
              </span>
            </div>

            {/* Details */}
            <div className="space-y-1 text-xs text-stone-500 border-t border-stone-100 pt-2.5">
              <div className="flex justify-between">
                <span>Valid Until:</span>
                <span className="font-semibold text-stone-700">{coupon.validUntil}</span>
              </div>
              <div className="flex justify-between">
                <span>Usage Limit:</span>
                <span className="font-semibold text-stone-700">
                  {coupon.usedCount || 0} / {coupon.usageLimit || '∞'} uses
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
              <button
                onClick={() => handleToggleStatus(coupon)}
                className="font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                {coupon.isActive ? 'Deactivate' : 'Activate'}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(coupon)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Delete coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#E85D2C]" />
                <span>Create New Discount Coupon</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Coupon Code * (e.g. BAZAR50, EID100)
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="BAZAR50"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-hidden focus:border-[#E85D2C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                  >
                    <option value="flat">Flat Amount (BDT)</option>
                    <option value="percent">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Minimum Spend (BDT)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Validity (Days from today)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Usage Limit (Total redemptions)
                </label>
                <input
                  type="number"
                  min={1}
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#E85D2C] hover:bg-[#c94b1f] disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Coupon Confirmation Modal */}
      {couponToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-base text-stone-900">
                Delete Coupon? (কুপন মুছে ফেলুন)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Are you sure you want to permanently delete coupon code{' '}
                <strong className="text-stone-900 font-bold font-mono">"{couponToDelete.code}"</strong>?
              </p>
              <p className="text-[11px] text-stone-400">
                Customers will no longer be able to use this discount code at checkout.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCouponToDelete(null)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 active:scale-98 text-stone-700 font-semibold text-xs rounded-xl cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = couponToDelete.id;
                  setCouponToDelete(null);
                  await deleteCoupon(id);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
