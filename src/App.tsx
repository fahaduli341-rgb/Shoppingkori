import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { SpecialOffers } from './components/SpecialOffers';
import { ShopWithConfidence } from './components/ShopWithConfidence';
import { ShopByCategory } from './components/ShopByCategory';
import { BestSellers } from './components/BestSellers';
import { JournalSection } from './components/JournalSection';
import { FaqSection } from './components/FaqSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AllProductsView } from './components/AllProductsView';
import { CartView } from './components/CartView';
import { WishlistView } from './components/WishlistView';
import { AccountView } from './components/AccountView';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PaymentInstructionsModal } from './components/PaymentInstructionsModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, toast, showPaymentGuideModal, setShowPaymentGuideModal } = useShop();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <main>
            <HeroSlider />
            <SpecialOffers />
            <ShopWithConfidence />
            <ShopByCategory />
            <BestSellers />
            <JournalSection />
            <FaqSection />
            <NewsletterSection />
          </main>
        );
      case 'products':
        return <AllProductsView />;
      case 'cart':
        return <CartView />;
      case 'wishlist':
        return <WishlistView />;
      case 'account':
        return <AccountView />;
      case 'tracking':
        return <OrderTrackingModal />;
      case 'admin':
        return <AdminPanel />;
      default:
        return null;
    }
  };

  const isAdminView = currentView === 'admin';

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col font-sans text-stone-900 selection:bg-orange-200 selection:text-orange-900">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg border text-xs sm:text-sm font-semibold max-w-sm ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-red-900 text-white border-red-700'
                : 'bg-stone-900 text-white border-stone-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Header (Hidden in Admin full screen view) */}
      {!isAdminView && <Header />}

      {/* Main View Container */}
      <div className="flex-1">
        {renderCurrentView()}
      </div>

      {/* Footer (Hidden in Admin full screen view) */}
      {!isAdminView && <Footer />}

      {/* Mobile Bottom Navigation (Hidden in Admin full screen view) */}
      {!isAdminView && <MobileBottomNav />}

      {/* Global Modals & Floating Tools */}
      <ProductDetailModal />
      <AdminLoginModal />
      <PaymentInstructionsModal
        isOpen={showPaymentGuideModal}
        onClose={() => setShowPaymentGuideModal(false)}
      />
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ShopProvider>
        <MainLayout />
      </ShopProvider>
    </ErrorBoundary>
  );
}
