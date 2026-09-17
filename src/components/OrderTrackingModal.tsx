import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const { orders, setCurrentView } = useShop();
  const [searchId, setSearchId] = useState('SK-89412');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(() => {
    return orders.find((o) => o.id === 'SK-89412') || orders[0] || null;
  });
  const [searched, setSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toUpperCase();
    const found = orders.find(
      (o) => o.id.toUpperCase() === query || o.phone.includes(query)
    );
    setSelectedOrder(found || null);
    setSearched(true);
  };

  const stages: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'Pending', label: 'Order Placed', desc: 'Received in system' },
    { status: 'Confirmed', label: 'Order Confirmed', desc: 'Verified by merchant team' },
    { status: 'Processing', label: 'Packed & Quality Checked', desc: 'Ready for courier pickup' },
    { status: 'Shipped', label: 'In Transit', desc: 'Dispatched with Bangladesh courier partner' },
    { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider is on the way to your door' },
    { status: 'Delivered', label: 'Delivered', desc: 'Handed over successfully' }
  ];

  const getStageIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Out for Delivery':
        return 4;
      case 'Delivered':
        return 5;
      default:
        return 0;
    }
  };

  const currentStageIdx = selectedOrder ? getStageIndex(selectedOrder.status) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Enter your Shopping Kori Order ID or 11-digit mobile number
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mt-5 flex gap-2">
          <input
            id="order-tracking-input"
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="e.g. SK-89412 or 017XXXXXXXX"
            className="flex-1 bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-orange-500 shadow-2xs"
          />
          <button
            id="order-tracking-submit"
            type="submit"
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Track</span>
          </button>
        </form>
      </div>

      {searched && selectedOrder ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Order Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs text-stone-400">Order Number</span>
              <h2 className="text-xl font-extrabold text-stone-900">{selectedOrder.id}</h2>
              <span className="text-xs text-stone-500">Placed on: {selectedOrder.createdAt}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400">Current Status</span>
              <div>
                <span
                  className={`inline-block mt-0.5 px-3 py-1 rounded-full text-xs font-bold ${
                    selectedOrder.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedOrder.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Stages */}
          <div className="space-y-4 py-2">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
              Delivery Progress
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;

                return (
                  <div key={stage.status} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isPassed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-stone-300 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold leading-none ${
                          isCurrent ? 'text-orange-600' : isPassed ? 'text-stone-800' : 'text-stone-400'
                        }`}
                      >
                        {stage.label}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200/70 text-xs">
            <div>
              <span className="font-bold text-stone-700 block mb-1">Customer Information</span>
              <p className="text-stone-600">{selectedOrder.customerName}</p>
              <p className="text-stone-600 flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                {selectedOrder.phone}
              </p>
            </div>
            <div>
              <span className="font-bold text-stone-700 block mb-1">Delivery Address</span>
              <p className="text-stone-600 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>{selectedOrder.address}, {selectedOrder.district}, {selectedOrder.division}</span>
              </p>
              <p className="text-stone-500 mt-1">Payment: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Items in this shipment
            </h3>
            <div className="divide-y divide-stone-100">
              {selectedOrder.items.map((item: any, i: number) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-contain rounded-md bg-stone-50 p-1 border border-stone-200"
                    />
                    <div>
                      <p className="font-semibold text-stone-800">{item.name}</p>
                      <p className="text-[11px] text-stone-400">{item.brand} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">
                    BDT {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-stone-200 pt-3 text-sm font-extrabold text-stone-900">
              <span>Total Payable:</span>
              <span className="text-orange-600">BDT {selectedOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ) : (
        searched && (
          <div className="text-center py-12 bg-stone-50 rounded-3xl border border-stone-200 max-w-md mx-auto">
            <p className="text-stone-700 font-bold text-sm">No order found</p>
            <p className="text-xs text-stone-500 mt-1">
              Please double check the Order ID or try sample ID <code className="text-orange-600 font-mono">SK-89412</code>.
            </p>
          </div>
        )
      )}
    </div>
  );
};
