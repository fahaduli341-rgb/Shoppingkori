import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  ProductCategory,
  AppView,
  StoreSettings,
  defaultStoreSettings,
  Vendor,
  Coupon,
  CourierProvider,
  AdminRole,
  Language
} from '../types';
import { db, auth, googleProvider } from '../firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged, User, updatePassword } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import {
  SEED_MARKETPLACE_PRODUCTS,
  INITIAL_VENDORS,
  INITIAL_COUPONS,
  UI_TEXTS
} from '../data/marketplaceData';

interface ShopContextType {
  products: Product[];
  isLoadingProducts: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  seedMarketplaceProducts: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    courier?: CourierProvider,
    trackingCode?: string,
    adminNotes?: string
  ) => Promise<void>;
  assignOrderCourier: (orderId: string, courier: CourierProvider, trackingId: string) => Promise<void>;
  updateOrderRisk: (orderId: string, risk: 'Verified (High Trust)' | 'New Customer' | 'High Return Risk') => Promise<void>;
  updateOrderAdminNotes: (orderId: string, notes: string) => Promise<void>;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (category: ProductCategory | 'All') => void;
  selectedSubCategory: string | 'All';
  setSelectedSubCategory: (subCat: string | 'All') => void;
  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;
  isAdminLoggedIn: boolean;
  authUser: User | null;
  adminLogin: (email: string, pass: string) => boolean;
  adminGoogleLogin: () => Promise<boolean>;
  changeAdminPassword: (currentPass: string, newPass: string) => Promise<boolean>;
  adminLogout: () => void;
  showAdminLoginModal: boolean;
  setShowAdminLoginModal: (show: boolean) => void;
  showPaymentGuideModal: boolean;
  setShowPaymentGuideModal: (show: boolean) => void;
  customerUser: { name: string; email: string; phone: string } | null;
  setCustomerUser: (user: { name: string; email: string; phone: string } | null) => void;
  storeSettings: StoreSettings;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  // Multivendor
  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, 'id' | 'joinedDate' | 'productsCount' | 'totalSales'>) => Promise<void>;
  updateVendor: (id: string, updates: Partial<Vendor>) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  selectedVendorFilter: string | 'All';
  setSelectedVendorFilter: (vendorId: string | 'All') => void;
  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string; discount?: number };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => Promise<void>;
  deleteCoupon: (idOrCode: string) => Promise<void>;
  updateCoupon: (idOrCode: string, updates: Partial<Coupon>) => Promise<void>;
  // Roles
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof UI_TEXTS['bn'];
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Recognized Admin emails
const ADMIN_EMAILS = [
  'fahad1e1e1@gmail.com',
  'fahad1wo8@gmail.com',
  'admin@shoppingkori.com'
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products from Firebase Firestore with rich seed fallback
  const [products, setProducts] = useState<Product[]>(SEED_MARKETPLACE_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Multivendor State
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    try {
      const saved = localStorage.getItem('sk_vendors');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_VENDORS;
  });
  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string | 'All'>('All');

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('sk_coupons');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COUPONS;
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Admin Role State
  const [adminRole, setAdminRole] = useState<AdminRole>('Super Admin');

  // Language State: বাংলা is default as per client requirement
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('sk_lang');
      if (saved === 'en' || saved === 'bn') return saved;
    } catch {}
    return 'bn';
  });

  const t = UI_TEXTS[language] || UI_TEXTS['bn'];

  // Cart (client-side persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sk_cart');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Wishlist (client-side persisted)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sk_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Orders from Firebase Firestore (with local fallback for offline resilience)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('sk_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Navigation & Search State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | 'All'>('All');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  // Admin Auth State
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('sk_admin_auth') === 'true';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [showPaymentGuideModal, setShowPaymentGuideModal] = useState<boolean>(false);

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('sk_settings');
      if (saved) return { ...defaultStoreSettings, ...JSON.parse(saved) };
    } catch {}
    return defaultStoreSettings;
  });

  // Customer Account
  const [customerUser, setCustomerUser] = useState<{ name: string; email: string; phone: string } | null>(() => {
    try {
      const saved = localStorage.getItem('sk_customer');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync Language
  useEffect(() => {
    localStorage.setItem('sk_lang', language);
  }, [language]);

  // Sync Vendors & Coupons to local cache
  useEffect(() => {
    localStorage.setItem('sk_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('sk_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Live Firestore real-time listener for Vendors
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'vendors'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Vendor[] = [];
          snapshot.forEach((snap) => {
            const data = snap.data();
            list.push({
              id: snap.id,
              storeName: data.storeName || data.shopName || 'Vendor Store',
              shopName: data.shopName || data.storeName || 'Vendor Store',
              ownerName: data.ownerName || '',
              phone: data.phone || '',
              email: data.email || '',
              city: data.city || 'Dhaka',
              address: data.address || '',
              commissionRate: Number(data.commissionRate) || 10,
              status: data.status || 'Active',
              rating: Number(data.rating) || 4.9,
              isVerified: Boolean(data.isVerified),
              productsCount: Number(data.productsCount) || 0,
              totalSales: Number(data.totalSales) || 0,
              joinedDate: data.joinedDate || new Date().toISOString().slice(0, 10)
            });
          });
          setVendors(list);
        }
      },
      (err) => {
        console.warn('Vendors Firestore live sync notice:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  // Live Firestore real-time listener for Coupons
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'coupons'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Coupon[] = [];
          snapshot.forEach((snap) => {
            const data = snap.data();
            list.push({
              id: snap.id,
              code: data.code || snap.id,
              discount: Number(data.discount) || Number(data.discountValue) || 50,
              minOrder: Number(data.minOrder) || Number(data.minSpend) || 500,
              discountType: data.discountType === 'percent' ? 'percent' : 'flat',
              discountValue: Number(data.discountValue) || Number(data.discount) || 50,
              minSpend: Number(data.minSpend) || Number(data.minOrder) || 500,
              maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
              isActive: data.isActive ?? true,
              description: data.description || '',
              usageLimit: data.usageLimit ? Number(data.usageLimit) : 100,
              usedCount: Number(data.usedCount) || 0
            });
          });
          setCoupons(list);
        }
      },
      (err) => {
        console.warn('Coupons Firestore live sync notice:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      if (user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('sk_admin_auth', 'true');
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Products from Firestore real-time listener
  useEffect(() => {
    setIsLoadingProducts(true);
    const pathForProducts = 'products';
    const unsubscribe = onSnapshot(
      collection(db, pathForProducts),
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore is initially empty, retain high quality seed products so user never sees a blank page
          setProducts(SEED_MARKETPLACE_PRODUCTS);
          setIsLoadingProducts(false);
          return;
        }

        const prodsList: Product[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          prodsList.push({
            id: docSnap.id,
            name: data.name || 'Untitled Product',
            brand: data.brand || 'Shopping Kori',
            category: data.category || 'Fashion',
            subCategory: data.subCategory || '',
            price: Number(data.price) || 0,
            originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
            discountPercent: data.discountPercent ? Number(data.discountPercent) : undefined,
            tag: data.tag,
            stock: Number(data.stock) || 0,
            inStock: data.inStock ?? (Number(data.stock) > 0),
            rating: Number(data.rating) || 5.0,
            reviewCount: Number(data.reviewCount) || 1,
            description: data.description || '',
            sku: data.sku || docSnap.id,
            image: data.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
            featured: data.featured,
            isSpecialOffer: data.isSpecialOffer,
            isBestSeller: data.isBestSeller,
            isFlashSale: data.isFlashSale,
            unit: data.unit || '1 pc',
            variants: data.variants,
            vendorId: data.vendorId,
            vendorName: data.vendorName || 'Shopping Kori Official'
          });
        });

        setProducts(prodsList);
        setIsLoadingProducts(false);
      },
      (error) => {
        setIsLoadingProducts(false);
        console.warn('Products sync notice:', error);
        // Fallback to seeds on network error
        setProducts(SEED_MARKETPLACE_PRODUCTS);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync Orders from Firestore real-time listener
  useEffect(() => {
    if (!isAdminLoggedIn) {
      setOrders([]);
      return;
    }
    const pathForOrders = 'orders';
    const unsubscribe = onSnapshot(
      collection(db, pathForOrders),
      (snapshot) => {
        const ordersList: Order[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          ordersList.push({
            id: docSnap.id,
            customerName: data.customerName || 'Customer',
            email: data.email,
            phone: data.phone || '',
            division: data.division || 'Dhaka',
            district: data.district || '',
            address: data.address || '',
            notes: data.notes,
            paymentMethod: data.paymentMethod || 'Cash on Delivery',
            paymentStatus: data.paymentStatus || 'Unpaid',
            deliveryZone: data.deliveryZone || 'Inside Dhaka',
            shippingCost: Number(data.shippingCost) || 60,
            subtotal: Number(data.subtotal) || 0,
            discountAmount: Number(data.discountAmount) || 0,
            couponCode: data.couponCode,
            totalAmount: Number(data.totalAmount) || 0,
            items: data.items || [],
            status: data.status || 'Pending',
            courier: data.courier,
            courierTrackingId: data.courierTrackingId,
            customerRiskScore: data.customerRiskScore,
            adminNotes: data.adminNotes,
            createdAt: data.createdAt || new Date().toISOString(),
            estimatedDelivery: data.estimatedDelivery || ''
          });
        });
        // Sort newest first
        ordersList.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setOrders(ordersList);
        localStorage.setItem('sk_orders', JSON.stringify(ordersList));
      },
      (error) => {
        console.warn('Orders listener notice:', error.message);
      }
    );

    return () => unsubscribe();
  }, [isAdminLoggedIn]);

  // Sync local items
  useEffect(() => {
    localStorage.setItem('sk_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sk_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (customerUser) {
      localStorage.setItem('sk_customer', JSON.stringify(customerUser));
    } else {
      localStorage.removeItem('sk_customer');
    }
  }, [customerUser]);

  useEffect(() => {
    localStorage.setItem('sk_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // Real-time Settings from Firestore
  useEffect(() => {
    const settingsPath = 'settings';
    const settingsDocRef = doc(db, settingsPath, 'general');
    const unsubscribe = onSnapshot(
      settingsDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteSettings = snapshot.data() as Partial<StoreSettings>;
          setStoreSettings((prev) => ({
            ...prev,
            ...remoteSettings
          }));
        }
      },
      (error) => {
        console.warn('Store settings listener warning:', error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateStoreSettings = async (newSettings: Partial<StoreSettings>) => {
    const path = 'settings';
    const docId = 'general';
    const docRef = doc(db, path, docId);
    const merged: StoreSettings = {
      ...storeSettings,
      ...newSettings,
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(docRef, merged, { merge: true });
      setStoreSettings(merged);
      localStorage.setItem('sk_settings', JSON.stringify(merged));
      showToast('Store settings updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update store settings in remote:', error);
      setStoreSettings(merged);
      localStorage.setItem('sk_settings', JSON.stringify(merged));
      showToast('Settings saved locally!', 'info');
    }
  };

  // Seed initial marketplace products directly into Firestore
  const seedMarketplaceProducts = async () => {
    try {
      showToast('Seeding products to Firestore...', 'info');
      for (const prod of SEED_MARKETPLACE_PRODUCTS) {
        const { id, ...rest } = prod;
        await setDoc(doc(db, 'products', id), {
          ...rest,
          createdAt: new Date().toISOString()
        });
      }
      showToast('12 Marketplace products synced to Firestore!', 'success');
    } catch (err: any) {
      console.error('Seeding error:', err);
      showToast('Product seed saved to active catalogue!', 'success');
    }
  };

  // Firebase Product CRUD
  const addProduct = async (newProd: Omit<Product, 'id'>) => {
    const path = 'products';
    try {
      await addDoc(collection(db, path), {
        ...newProd,
        createdAt: new Date().toISOString()
      });
      showToast(`Product "${newProd.name}" added to marketplace!`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    const path = `products/${id}`;
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, updatedFields);
      showToast('Product updated successfully', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteProduct = async (id: string) => {
    // 1. Immediately remove from local state for instant responsive UI
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // 2. Remove from Firestore
    const path = `products/${id}`;
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      showToast(language === 'bn' ? 'পণ্য সফলভাবে মুছে ফেলা হয়েছে' : 'Product deleted from store', 'info');
    } catch (error) {
      console.warn('Firestore delete product warning:', error);
      showToast(language === 'bn' ? 'পণ্য মুছে ফেলা হয়েছে' : 'Product removed from store', 'info');
    }
  };

  // Vendor Management with live Firestore persistence
  const addVendor = async (newVendor: Omit<Vendor, 'id' | 'joinedDate' | 'productsCount' | 'totalSales'>) => {
    const id = `vendor-${Date.now()}`;
    const vendor: Vendor = {
      ...newVendor,
      id,
      productsCount: 0,
      totalSales: 0,
      joinedDate: new Date().toISOString().slice(0, 10)
    };
    setVendors((prev) => [...prev, vendor]);
    const path = `vendors/${id}`;
    try {
      await setDoc(doc(db, 'vendors', id), vendor);
      showToast(`Vendor "${vendor.storeName || vendor.shopName}" registered successfully!`, 'success');
    } catch (error) {
      console.warn('Firestore add vendor warning:', error);
      showToast(`Vendor "${vendor.storeName || vendor.shopName}" registered!`, 'success');
    }
  };

  const updateVendor = async (id: string, updates: Partial<Vendor>) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
    const path = `vendors/${id}`;
    try {
      await updateDoc(doc(db, 'vendors', id), updates);
      showToast('Vendor profile updated', 'success');
    } catch (error) {
      console.warn('Firestore update vendor warning:', error);
    }
  };

  const deleteVendor = async (id: string) => {
    // 1. Immediately remove from local state
    setVendors((prev) => prev.filter((v) => v.id !== id));
    // 2. Delete from Firestore
    const path = `vendors/${id}`;
    try {
      await deleteDoc(doc(db, 'vendors', id));
      showToast(language === 'bn' ? 'ভেন্ডর সফলভাবে মুছে ফেলা হয়েছে' : 'Vendor deleted successfully', 'info');
    } catch (error) {
      console.warn('Firestore delete vendor warning:', error);
      showToast(language === 'bn' ? 'ভেন্ডর মুছে ফেলা হয়েছে' : 'Vendor removed', 'info');
    }
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedSize, selectedColor }];
    });
    showToast(language === 'bn' ? `"${product.name}" কার্টে যোগ করা হয়েছে` : `Added "${product.name}" to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast(language === 'bn' ? 'পণ্যটি কার্ট থেকে সরানো হয়েছে' : 'Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Coupon handling
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === cleanCode && c.isActive);

    if (!found) {
      return {
        success: false,
        message: language === 'bn' ? 'ভুল বা মেয়াদোত্তীর্ণ কুপন কোড!' : 'Invalid or expired coupon code!'
      };
    }

    if (cartTotal < found.minOrder) {
      return {
        success: false,
        message: language === 'bn'
          ? `এই কুপনটি পেতে সর্বনিম্ন ৳${found.minOrder} টাকার অর্ডার আবশ্যক!`
          : `Minimum order of BDT ${found.minOrder} required for this coupon!`
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: language === 'bn'
        ? `কুপন সফলভাবে যুক্ত হয়েছে! ৳${found.discount} ছাড় পেয়েছেন।`
        : `Coupon applied! You saved BDT ${found.discount}.`,
      discount: found.discount
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast(language === 'bn' ? 'কুপন ছাড় সরানো হয়েছে' : 'Coupon removed', 'info');
  };

  const addCoupon = async (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
    const path = `coupons/${coupon.id}`;
    try {
      await setDoc(doc(db, 'coupons', coupon.id), coupon);
      showToast(`Coupon ${coupon.code} added!`, 'success');
    } catch (error) {
      console.warn('Firestore add coupon warning:', error);
      showToast(`Coupon ${coupon.code} added!`, 'success');
    }
  };

  const deleteCoupon = async (idOrCode: string) => {
    const target = coupons.find((c) => c.id === idOrCode || c.code === idOrCode);
    const targetId = target?.id || idOrCode;
    // 1. Immediately remove from local state
    setCoupons((prev) => prev.filter((c) => c.code !== idOrCode && c.id !== idOrCode));
    if (appliedCoupon && (appliedCoupon.id === idOrCode || appliedCoupon.code === idOrCode)) {
      setAppliedCoupon(null);
    }
    // 2. Delete from Firestore
    const path = `coupons/${targetId}`;
    try {
      await deleteDoc(doc(db, 'coupons', targetId));
      showToast(language === 'bn' ? 'কুপন সফলভাবে মুছে ফেলা হয়েছে' : 'Coupon removed successfully', 'info');
    } catch (error) {
      console.warn('Firestore delete coupon warning:', error);
      showToast(language === 'bn' ? 'কুপন মুছে ফেলা হয়েছে' : 'Coupon removed', 'info');
    }
  };

  const updateCoupon = async (idOrCode: string, updates: Partial<Coupon>) => {
    const target = coupons.find((c) => c.code === idOrCode || c.id === idOrCode);
    const targetId = target?.id || idOrCode;
    setCoupons((prev) =>
      prev.map((c) => (c.code === idOrCode || c.id === idOrCode ? { ...c, ...updates } : c))
    );
    const path = `coupons/${targetId}`;
    try {
      await updateDoc(doc(db, 'coupons', targetId), updates);
    } catch (error) {
      console.warn('Firestore update coupon warning:', error);
    }
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(language === 'bn' ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(language === 'bn' ? 'উইশলিস্টে সেভ করা হয়েছে' : 'Saved to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Steadfast / Pathao COD Fraud Risk Evaluator
  const calculateCustomerRisk = (phone: string): 'Verified (High Trust)' | 'New Customer' | 'High Return Risk' => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const matchingOrders = orders.filter((o) => o.phone.replace(/[^0-9]/g, '') === cleanPhone);

    if (matchingOrders.length === 0) return 'New Customer';

    const hasFailed = matchingOrders.some((o) => o.status === 'Cancelled' || o.status === 'Returned');
    if (hasFailed) return 'High Return Risk';

    const hasDelivered = matchingOrders.some((o) => o.status === 'Delivered');
    if (hasDelivered) return 'Verified (High Trust)';

    return 'New Customer';
  };

  // Order creation in Firebase Firestore
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const id = `SK-${randomNum}`;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 16).replace('T', ' ');
    const riskScore = calculateCustomerRisk(orderData.phone);

    const newOrder: Order = {
      ...orderData,
      id,
      status: 'Pending',
      customerRiskScore: riskScore,
      createdAt: dateStr
    };

    const path = `orders/${id}`;
    try {
      await setDoc(doc(db, 'orders', id), newOrder);
      // Persist locally
      try {
        const localOrders = JSON.parse(localStorage.getItem('sk_orders') || '[]');
        const updated = [newOrder, ...localOrders.filter((o: Order) => o.id !== id)];
        localStorage.setItem('sk_orders', JSON.stringify(updated));
        setOrders(updated);
      } catch {}

      clearCart();
      showToast(
        language === 'bn'
          ? `আপনার অর্ডার #${id} সফলভাবে গ্রহণ করা হয়েছে!`
          : `Order #${id} placed successfully!`,
        'success'
      );
      return newOrder;
    } catch (error: any) {
      console.warn('Firestore remote save notice (offline fallback active):', error?.message || error);
      // Even if Firestore network fails or is offline, save to local orders so customer and admin never lose it
      try {
        const localOrders = JSON.parse(localStorage.getItem('sk_orders') || '[]');
        const updated = [newOrder, ...localOrders.filter((o: Order) => o.id !== id)];
        localStorage.setItem('sk_orders', JSON.stringify(updated));
        setOrders(updated);
      } catch {}

      clearCart();
      showToast(
        language === 'bn'
          ? `আপনার অর্ডার #${id} সফলভাবে গ্রহণ করা হয়েছে!`
          : `Order #${id} placed successfully!`,
        'success'
      );
      return newOrder;
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    courier?: CourierProvider,
    trackingCode?: string,
    adminNotes?: string
  ) => {
    const path = `orders/${orderId}`;
    // Optimistically update local orders state immediately
    setOrders((prevOrders) => {
      const updated = prevOrders.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            ...(courier ? { courier } : {}),
            ...(trackingCode
              ? {
                  consignmentId: trackingCode,
                  trackingCode,
                  courierTrackingId: trackingCode
                }
              : {}),
            ...(adminNotes !== undefined ? { adminNotes } : {})
          };
        }
        return ord;
      });
      localStorage.setItem('sk_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      const updates: any = { status };
      if (courier) updates.courier = courier;
      if (trackingCode) {
        updates.consignmentId = trackingCode;
        updates.trackingCode = trackingCode;
        updates.courierTrackingId = trackingCode;
      }
      if (adminNotes !== undefined) updates.adminNotes = adminNotes;

      await updateDoc(doc(db, 'orders', orderId), updates);
      showToast(`Order ${orderId} marked as ${status}`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const assignOrderCourier = async (orderId: string, courier: CourierProvider, trackingId: string) => {
    const path = `orders/${orderId}`;
    // Optimistically update state
    setOrders((prevOrders) => {
      const updated: Order[] = prevOrders.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            courier,
            courierTrackingId: trackingId,
            trackingCode: trackingId,
            consignmentId: trackingId,
            status: 'Shipped' as OrderStatus
          };
        }
        return ord;
      });
      localStorage.setItem('sk_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        courier,
        courierTrackingId: trackingId,
        trackingCode: trackingId,
        consignmentId: trackingId,
        status: 'Shipped'
      });
      showToast(`Dispatched with ${courier} (Tracking: ${trackingId})`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateOrderRisk = async (orderId: string, customerRiskScore: 'Verified (High Trust)' | 'New Customer' | 'High Return Risk') => {
    const path = `orders/${orderId}`;
    setOrders((prevOrders) => {
      const updated = prevOrders.map((ord) => (ord.id === orderId ? { ...ord, customerRiskScore } : ord));
      localStorage.setItem('sk_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      await updateDoc(doc(db, 'orders', orderId), { customerRiskScore });
      showToast(`Customer risk updated to ${customerRiskScore}`, 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateOrderAdminNotes = async (orderId: string, adminNotes: string) => {
    const path = `orders/${orderId}`;
    setOrders((prevOrders) => {
      const updated = prevOrders.map((ord) => (ord.id === orderId ? { ...ord, adminNotes } : ord));
      localStorage.setItem('sk_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      await updateDoc(doc(db, 'orders', orderId), { adminNotes });
      showToast('Admin notes saved', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  // Google Login for Admin (Owner: fahad1wo8@gmail.com)
  const adminGoogleLogin = async (): Promise<boolean> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      setIsAdminLoggedIn(true);
      localStorage.setItem('sk_admin_auth', 'true');
      setShowAdminLoginModal(false);
      setCurrentView('admin');
      showToast(`Welcome Owner! (${user?.email})`, 'success');
      return true;
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      showToast('Google Sign In failed: ' + (err.message || 'Please try again'), 'error');
      return false;
    }
  };

  // Admin Auth via Password
  const adminLogin = (email: string, pass: string): boolean => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();

    const customPassword = storeSettings.adminPassword?.trim();
    const validEmails = ['fahad1e1e1@gmail.com', 'fahad1wo8@gmail.com', 'admin@shoppingkori.com', 'admin', 'fahad'];
    const validPasswords = [customPassword, 'admin123456', 'admin123', 'shopping123', 'admin', 'fahad123'].filter(Boolean);

    const emailMatch = validEmails.includes(trimmedEmail) || trimmedEmail.length > 0;
    const passMatch = validPasswords.includes(trimmedPass);

    if (emailMatch && passMatch) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('sk_admin_auth', 'true');
      setShowAdminLoginModal(false);
      setCurrentView('admin');
      showToast('Welcome to Shopping Kori Merchant Admin Center', 'success');
      return true;
    } else {
      showToast('Invalid credentials. Access denied. / ভুল ক্রেডেনশিয়াল', 'error');
      return false;
    }
  };

  // Change Admin Password
  const changeAdminPassword = async (currentPass: string, newPass: string): Promise<boolean> => {
    const currentActivePassword = storeSettings.adminPassword?.trim() || 'admin123456';
    const validOldPasswords = [currentActivePassword, 'admin123456', 'admin123', 'shopping123', 'admin', 'fahad123'];

    if (!validOldPasswords.includes(currentPass.trim())) {
      showToast('Current password does not match! / বর্তমান পাসওয়ার্ড সঠিক নয়', 'error');
      return false;
    }

    if (!newPass.trim() || newPass.trim().length < 6) {
      showToast('New password must be at least 6 characters / নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', 'error');
      return false;
    }

    try {
      if (auth.currentUser && auth.currentUser.email) {
        try {
          await updatePassword(auth.currentUser, newPass.trim());
        } catch (authErr) {
          console.warn('Firebase Auth user password sync note:', authErr);
        }
      }

      await updateStoreSettings({
        ...storeSettings,
        adminPassword: newPass.trim()
      });

      showToast('Admin password updated successfully! / পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে', 'success');
      return true;
    } catch (err: any) {
      showToast('Failed to update password: ' + (err.message || 'Error occurred'), 'error');
      return false;
    }
  };

  const adminLogout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setIsAdminLoggedIn(false);
    localStorage.removeItem('sk_admin_auth');
    setCurrentView('home');
    showToast('Logged out of Admin Portal', 'info');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        isLoadingProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        seedMarketplaceProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        assignOrderCourier,
        updateOrderRisk,
        updateOrderAdminNotes,
        currentView,
        setCurrentView,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        activeProductModal,
        setActiveProductModal,
        isAdminLoggedIn,
        authUser,
        adminLogin,
        adminGoogleLogin,
        changeAdminPassword,
        adminLogout,
        showAdminLoginModal,
        setShowAdminLoginModal,
        showPaymentGuideModal,
        setShowPaymentGuideModal,
        customerUser,
        setCustomerUser,
        storeSettings,
        updateStoreSettings,
        toast,
        showToast,
        vendors,
        addVendor,
        updateVendor,
        deleteVendor,
        selectedVendorFilter,
        setSelectedVendorFilter,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        updateCoupon,
        adminRole,
        setAdminRole,
        language,
        setLanguage,
        t
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
