import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { storeSettings, currentView } = useShop();
  const [showTooltip, setShowTooltip] = useState(false);

  // Do not show on admin panel to prevent interference with admin inputs
  if (currentView === 'admin' || !storeSettings.showFloatingWhatsApp || !storeSettings.whatsappNumber) {
    return null;
  }

  const cleanNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(`Hello ${storeSettings.storeName}, I have a question about an order / product.`)}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 select-none group">
      {/* Tooltip / Prompt bubble */}
      <div className="hidden sm:flex items-center gap-1.5 bg-white text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-stone-200 transition-all opacity-95 group-hover:opacity-100">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Chat on WhatsApp</span>
      </div>

      {/* Floating Action Button */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white flex items-center justify-center shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-600/40 transition-all duration-200 cursor-pointer relative"
      >
        <MessageCircle className="w-7 h-7 fill-white/20" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
      </a>
    </div>
  );
};
