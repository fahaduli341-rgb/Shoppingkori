export type ProductCategory =
  | 'Fashion'
  | 'Electronics'
  | 'Home & Living'
  | 'Baby & Mom'
  | 'Beauty'
  | 'Accessories'
  | 'Groceries'
  | 'Clothes'
  | 'Home & Kitchen'
  | 'Health & Beauty'
  | 'Mobile Recharge'
  | 'Sports & Outdoor'
  | 'Books & Stationery'
  | 'Office & Computer'
  | 'Agriculture & Garden'
  | 'Auto Parts';

export interface CategoryDefinition {
  id: ProductCategory;
  nameEn: string;
  nameBn: string;
  iconName: string;
  subcategories: string[];
}

export interface ProductVariants {
  sizes?: string[];
  colors?: string[];
  storage?: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  tag?: 'NEW' | 'BEST SELLER' | 'HOT' | 'EXCLUSIVE';
  stock: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  sku: string;
  image: string;
  featured?: boolean;
  isSpecialOffer?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  unit?: string;
  variants?: ProductVariants;
  vendorId?: string;
  vendorName?: string;
  lowStockThreshold?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export type CourierProvider =
  | 'Steadfast'
  | 'Pathao'
  | 'RedX'
  | 'Sundarban'
  | 'Merchant Fleet';

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'bKash'
  | 'Nagad'
  | 'Rocket'
  | 'CellFin'
  | 'Card';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  vendorName?: string;
}

export interface Order {
  id: string;
  customerName: string;
  email?: string;
  phone: string;
  division: string;
  district: string;
  address: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Unpaid' | 'Paid';
  deliveryZone: 'Inside Dhaka' | 'Outside Dhaka';
  shippingCost: number;
  subtotal: number;
  discountAmount?: number;
  couponCode?: string;
  totalAmount: number;
  items: OrderItem[];
  status: OrderStatus;
  courier?: CourierProvider;
  courierTrackingId?: string;
  customerRiskScore?: 'Verified (High Trust)' | 'New Customer' | 'High Return Risk';
  adminNotes?: string;
  createdAt: string;
  estimatedDelivery: string;
}

export interface Vendor {
  id: string;
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  status: 'Active' | 'Pending' | 'Suspended';
  commissionRate: number; // e.g. 5%
  rating: number;
  productsCount: number;
  totalSales: number;
  joinedDate: string;
}

export interface Coupon {
  code: string;
  discount: number; // in BDT
  minOrder: number;
  description: string;
  isActive: boolean;
}

export type AdminRole = 'Super Admin' | 'Order Manager' | 'Product Manager' | 'Vendor Partner';

export type Language = 'bn' | 'en';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface JournalPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  coverColor: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  announcement: string;
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  freeShippingThreshold: number;
  enableFreeShipping: boolean;
  showFloatingWhatsApp: boolean;
  facebookUrl?: string;
  adminPassword?: string;
  primaryColor?: string;
  secondaryColor?: string;
  updatedAt?: string;
}

export const defaultStoreSettings: StoreSettings = {
  storeName: 'Shopping Kori',
  tagline: 'ঘরে বসে, বাজার করি',
  whatsappNumber: '+8801700000000',
  phone: '+8809600000000',
  email: 'support@shoppingkori.com',
  address: 'Dhaka, Bangladesh',
  announcement: '100% Genuine Products & Cash on Delivery Available Across Bangladesh',
  deliveryInsideDhaka: 60,
  deliveryOutsideDhaka: 120,
  freeShippingThreshold: 1500,
  enableFreeShipping: true,
  showFloatingWhatsApp: true,
  facebookUrl: 'https://facebook.com',
  adminPassword: 'admin123456',
  primaryColor: '#E85D2C',
  secondaryColor: '#1F6F4A'
};

export type AppView =
  | 'home'
  | 'products'
  | 'cart'
  | 'wishlist'
  | 'account'
  | 'tracking'
  | 'admin'
  | 'terms'
  | 'privacy'
  | 'returns'
  | 'about';
