import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Copy,
  Check,
  Smartphone,
  Banknote,
  CreditCard,
  Building,
  HelpCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface PaymentInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMethod?: string;
  orderAmount?: number;
}

export const PaymentInstructionsModal: React.FC<PaymentInstructionsModalProps> = ({
  isOpen,
  onClose,
  defaultMethod = 'bKash',
  orderAmount
}) => {
  const { storeSettings, language } = useShop();
  const [selectedTab, setSelectedTab] = useState<string>(defaultMethod);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const bkashNum = storeSettings.bkashNumber || '01700000000';
  const bkashType = storeSettings.bkashType || 'Personal';
  const nagadNum = storeSettings.nagadNumber || '01800000000';
  const nagadType = storeSettings.nagadType || 'Personal';
  const rocketNum = storeSettings.rocketNumber || '01900000000';
  const cellfinNum = storeSettings.cellfinNumber || '01700000000';
  const bankInfo = storeSettings.bankDetails || 'Islami Bank Bangladesh Ltd, A/C: 2050XXXXXXXXXX, Branch: Motijheel, Dhaka';

  const methods = [
    { id: 'bKash', name: 'bKash (বিকাশ)', color: 'bg-[#E2136E] text-white', ring: 'ring-[#E2136E]' },
    { id: 'Nagad', name: 'Nagad (নগদ)', color: 'bg-[#F7941D] text-white', ring: 'ring-[#F7941D]' },
    { id: 'Rocket', name: 'Rocket (রকেট)', color: 'bg-[#8C3494] text-white', ring: 'ring-[#8C3494]' },
    { id: 'Cash on Delivery', name: 'Cash on Delivery', color: 'bg-[#1F6F4A] text-white', ring: 'ring-[#1F6F4A]' },
    { id: 'CellFin', name: 'CellFin / Bank', color: 'bg-[#0072BC] text-white', ring: 'ring-[#0072BC]' },
    { id: 'Card', name: 'Card / Debit', color: 'bg-stone-800 text-white', ring: 'ring-stone-800' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-orange-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {language === 'bn' ? 'পেমেন্ট নির্দেশিকা ও নিয়মাবলী' : 'Payment Guide & Instructions'}
              </h3>
              <p className="text-xs text-stone-300">
                {language === 'bn' ? 'সহজে ও নিরাপদে পেমেন্ট করার ধাপগুলো জানুন' : 'Step-by-step instructions for all methods'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex overflow-x-auto border-b border-stone-200 bg-stone-50 p-2 gap-1.5 scrollbar-none">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedTab(m.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedTab === m.id
                  ? `${m.color} shadow-sm`
                  : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-stone-800 text-sm">
          {orderAmount && orderAmount > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-medium text-stone-700">
                {language === 'bn' ? 'আপনার মোট প্রদেয় টাকার পরিমাণ:' : 'Total Payable Amount:'}
              </span>
              <span className="font-extrabold text-[#E85D2C] text-sm sm:text-base">
                BDT {orderAmount.toLocaleString()}
              </span>
            </div>
          )}

          {/* bKash Instructions */}
          {selectedTab === 'bKash' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-pink-50 border border-pink-200 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#E2136E] text-white font-bold flex items-center justify-center text-xs">
                      bK
                    </div>
                    <div>
                      <div className="text-xs font-bold text-pink-900">
                        bKash {bkashType} Account
                      </div>
                      <div className="text-[11px] text-pink-700">
                        {bkashType === 'Merchant' ? 'Make Payment অপশন ব্যবহার করুন' : 'Send Money অপশন ব্যবহার করুন'}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-pink-200 text-pink-900 rounded-full text-[10px] font-bold">
                    {bkashType}
                  </span>
                </div>

                {/* Account Number Box */}
                <div className="flex items-center justify-between bg-white border border-pink-300 rounded-xl p-2.5 mt-2">
                  <span className="font-mono font-extrabold text-base sm:text-lg text-pink-950 tracking-wider">
                    {bkashNum}
                  </span>
                  <button
                    onClick={() => handleCopy(bkashNum, 'bkash')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E2136E] hover:bg-[#c40e5d] text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
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
              </div>

              {/* Step by Step */}
              <div className="space-y-2.5">
                <h4 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider">
                  {language === 'bn' ? 'বিকাশে টাকা পাঠানোর সহজ ৫টি ধাপ:' : '5 Easy Steps to Pay via bKash:'}
                </h4>
                <div className="space-y-2 text-xs leading-relaxed">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      ১
                    </span>
                    <p>
                      আপনার <strong>bKash App</strong> ওপেন করুন অথবা মোবাইলে <strong>*247#</strong> ডায়াল করুন।
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      ২
                    </span>
                    <p>
                      {bkashType === 'Merchant' ? (
                        <><strong>"Payment"</strong> অপশন বেছে নিন।</>
                      ) : (
                        <><strong>"Send Money"</strong> অপশন বেছে নিন।</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      ৩
                    </span>
                    <p>
                      প্রাপক নম্বরে আমাদের বিকাশ নম্বরটি পেস্ট করুন: <code className="font-bold text-pink-700">{bkashNum}</code>
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      ৪
                    </span>
                    <p>
                      টাকার পরিমাণ লিখুন এবং রেফারেন্সে আপনার নাম বা ফোন নম্বর দিয়ে পিন কোড দিয়ে লেনদেন সম্পন্ন করুন।
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      ৫
                    </span>
                    <p>
                      লেনদেন সফল হলে যে <strong>TrxID</strong> (যেমন: <code className="font-mono font-bold">9J8B2K10</code>) পাবেন, সেটি কপি করে চেকআউট পেজে বসিয়ে <strong>"অর্ডার নিশ্চিত করুন"</strong> বাটনে চাপ দিন।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nagad Instructions */}
          {selectedTab === 'Nagad' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#F7941D] text-white font-bold flex items-center justify-center text-xs">
                      নগদ
                    </div>
                    <div>
                      <div className="text-xs font-bold text-orange-950">
                        Nagad {nagadType} Account
                      </div>
                      <div className="text-[11px] text-orange-700">
                        {nagadType === 'Merchant' ? 'Merchant Pay করুন' : 'Send Money করুন'}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-orange-200 text-orange-900 rounded-full text-[10px] font-bold">
                    {nagadType}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white border border-orange-300 rounded-xl p-2.5 mt-2">
                  <span className="font-mono font-extrabold text-base sm:text-lg text-orange-950 tracking-wider">
                    {nagadNum}
                  </span>
                  <button
                    onClick={() => handleCopy(nagadNum, 'nagad')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7941D] hover:bg-[#df7d09] text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
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
              </div>

              <div className="space-y-2.5">
                <h4 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider">
                  নগদে টাকা পাঠানোর ৪টি ধাপ:
                </h4>
                <div className="space-y-2 text-xs leading-relaxed">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px]">১</span>
                    <p>আপনার <strong>Nagad App</strong> ওপেন করুন অথবা ডায়াল করুন <strong>*167#</strong>।</p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px]">২</span>
                    <p><strong>{nagadType === 'Merchant' ? 'Merchant Pay' : 'Send Money'}</strong> বেছে নিয়ে প্রাপক নম্বর দিন: <code className="font-bold text-orange-700">{nagadNum}</code>।</p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px]">৩</span>
                    <p>অর্ডারের মোট টাকার পরিমাণ লিখুন এবং পিন দিয়ে কনফার্ম করুন।</p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">৪</span>
                    <p>প্রাপ্ত <strong>Transaction ID / TrxID</strong> এবং আপনার প্রেরক নম্বরটি চেকআউটে সাবমিট করুন।</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rocket Instructions */}
          {selectedTab === 'Rocket' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#8C3494] text-white font-bold flex items-center justify-center text-xs">
                      DBBL
                    </div>
                    <div>
                      <div className="text-xs font-bold text-purple-950">
                        Dutch-Bangla Rocket
                      </div>
                      <div className="text-[11px] text-purple-700">
                        রকেট একাউন্ট নম্বর (১২ ডিজিট)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white border border-purple-300 rounded-xl p-2.5 mt-2">
                  <span className="font-mono font-extrabold text-base sm:text-lg text-purple-950 tracking-wider">
                    {rocketNum}
                  </span>
                  <button
                    onClick={() => handleCopy(rocketNum, 'rocket')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8C3494] hover:bg-[#722779] text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    {copiedField === 'rocket' ? 'কপি হয়েছে' : 'নম্বর কপি করুন'}
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs leading-relaxed">
                <p>১. রকেট অ্যাপ বা <strong>*322#</strong> ডায়াল করুন।</p>
                <p>২. Send Money নির্বাচন করে রকেট নম্বর দিন: <strong>{rocketNum}</strong></p>
                <p>৩. টাকার পরিমাণ ও পিন দিয়ে সেন্ড করুন এবং প্রাপ্ত TrxID প্রদান করুন।</p>
              </div>
            </div>
          )}

          {/* Cash on Delivery */}
          {selectedTab === 'Cash on Delivery' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span>ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা দিন)</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  আপনাকে কোনো অগ্রিম পেমেন্ট করতে হবে না! কুরিয়ার ডেলিভারি ম্যান আপনার দেওয়া ঠিকানায় পার্সেল নিয়ে যাবেন, আপনি পার্সেল হাতে পেয়ে ডেলিভারি ম্যানকে সরাসরি নগদ মূল্য পরিশোধ করবেন।
                </p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1.5 text-stone-600">
                <div className="font-bold text-stone-800">জরুরি টিপস:</div>
                <p>• কুরিয়ার ম্যান আসার আগে আপনার মোবাইল ফোনে কল করবেন, তাই নম্বরটি সচল রাখুন।</p>
                <p>• সম্ভব হলে ভাংতি টাকা প্রস্তুত রাখুন যাতে ডেলিভারি দ্রুত সম্পন্ন হয়।</p>
              </div>
            </div>
          )}

          {/* CellFin / Bank Details */}
          {selectedTab === 'CellFin' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-sky-900 font-extrabold text-sm">
                  <Building className="w-5 h-5 text-[#0072BC]" />
                  <span>ব্যাংক ট্রান্সফার ও CellFin (IBBL)</span>
                </div>

                <div className="bg-white border border-sky-300 rounded-xl p-3 text-xs space-y-1 font-mono text-sky-950">
                  <div className="font-bold text-stone-900 mb-1">ব্যাংক বিবরণ:</div>
                  <p>{bankInfo}</p>
                  <p className="pt-1">CellFin ID / মোবাইল: <strong>{cellfinNum}</strong></p>
                </div>

                <button
                  onClick={() => handleCopy(`${bankInfo} | CellFin: ${cellfinNum}`, 'bank')}
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-[#0072BC] hover:bg-[#005c99] text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  {copiedField === 'bank' ? 'ব্যাংক বিবরণ কপি হয়েছে' : 'ব্যাংক বিবরণ কপি করুন'}
                </button>
              </div>
            </div>
          )}

          {/* Card / SSLCommerz */}
          {selectedTab === 'Card' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-stone-100 border border-stone-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-extrabold text-sm">
                  <CreditCard className="w-5 h-5 text-stone-700" />
                  <span>Visa, Mastercard, Amex ও অনলাইন কার্ড</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  সবধরনের বাংলাদেশি ও আন্তর্জাতিক ডেবিট/ক্রেডিট কার্ডের মাধ্যমে পেমেন্ট করতে পারবেন। অর্ডার প্লেস করার পর SSLCommerz বা নিরাপদ ব্যাংক গেটওয়েতে রিডাইরেক্ট করা হবে।
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>১০০% নিরাপদ ও ভেরিফাইড পেমেন্ট</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#E85D2C] hover:bg-[#cf4e1f] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            {language === 'bn' ? 'বুঝেছি / সম্পন্ন' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
