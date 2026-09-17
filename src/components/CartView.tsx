import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { BANGLADESH_DIVISIONS } from '../data/initialData';

export const CartView: React.FC = () => {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
    setCurrentView,
    customerUser,
    storeSettings
  } = useShop();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // Form fields
  const [fullName, setFullName] = useState(customerUser?.name || '');
  const [mobileNumber, setMobileNumber] = useState(customerUser?.phone || '');
  const [email, setEmail] = useState(customerUser?.email || '');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka City');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash' | 'Nagad'>('Cash on Delivery');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const insideDhakaFee = typeof storeSettings?.deliveryInsideDhaka === 'number' ? storeSettings.deliveryInsideDhaka : 60;
  const outsideDhakaFee = typeof storeSettings?.deliveryOutsideDhaka === 'number' ? storeSettings.deliveryOutsideDhaka : 120;
  const shippingCost = deliveryZone === 'Inside Dhaka' ? insideDhakaFee : outsideDhakaFee;
  const grandTotal = cartTotal + shippingCost;

  const currentDivisionObj = BANGLADESH_DIVISIONS.find((d) => d.name === division) || BANGLADESH_DIVISIONS[0];
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.trim().length < 11) {
      setErrorMsg('Please enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX)');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter your detailed delivery address');
      return;
    }

    setErrorMsg('');
    setIsSubmittingOrder(true);
    try {
      const newOrder = await createOrder({
        customerName: fullName.trim(),
        phone: mobileNumber.trim(),
        email: email.trim() || undefined,
        division,
        district,
        address: address.trim(),
        notes: notes.trim() || undefined,
        paymentMethod,
        paymentStatus: 'Unpaid',
        deliveryZone,
        shippingCost,
        subtotal: cartTotal,
        totalAmount: grandTotal,
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        })),
        estimatedDelivery: deliveryZone === 'Inside Dhaka' ? '24 - 48 Hours' : '2 - 4 Business Days'
      });

      setPlacedOrder(newOrder);
      setIsCheckoutOpen(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to place order. Please check your connection.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // If order was just placed, show confirmation screen
  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Order Confirmed!
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Thank you, <strong className="text-stone-800">{placedOrder.customerName}</strong>! Your order has been placed successfully.
          </p>

          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-left space-y-2.5 max-w-md mx-auto text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Order ID:</span>
              <span className="font-bold text-orange-600">{placedOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Contact Number:</span>
              <span className="font-medium text-stone-800">{placedOrder.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Delivery Address:</span>
              <span className="font-medium text-stone-800 text-right max-w-[220px] truncate">
                {placedOrder.address}, {placedOrder.district}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Payment:</span>
              <span className="font-medium text-stone-800">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-sm">
              <span>Total Payable:</span>
              <span className="text-orange-600">BDT {placedOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentView('tracking')}
              className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              Track Order Status
            </button>
            <button
              onClick={() => {
                setPlacedOrder(null);
                setCurrentView('products');
              }}
              className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart (Matching Screenshot_20260916-121212)
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight text-left mb-8">
          Shopping cart
        </h1>

        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-14 shadow-2xs max-w-md mx-auto flex flex-col items-center">
          {/* Cart Icon matching Screenshot_20260916-121212 */}
          <div className="w-20 h-20 rounded-full bg-blue-50/60 flex items-center justify-center text-sky-500 mb-5">
            <ShoppingCart className="w-10 h-10 stroke-[1.7]" />
          </div>

          <h2 className="text-xl font-extrabold text-stone-800 tracking-tight">
            Your cart is empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xs leading-relaxed">
            Browse our products and add something you like.
          </p>

          <button
            id="empty-cart-start-shopping"
            onClick={() => setCurrentView('products')}
            className="mt-6 px-8 py-3 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            Start shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Shopping cart
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 flex items-center gap-4 shadow-2xs hover:shadow-xs transition-shadow"
            >
              {/* Product Thumbnail */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-stone-50 rounded-xl p-2 shrink-0 flex items-center justify-center overflow-hidden border border-stone-100">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  {item.product.brand}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-stone-800 truncate">
                  {item.product.name}
                </h3>
                <div className="text-sm font-extrabold text-orange-600 mt-1">
                  BDT {item.product.price.toLocaleString()}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-stone-200 text-stone-600 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-stone-200 text-stone-600 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-stone-400 hover:text-red-500 rounded-md transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Item Subtotal */}
              <div className="text-right hidden sm:block">
                <span className="text-xs text-stone-400">Total</span>
                <div className="text-base font-extrabold text-stone-900">
                  BDT {(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs sticky top-24 space-y-5">
            <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Summary
            </h2>

            {/* Delivery Zone Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">
                Select Delivery Zone
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryZone('Inside Dhaka')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    deliveryZone === 'Inside Dhaka'
                      ? 'border-orange-500 bg-orange-50/70 text-orange-700'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <div>Inside Dhaka</div>
                  <div className="font-bold text-orange-600">BDT {insideDhakaFee}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryZone('Outside Dhaka')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    deliveryZone === 'Outside Dhaka'
                      ? 'border-orange-500 bg-orange-50/70 text-orange-700'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <div>Outside Dhaka</div>
                  <div className="font-bold text-orange-600">BDT {outsideDhakaFee}</div>
                </button>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm text-stone-600 border-t border-stone-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="font-semibold text-stone-800">BDT {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-stone-800">BDT {shippingCost}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-extrabold text-stone-900">
                <span>Total Amount</span>
                <span className="text-orange-600">BDT {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              id="proceed-to-checkout-btn"
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cash on Delivery Available Nationwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Drawer / Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-extrabold text-lg text-stone-900">
                Complete Delivery Details
              </h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-orange-500"
                />
                <span className="text-[11px] text-stone-400">
                  Our delivery courier will call this number prior to arrival.
                </span>
              </div>

              {/* Division & District */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Division *
                  </label>
                  <select
                    value={division}
                    onChange={(e) => {
                      const newDiv = e.target.value;
                      setDivision(newDiv);
                      const divObj = BANGLADESH_DIVISIONS.find((d) => d.name === newDiv);
                      if (divObj && divObj.districts.length > 0) {
                        setDistrict(divObj.districts[0]);
                      }
                      if (newDiv === 'Dhaka') {
                        setDeliveryZone('Inside Dhaka');
                      } else {
                        setDeliveryZone('Outside Dhaka');
                      }
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                  >
                    {BANGLADESH_DIVISIONS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    District/City *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                  >
                    {currentDivisionObj.districts.map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Street Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House number, Road number, Area/Thana, Landmark..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Cash on Delivery', label: 'Cash on Delivery' },
                    { id: 'bKash', label: 'bKash Online' },
                    { id: 'Nagad', label: 'Nagad Online' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        paymentMethod === m.id
                          ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-2xs font-bold'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Payable Summary */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs sm:text-sm space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Items Total:</span>
                  <span>BDT {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery ({deliveryZone}):</span>
                  <span>BDT {shippingCost}</span>
                </div>
                <div className="flex justify-between font-extrabold text-stone-900 border-t border-stone-200 pt-1.5 text-base">
                  <span>Total Payable:</span>
                  <span className="text-orange-600">BDT {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-place-order-btn"
                  disabled={isSubmittingOrder}
                  className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-600/20 cursor-pointer"
                >
                  {isSubmittingOrder ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
