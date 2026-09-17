import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Vendor } from '../types';
import {
  Store,
  Plus,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Percent,
  Package,
  X,
  Search,
  ExternalLink
} from 'lucide-react';

export const AdminVendorsTab: React.FC = () => {
  const { vendors, addVendor, updateVendor, products, showToast } = useShop();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New vendor form state
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [commissionRate, setCommissionRate] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredVendors = vendors.filter((v) => {
    const term = (searchTerm || '').toLowerCase();
    const name = (v.storeName || v.shopName || '').toLowerCase();
    const owner = (v.ownerName || '').toLowerCase();
    const phoneNum = v.phone || '';
    return name.includes(term) || owner.includes(term) || phoneNum.includes(searchTerm);
  });

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !phone.trim()) {
      showToast('Store name and mobile number are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addVendor({
        shopName: storeName.trim(),
        storeName: storeName.trim(),
        ownerName: ownerName.trim() || storeName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: 'Dhaka',
        address: address.trim() || 'Dhaka, Bangladesh',
        commissionRate: Number(commissionRate) || 10,
        status: 'Active',
        rating: 4.9,
        isVerified: true
      });
      showToast('Vendor store registered successfully!', 'success');
      setShowAddModal(false);
      setStoreName('');
      setOwnerName('');
      setEmail('');
      setPhone('');
      setAddress('');
    } catch (err: any) {
      showToast('Failed to register vendor: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVendorStatus = async (vendor: Vendor) => {
    const newStatus = vendor.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await updateVendor(vendor.id, { status: newStatus });
      showToast(`Vendor ${vendor.storeName} marked as ${newStatus}`, 'success');
    } catch (err: any) {
      showToast('Failed to update vendor status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-[#1F6F4A]" />
            <span>Multi-Vendor Management (মার্কেটপ্লেস ভেন্ডর)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Manage partner merchants, commission rates, and track catalog contributions.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendor store or phone..."
              className="w-full bg-white border border-stone-300 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-hidden focus:border-[#E85D2C]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-[#1F6F4A] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor) => {
          const vendorProductCount = products.filter((p) => p.vendorId === vendor.id || p.vendorName === vendor.storeName).length;
          return (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs hover:border-stone-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-stone-900">{vendor.storeName}</h3>
                    {vendor.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-[#1F6F4A]" />
                    )}
                  </div>
                  <p className="text-xs text-stone-500">{vendor.ownerName}</p>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    vendor.status === 'Active'
                      ? 'bg-emerald-50 text-[#1F6F4A] border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {vendor.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{vendor.phone}</span>
                </div>
                {vendor.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>{vendor.email}</span>
                  </div>
                )}
                {vendor.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span className="truncate">{vendor.address}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                <div className="bg-stone-50 p-2 rounded-xl text-center">
                  <span className="text-[10px] text-stone-400 block">Commission</span>
                  <span className="font-extrabold text-stone-800">{vendor.commissionRate}%</span>
                </div>
                <div className="bg-stone-50 p-2 rounded-xl text-center">
                  <span className="text-[10px] text-stone-400 block">Products</span>
                  <span className="font-extrabold text-[#E85D2C]">{vendorProductCount} items</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => toggleVendorStatus(vendor)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  {vendor.status === 'Active' ? 'Suspend Store' : 'Activate Store'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-[#1F6F4A]" />
                <span>Register New Vendor Store</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Store / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Priyo Fashion House"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Owner / Contact Person
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Mohammad Rafiq"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Commission %
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vendor@store.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#E85D2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Warehouse / Store Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Shop 24, New Market, Dhaka"
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
                  className="flex-1 py-2.5 bg-[#1F6F4A] hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Register Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
