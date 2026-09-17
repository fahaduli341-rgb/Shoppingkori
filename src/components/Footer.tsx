import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setShowAdminLoginModal, isAdminLoggedIn, storeSettings } = useShop();
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const cleanWhatsApp = storeSettings.whatsappNumber ? storeSettings.whatsappNumber.replace(/[^0-9]/g, '') : '';

  const handleFooterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribeEmail) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#155e3c] text-emerald-50 pt-12 pb-24 md:pb-12 border-t border-emerald-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top Info Banner matching Screenshot_20260916-121309 */}
        <div className="border-b border-emerald-700/60 pb-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-xs">
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-white">
                Shopping Kori
              </h3>
              <p className="text-xs text-emerald-200">Shop from Home</p>
            </div>
          </div>

          <p className="text-sm text-emerald-100/90 max-w-xl leading-relaxed mb-5">
            A trusted online marketplace bringing everyday essentials to your door across Bangladesh.
          </p>

          {/* Value props */}
          <div className="flex flex-wrap gap-4 sm:gap-6 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-400" />
              <span>Fast delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-orange-400" />
              <span>Easy returns</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-xs sm:text-sm">
          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-emerald-100/80">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setCurrentView('products');
                  }}
                  className="hover:text-white transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setCurrentView('products');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Offers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('tracking')}
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('account')}
                  className="hover:text-white transition-colors"
                >
                  Account
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-emerald-100/80">
              <li>
                <button
                  onClick={() => setCurrentView('account')}
                  className="hover:text-white transition-colors"
                >
                  Support
                </button>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">
                  Frequently asked questions
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Blog</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">
                  Download catalogue (PDF)
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">
                  Delivery information
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">
                  Return and refund policy
                </span>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-4">
              Policies
            </h4>
            <ul className="space-y-2.5 text-emerald-100/80">
              <li>
                <span className="hover:text-white cursor-pointer">
                  Privacy policy
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">
                  Terms and conditions
                </span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                Merchant Portal
              </h4>
              <button
                id="footer-admin-login-btn"
                onClick={() => {
                  if (isAdminLoggedIn) {
                    setCurrentView('admin');
                  } else {
                    setShowAdminLoginModal(true);
                  }
                }}
                className="flex items-center gap-1.5 text-emerald-300/80 hover:text-white py-1 text-xs"
              >
                <Lock className="w-3.5 h-3.5 text-orange-400" />
                <span>Seller Center & Admin</span>
              </button>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-emerald-100/80">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`tel:${storeSettings.phone}`} className="hover:text-white transition-colors">
                  {storeSettings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-300 shrink-0" />
                {cleanWhatsApp ? (
                  <a
                    href={`https://wa.me/${cleanWhatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors underline decoration-emerald-500/50"
                  >
                    WhatsApp ({storeSettings.whatsappNumber})
                  </a>
                ) : (
                  <span>WhatsApp ({storeSettings.whatsappNumber})</span>
                )}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`mailto:${storeSettings.email}`} className="break-all hover:text-white transition-colors">
                  {storeSettings.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{storeSettings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter In Footer */}
        <div className="border-t border-emerald-700/60 pt-6 pb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
            Get offers by email
          </h4>
          <p className="text-xs text-emerald-200 mb-3">
            Offers and new arrivals, straight to your inbox.
          </p>
          <form onSubmit={handleFooterSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
            <input
              id="footer-email-input"
              type="email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder="Email"
              className="bg-emerald-900/80 border border-emerald-600 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white placeholder-emerald-400 focus:outline-hidden focus:border-amber-400 flex-1"
            />
            <button
              id="footer-subscribe-btn"
              type="submit"
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* Bottom Payment Badges & Copyright */}
        <div className="border-t border-emerald-700/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-300">
          <div>
            © 2026 Shopping Kori. All rights reserved.
          </div>

          {/* Payment Methods Badges matching Screenshot_20260916-121212 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-emerald-200 mr-1">We accept</span>
            <span className="px-2.5 py-1 bg-white text-stone-800 rounded-md font-bold text-[11px] shadow-2xs">
              bKash
            </span>
            <span className="px-2.5 py-1 bg-white text-stone-800 rounded-md font-bold text-[11px] shadow-2xs">
              Nagad
            </span>
            <span className="px-2.5 py-1 bg-white text-stone-800 rounded-md font-bold text-[11px] shadow-2xs">
              Rocket
            </span>
            <span className="px-2.5 py-1 bg-white text-stone-800 rounded-md font-bold text-[11px] shadow-2xs">
              Card
            </span>
            <span className="px-2.5 py-1 bg-white text-stone-800 rounded-md font-bold text-[11px] shadow-2xs">
              Cash on delivery
            </span>
          </div>

          <div className="text-[11px] text-emerald-400">
            Shopping Kori Bangladesh
          </div>
        </div>
      </div>
    </footer>
  );
};
