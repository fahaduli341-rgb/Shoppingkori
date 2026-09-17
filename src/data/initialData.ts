import { Product, FaqItem, JournalPost } from '../types';

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_ORDERS: any[] = [];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Do I need an account to order?',
    answer: 'No, you do not need an account to place an order. You can easily checkout with your mobile number and address. However, creating an account helps you track past orders, save items to your wishlist, and checkout faster.'
  },
  {
    id: 'faq-2',
    question: 'Can I change or cancel my order after placing it?',
    answer: 'Yes! You can cancel or update your order before it is dispatched by contacting our customer support via phone or WhatsApp (+8809600000000) with your Order ID.'
  },
  {
    id: 'faq-3',
    question: 'Which payment methods can I use?',
    answer: 'We support Cash on Delivery (COD) across all 64 districts in Bangladesh, as well as digital payments via bKash, Nagad, Rocket, and Visa/Mastercard debit and credit cards.'
  },
  {
    id: 'faq-4',
    question: 'Is it safe to pay by card?',
    answer: 'Yes, completely safe. Card details go straight through certified PCI-DSS compliant Bangladesh payment gateways (SSLCommerz/ShurjoPay). We never store your card numbers or PINs.'
  },
  {
    id: 'faq-5',
    question: 'How long will my order take?',
    answer: 'Deliveries inside Dhaka typically take 24 to 48 hours. Deliveries outside Dhaka to any district or upazila take 2 to 4 business days via reliable courier partners.'
  },
  {
    id: 'faq-6',
    question: 'How much does delivery cost?',
    answer: 'Regular delivery inside Dhaka is BDT 60. Delivery to anywhere outside Dhaka across Bangladesh is BDT 120.'
  }
];

export const JOURNAL_POSTS: JournalPost[] = [
  {
    id: 'j-1',
    title: 'Cash on delivery, now nationwide across Bangladesh',
    category: 'NEWS',
    excerpt: 'Pay only when your parcel reaches your hand. Enjoy safe and reliable door-to-door delivery in all 64 districts.',
    date: '10 Sep 2026',
    readTime: '1 min read',
    coverColor: 'from-emerald-800 to-green-700'
  },
  {
    id: 'j-2',
    title: 'How to store authentic Bengali spices to keep their aroma',
    category: 'BUYING GUIDE',
    excerpt: 'Light, heat and air are enemies of ground spice. Here is how to keep your Radhuni spices and mustard oils fresh.',
    date: '08 Sep 2026',
    readTime: '2 min read',
    coverColor: 'from-amber-700 to-orange-600'
  },
  {
    id: 'j-3',
    title: 'Smart tips to save electricity on home appliances',
    category: 'GUIDE',
    excerpt: 'Simple maintenance habits for your Walton rice cooker, irons, and refrigerators that cut your monthly utility bills.',
    date: '04 Sep 2026',
    readTime: '3 min read',
    coverColor: 'from-teal-800 to-cyan-700'
  }
];

export const BANGLADESH_DIVISIONS = [
  { name: 'Dhaka', districts: ['Dhaka City', 'Gazipur', 'Narayanganj', 'Tangail', 'Manikganj', 'Faridpur', 'Narsingdi'] },
  { name: 'Chittagong', districts: ['Chittagong City', 'Cox\'s Bazar', 'Cumilla', 'Feni', 'Noakhali', 'Brahmanbaria'] },
  { name: 'Rajshahi', districts: ['Rajshahi City', 'Bogura', 'Pabna', 'Sirajganj', 'Naogaon', 'Natore'] },
  { name: 'Khulna', districts: ['Khulna City', 'Jashore', 'Kushtia', 'Satkhira', 'Bagerhat', 'Jhenaidah'] },
  { name: 'Sylhet', districts: ['Sylhet City', 'Moulvibazar', 'Habiganj', 'Sunamganj'] },
  { name: 'Barisal', districts: ['Barisal City', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokati'] },
  { name: 'Rangpur', districts: ['Rangpur City', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Nilphamari'] },
  { name: 'Mymensingh', districts: ['Mymensingh City', 'Jamalpur', 'Netrokona', 'Sherpur'] }
];
