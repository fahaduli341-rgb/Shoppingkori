import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to Shopping Kori newsletter!', 'success');
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-[#155e3c] text-white rounded-3xl p-6 sm:p-10 md:p-12 text-center shadow-lg relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/20 blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-emerald-700/30 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
          {/* Icon Circle matching screenshot */}
          <div className="w-12 h-12 rounded-full bg-emerald-800/80 border border-emerald-600/40 flex items-center justify-center text-emerald-200 mb-4 shadow-inner">
            <Mail className="w-5 h-5 stroke-[2]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Be first to know
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            New arrivals, offers and stock updates — no spam, unsubscribe any time.
          </p>

          {subscribed ? (
            <div className="mt-6 flex items-center gap-2 px-4 py-3 bg-emerald-800/80 border border-emerald-600 rounded-xl text-emerald-100 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Thank you! You have been subscribed to daily deals.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full mt-6 space-y-3">
              <input
                id="newsletter-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white text-stone-800 px-4 py-3 rounded-xl text-sm placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 shadow-xs"
                required
              />
              <button
                id="newsletter-subscribe-btn"
                type="submit"
                className="w-full py-3 px-6 bg-white hover:bg-emerald-50 active:scale-98 text-[#155e3c] font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-emerald-200/70 mt-4">
            We email about twice a month. Unsubscribe with one click, any time.
          </p>
        </div>
      </div>
    </section>
  );
};
