import React from 'react';
import { Check, ShieldCheck, Banknote, PackageCheck, RotateCcw, Headphones } from 'lucide-react';

export const ShopWithConfidence: React.FC = () => {
  const trustPoints = [
    {
      title: 'Genuine products',
      description: 'Sourced from brands and authorised distributors',
      icon: Check
    },
    {
      title: 'Secure payment',
      description: 'Card details go straight to the payment provider, never to us',
      icon: ShieldCheck
    },
    {
      title: 'Cash on delivery',
      description: 'Pay only when your parcel arrives at your doorstep',
      icon: Banknote
    },
    {
      title: 'Fast delivery',
      description: 'Checked and packed securely before courier dispatch',
      icon: PackageCheck
    },
    {
      title: 'Easy returns',
      description: 'Simple hassle-free 7-day exchange and replacement policy',
      icon: RotateCcw
    },
    {
      title: 'Support anytime',
      description: 'Friendly customer helpline and instant WhatsApp service',
      icon: Headphones
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Header matching Screenshot_20260916-121151 */}
      <div className="text-center max-w-lg mx-auto mb-6 sm:mb-8">
        <div className="w-12 h-1 bg-gradient-to-r from-emerald-600 to-amber-500 mx-auto rounded-full mb-3" />
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
          Shop with confidence
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          How we handle your order, your money and your returns
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {trustPoints.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-800 tracking-tight">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
