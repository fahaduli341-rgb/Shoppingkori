import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { StoreSettings, defaultStoreSettings } from '../types';
import {
  Settings,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Truck,
  Bell,
  Save,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Store,
  ShieldCheck,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  Lock,
  KeyRound,
  AlertCircle,
  Share2,
  Copy,
  Smartphone,
  Banknote,
  Building
} from 'lucide-react';

export const AdminSettingsTab: React.FC = () => {
  const { storeSettings, updateStoreSettings, showToast, changeAdminPassword } = useShop();

  const [formData, setFormData] = useState<StoreSettings>(storeSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passChangeSuccess, setPassChangeSuccess] = useState(false);
  const [passChangeError, setPassChangeError] = useState('');

  // Synchronize when storeSettings updates from remote
  useEffect(() => {
    setFormData(storeSettings);
  }, [storeSettings]);

  const handleChange = <K extends keyof StoreSettings>(field: K, value: StoreSettings[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateStoreSettings({
        ...formData,
        storeName: formData.storeName.trim() || 'Shopping Kori',
        whatsappNumber: formData.whatsappNumber.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        announcement: formData.announcement.trim(),
        deliveryInsideDhaka: Number(formData.deliveryInsideDhaka) || 0,
        deliveryOutsideDhaka: Number(formData.deliveryOutsideDhaka) || 0,
        facebookUrl: formData.facebookUrl?.trim() || '',
        bkashNumber: formData.bkashNumber?.trim() || '',
        bkashType: formData.bkashType || 'Personal',
        nagadNumber: formData.nagadNumber?.trim() || '',
        nagadType: formData.nagadType || 'Personal',
        rocketNumber: formData.rocketNumber?.trim() || '',
        cellfinNumber: formData.cellfinNumber?.trim() || '',
        bankDetails: formData.bankDetails?.trim() || ''
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (error: any) {
      showToast('Error saving settings: ' + (error.message || 'Please try again'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Do you want to reset all store settings back to original defaults?')) {
      setFormData(defaultStoreSettings);
      setSaveSuccess(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeError('');
    setPassChangeSuccess(false);

    if (!currentPasswordInput.trim()) {
      setPassChangeError('Please enter your current password / বর্তমান পাসওয়ার্ড দিন');
      return;
    }

    if (!newPasswordInput.trim() || newPasswordInput.trim().length < 6) {
      setPassChangeError('New password must be at least 6 characters / নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    if (newPasswordInput.trim() !== confirmPasswordInput.trim()) {
      setPassChangeError('New password and confirmation do not match / নতুন পাসওয়ার্ড দুটি মিলছে না');
      return;
    }

    setIsChangingPass(true);
    try {
      const ok = await changeAdminPassword(currentPasswordInput.trim(), newPasswordInput.trim());
      if (ok) {
        setPassChangeSuccess(true);
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
        setTimeout(() => setPassChangeSuccess(false), 5000);
      }
    } catch (err: any) {
      setPassChangeError(err.message || 'Failed to change password');
    } finally {
      setIsChangingPass(false);
    }
  };

  const cleanWhatsApp = formData.whatsappNumber.replace(/[^0-9]/g, '');
  const testWhatsAppUrl = cleanWhatsApp ? `https://wa.me/${cleanWhatsApp}` : '#';

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-emerald-800 to-[#155e3c] text-white p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-200 shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold">Store Configuration & Contact Settings</h2>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Manage your WhatsApp number, phone hotline, email, shop location, banner announcement, and delivery rates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to default settings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Contact & Communication Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-stone-800">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">Contacts & Communication</h3>
                    <p className="text-xs text-stone-500">হোয়াটসঅ্যাপ, হটলাইন ফোন ও ইমেইল</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Live on Website
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp Number */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Number *</span>
                    </label>
                    {cleanWhatsApp && (
                      <a
                        href={testWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                      >
                        <span>Test Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    placeholder="e.g. +8801700000000 or 01712345678"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                  <span className="text-[11px] text-stone-500 block mt-1">
                    Customers can tap this to chat directly on WhatsApp.
                  </span>
                </div>

                {/* Helpline / Phone */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-orange-600" />
                      <span>Hotline / Phone Number *</span>
                    </label>
                    {formData.phone && (
                      <a
                        href={`tel:${formData.phone}`}
                        className="text-[11px] font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1"
                      >
                        <span>Test Call</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="e.g. +8809600000000 or 01XXXXXXXXX"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                  <span className="text-[11px] text-stone-500 block mt-1">
                    Customer helpline displayed in Header and Footer.
                  </span>
                </div>

                {/* Support Email */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Support Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g. support@shoppingkori.com"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                  <span className="text-[11px] text-stone-500 block mt-1">
                    Official email shown to buyers for support.
                  </span>
                </div>

                {/* Physical Location / Shop Address */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>Store Location / Address *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="e.g. Dhaka, Bangladesh or Mirpur, Dhaka"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                  <span className="text-[11px] text-stone-500 block mt-1">
                    Store city or physical address shown in the footer.
                  </span>
                </div>
              </div>

              {/* Optional Facebook URL */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Facebook Page or Social Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.facebookUrl || ''}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/your-page"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* 2. Delivery Rates & Shipping Fees Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-stone-800">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">Delivery Charges (ডেলিভারি চার্জ)</h3>
                    <p className="text-xs text-stone-500">ঢাকা এবং ঢাকার বাইরের হোম ডেলিভারি ফি</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Inside Dhaka Delivery Fee (BDT)
                  </label>
                  <p className="text-[11px] text-stone-500 mb-2">ঢাকার ভেতরের কুরিয়ার চার্জ</p>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-stone-500">BDT</span>
                    <input
                      type="number"
                      min={0}
                      required
                      value={formData.deliveryInsideDhaka}
                      onChange={(e) => handleChange('deliveryInsideDhaka', Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl pl-12 pr-3 py-2 text-sm font-bold text-stone-900 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Outside Dhaka Delivery Fee (BDT)
                  </label>
                  <p className="text-[11px] text-stone-500 mb-2">ঢাকার বাইরের জেলাগুলোর চার্জ</p>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-stone-500">BDT</span>
                    <input
                      type="number"
                      min={0}
                      required
                      value={formData.deliveryOutsideDhaka}
                      onChange={(e) => handleChange('deliveryOutsideDhaka', Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl pl-12 pr-3 py-2 text-sm font-bold text-stone-900 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Banking & Payment Accounts */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-stone-800">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">Mobile Banking & Payment Numbers</h3>
                    <p className="text-xs text-stone-500">বিকাশ, নগদ, রকেট ও ব্যাংক একাউন্ট নম্বর সেট করুন</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* bKash Settings */}
                <div className="p-4 bg-pink-50/50 border border-pink-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-pink-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-[#E2136E] text-white text-[10px] flex items-center justify-center font-bold">bK</span>
                      <span>bKash (বিকাশ) নম্বর</span>
                    </span>
                    <select
                      value={formData.bkashType || 'Personal'}
                      onChange={(e) => handleChange('bkashType', e.target.value as any)}
                      className="bg-white border border-pink-300 rounded-lg px-2 py-1 text-[11px] font-bold text-pink-900"
                    >
                      <option value="Personal">Personal (Send Money)</option>
                      <option value="Merchant">Merchant (Make Payment)</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={formData.bkashNumber || ''}
                    onChange={(e) => handleChange('bkashNumber', e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full bg-white border border-pink-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-hidden focus:border-[#E2136E]"
                  />
                  <p className="text-[10px] text-pink-700">
                    কাস্টমার চেকআউটে এই নম্বরে টাকা পাঠিয়ে TrxID প্রদান করবেন।
                  </p>
                </div>

                {/* Nagad Settings */}
                <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-orange-950 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-[#F7941D] text-white text-[10px] flex items-center justify-center font-bold">নগদ</span>
                      <span>Nagad (নগদ) নম্বর</span>
                    </span>
                    <select
                      value={formData.nagadType || 'Personal'}
                      onChange={(e) => handleChange('nagadType', e.target.value as any)}
                      className="bg-white border border-orange-300 rounded-lg px-2 py-1 text-[11px] font-bold text-orange-950"
                    >
                      <option value="Personal">Personal (Send Money)</option>
                      <option value="Merchant">Merchant (Make Payment)</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={formData.nagadNumber || ''}
                    onChange={(e) => handleChange('nagadNumber', e.target.value)}
                    placeholder="e.g. 01812345678"
                    className="w-full bg-white border border-orange-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-hidden focus:border-[#F7941D]"
                  />
                  <p className="text-[10px] text-orange-700">
                    নগদ একাউন্ট নম্বর যা কাস্টমার কপি করে টাকা পাঠাতে পারবেন।
                  </p>
                </div>

                {/* Rocket Settings */}
                <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-[#8C3494] text-white text-[10px] flex items-center justify-center font-bold">DB</span>
                      <span>Rocket (রকেট) নম্বর</span>
                    </span>
                    <span className="text-[10px] text-purple-700 font-semibold">12-Digit DBBL</span>
                  </div>
                  <input
                    type="text"
                    value={formData.rocketNumber || ''}
                    onChange={(e) => handleChange('rocketNumber', e.target.value)}
                    placeholder="e.g. 019123456789"
                    className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-hidden focus:border-[#8C3494]"
                  />
                </div>

                {/* Bank / CellFin Details */}
                <div className="p-4 bg-sky-50/50 border border-sky-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-sky-950 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-[#0072BC]" />
                      <span>Bank / CellFin Details</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.cellfinNumber || ''}
                    onChange={(e) => handleChange('cellfinNumber', e.target.value)}
                    placeholder="CellFin Mobile No: 01XXXXXXXXX"
                    className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:outline-hidden focus:border-[#0072BC]"
                  />
                  <textarea
                    rows={2}
                    value={formData.bankDetails || ''}
                    onChange={(e) => handleChange('bankDetails', e.target.value)}
                    placeholder="Bank Name, Account Name, Account No, Branch..."
                    className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-[#0072BC]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Announcement Banner & Branding */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-stone-800">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">Store Notice & Floating Chat</h3>
                    <p className="text-xs text-stone-500">ওয়েবসাইটের শীর্ষ ব্যানার ও ফ্লোটিং বাটন</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Top Announcement Banner Text
                </label>
                <input
                  type="text"
                  value={formData.announcement}
                  onChange={(e) => handleChange('announcement', e.target.value)}
                  placeholder="e.g. 100% Genuine Products & Cash on Delivery Available Across Bangladesh"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-colors"
                />
                <span className="text-[11px] text-stone-500 block mt-1">
                  Appears at the very top of the website on every page.
                </span>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-stone-800">Floating WhatsApp Chat Button</div>
                  <div className="text-[11px] text-stone-500">
                    Show quick floating WhatsApp button on bottom-right of store
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('showFloatingWhatsApp', !formData.showFloatingWhatsApp)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    formData.showFloatingWhatsApp
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-stone-100 text-stone-600 border border-stone-300'
                  }`}
                >
                  {formData.showFloatingWhatsApp ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-600" />
                      <span>Enabled (সক্রিয়)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-stone-400" />
                      <span>Disabled (বন্ধ)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 4. Owner Password & Security Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-stone-800">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">Owner Password & Security (পাসওয়ার্ড পরিবর্তন)</h3>
                    <p className="text-xs text-stone-500">মার্চেন্ট প্যানেলে লগইন করার পাসওয়ার্ড পরিবর্তন করুন</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>Protected Access</span>
                </span>
              </div>

              {passChangeError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{passChangeError}</span>
                </div>
              )}

              {passChangeSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Password updated successfully! আপনার নতুন পাসওয়ার্ড সফলভাবে সেট হয়েছে।</span>
                </div>
              )}

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Current Password (বর্তমান পাসওয়ার্ড) *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        placeholder="Current password"
                        className="w-full bg-white border border-stone-300 rounded-xl pl-3 pr-9 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                      >
                        {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      New Password (নতুন পাসওয়ার্ড) *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full bg-white border border-stone-300 rounded-xl pl-3 pr-9 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                      >
                        {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Confirm Password (নিশ্চিত করুন) *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full bg-white border border-stone-300 rounded-xl pl-3 pr-9 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                      >
                        {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-stone-500">
                    💡 Tip: Default password is <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-700 font-mono text-[10px]">admin123456</code>. You can set any strong password.
                  </span>

                  <button
                    id="update-admin-password-btn"
                    type="button"
                    onClick={handlePasswordChange}
                    disabled={isChangingPass || !currentPasswordInput || !newPasswordInput || !confirmPasswordInput}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isChangingPass ? 'Updating...' : 'Change Password (পরিবর্তন করুন)'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 5. WhatsApp Sharing Link & Promo Card */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-stone-800">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">WhatsApp Share Link (হোয়াটসঅ্যাপে শেয়ার করার লিংক)</h3>
                    <p className="text-xs text-stone-500">গ্রাহকদের বা গ্রুপে আপনার স্টোর লিংক এক ক্লিকে শেয়ার করুন</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp Ready</span>
                </span>
              </div>

              <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200/70 space-y-3">
                <p className="text-xs text-stone-600 leading-relaxed">
                  নিচের লিংকটি কপি করে সরাসরি যে কোনো WhatsApp চ্যাট, গ্রুপ বা স্ট্যাটাসে শেয়ার করতে পারবেন:
                </p>

                {/* Direct Store Link Box */}
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-stone-200">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? window.location.origin : 'https://shoppingkori.com'}
                    className="w-full text-xs font-mono text-stone-700 bg-transparent outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const url = typeof window !== 'undefined' ? window.location.origin : '';
                      navigator.clipboard.writeText(url);
                      showToast('Store link copied to clipboard! লিংক কপি হয়েছে', 'success');
                    }}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>

                {/* WhatsApp Direct Share Button */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : '';
                      const text = encodeURIComponent(
                        `🛍️ *Shopping Kori - প্রতিদিনের প্রয়োজনীয় সেরা শপিং!*\n` +
                        `ক্যাশ অন ডেলিভারিতে সারা বাংলাদেশে ঘরে বসেই কেনাকাটা করুন।\n\n` +
                        `👉 এখনই অর্ডার করতে ভিজিট করুন:\n${origin}`
                      );
                      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                    }}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp-এ সরাসরি শেয়ার করুন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : '';
                      const shareText = `🛍️ *Shopping Kori - প্রতিদিনের প্রয়োজনীয় সেরা শপিং!*\nক্যাশ অন ডেলিভারিতে সারা বাংলাদেশে কেনাকাটা করুন।\n\n👉 অর্ডার করতে ভিজিট করুন:\n${origin}`;
                      navigator.clipboard.writeText(shareText);
                      showToast('WhatsApp promo text copied! মেসেজ কপি হয়েছে', 'success');
                    }}
                    className="py-2.5 px-4 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>মেসেজ কপি করুন</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Storefront Preview & Save Action */}
          <div className="space-y-6">
            {/* Save Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4 sticky top-20">
              <div className="flex items-center gap-2 text-stone-800">
                <Store className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm sm:text-base">Save Settings</h3>
              </div>
              <p className="text-xs text-stone-500">
                All changes are saved to the cloud database and instantly reflect on your live website.
              </p>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Settings successfully saved and live!</span>
                </div>
              )}

              <button
                id="save-store-settings-btn"
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 px-4 bg-[#155e3c] hover:bg-[#114b30] active:scale-98 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Store Settings'}</span>
              </button>

              {/* Live Preview Card */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  <span>Buyer Experience Preview</span>
                </div>

                {/* Announcement Banner Preview */}
                <div className="bg-[#155e3c] text-emerald-50 p-2.5 rounded-xl text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="truncate">{formData.announcement || '100% Genuine Products'}</span>
                </div>

                {/* Contact Card Preview */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-2">
                  <div className="font-bold text-stone-700 text-[11px] uppercase tracking-wider">
                    Footer Contact Box
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-3 h-3 text-orange-600 shrink-0" />
                    <span className="truncate">{formData.phone || 'Phone'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <MessageCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">WhatsApp: {formData.whatsappNumber || 'None'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="truncate">{formData.email || 'Email'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                    <span className="truncate">{formData.address || 'Address'}</span>
                  </div>
                </div>

                {/* Shipping Preview */}
                <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-200/60 text-xs flex justify-between">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Dhaka:</span>
                    <span className="font-bold text-orange-700">BDT {formData.deliveryInsideDhaka}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 block text-[11px]">Outside Dhaka:</span>
                    <span className="font-bold text-orange-700">BDT {formData.deliveryOutsideDhaka}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
