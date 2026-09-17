import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { User, Package, LogOut, CheckCircle2, Clock, Phone, MapPin, Truck } from 'lucide-react';

export const AccountView: React.FC = () => {
  const { customerUser, setCustomerUser, orders, showToast, setCurrentView } = useShop();
  const [isRegistering, setIsRegistering] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state (matching Screenshot_20260916-121301)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please fill in your email and password', 'error');
      return;
    }
    setCustomerUser({
      name: loginEmail.split('@')[0],
      email: loginEmail,
      phone: '01700000000'
    });
    showToast('Signed in successfully', 'success');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      showToast('Please complete all required fields', 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (regPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    setCustomerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim()
    });
    showToast('Account created successfully! Welcome to Shopping Kori.', 'success');
  };

  const handleLogout = () => {
    setCustomerUser(null);
    showToast('Logged out', 'info');
  };

  // If Logged in: Profile & My Orders
  if (customerUser) {
    const customerOrders = orders.filter(
      (o) => o.phone === customerUser.phone || (o.email && o.email.toLowerCase() === customerUser.email.toLowerCase())
    );

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
              {customerUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-stone-900">
                {customerUser.name}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">{customerUser.email}</p>
              <p className="text-xs text-stone-500">{customerUser.phone}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>

        {/* My Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              <span>My Orders</span>
            </h3>
            <button
              onClick={() => setCurrentView('tracking')}
              className="text-xs font-semibold text-orange-600 hover:underline"
            >
              Track any order
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
              No orders placed yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-xs text-stone-400">Order ID: </span>
                      <span className="font-bold text-stone-800 text-sm">{ord.id}</span>
                      <span className="text-[11px] text-stone-400 ml-2">({ord.createdAt})</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'Shipped' || ord.status === 'Out for Delivery'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="divide-y divide-stone-50">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-contain rounded-md bg-stone-50 p-1"
                          />
                          <div>
                            <p className="font-medium text-stone-800">{item.name}</p>
                            <p className="text-[11px] text-stone-400">Qty: {item.quantity} × BDT {item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <span className="font-bold text-stone-900">
                          BDT {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs text-stone-500">
                    <span>
                      Delivery to: {ord.address}, {ord.district}
                    </span>
                    <span className="text-sm font-extrabold text-stone-900">
                      Total: <span className="text-orange-600">BDT {ord.totalAmount.toLocaleString()}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // If Not logged in: Sign In (Screenshot_20260916-121256) or Create Account (Screenshot_20260916-121301)
  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-xs">
        {!isRegistering ? (
          /* Sign In matching Screenshot_20260916-121256 */
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-6">
              Sign in
            </h1>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="signin-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="signin-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded-sm text-orange-600 focus:ring-orange-500 border-stone-300"
                  />
                  <span>Keep me signed in</span>
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to your email', 'info')}
                  className="text-orange-600 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>

              <button
                id="signin-submit-btn"
                type="submit"
                className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 transition-all mt-2 cursor-pointer"
              >
                Sign in
              </button>
            </form>

            <div className="mt-6 text-center text-xs sm:text-sm text-stone-600">
              New to Shopping Kori?{' '}
              <button
                id="switch-to-create-account"
                onClick={() => setIsRegistering(true)}
                className="text-orange-600 font-bold hover:underline"
              >
                Create account
              </button>
            </div>
          </div>
        ) : (
          /* Create account matching Screenshot_20260916-121301 */
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-6">
              Create account
            </h1>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Mahfuzur Rahman"
                  className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Mobile number <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-mobile"
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <span className="text-[11px] text-stone-400 block mt-1">01XXXXXXXXX</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-password"
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <span className="text-[11px] text-stone-400 block mt-1">Required: 8+</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-confirm-password"
                  type="password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <button
                id="create-account-submit-btn"
                type="submit"
                className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 transition-all mt-2 cursor-pointer"
              >
                Create account
              </button>
            </form>

            <div className="mt-6 text-center text-xs sm:text-sm text-stone-600">
              Already have an account?{' '}
              <button
                id="switch-to-sign-in"
                onClick={() => setIsRegistering(false)}
                className="text-orange-600 font-bold hover:underline"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
