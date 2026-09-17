import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/initialData';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      {/* Header matching Screenshot_20260916-121219 */}
      <div className="text-center mb-6">
        <span className="text-[11px] font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full">
          Help
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight mt-2">
          Frequently asked questions
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Answers to what customers ask most
        </p>
      </div>

      {/* Accordion Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="transition-colors">
              <button
                id={`faq-toggle-${item.id}`}
                onClick={() => toggleFaq(item.id)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 group"
              >
                <span className="text-sm font-bold text-stone-800 group-hover:text-orange-600 transition-colors">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-orange-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-stone-600 leading-relaxed animate-in fade-in duration-150">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
