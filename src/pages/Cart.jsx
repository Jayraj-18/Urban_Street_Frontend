import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createRazorpayOrder, verifyPayment } from "../api/orderApi";
import { toast } from "react-hot-toast";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

function Cart({ darkMode, setDarkMode }) {
  const { cart, increaseQty, decreaseQty, removeItem, totalItems, totalPrice, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPolicyConfirm, setShowPolicyConfirm] = useState(false);
  const [addressData, setAddressData] = useState({
    street: user?.address || "",
    pincode: "",
    city: ""
  });

  const validateAddress = () => {
    if (addressData.street.length < 8) {
      toast.error("Address must be at least 8 characters long");
      return false;
    }
    if (!addressData.pincode || addressData.pincode.length < 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    if (!addressData.city) {
      toast.error("City is required");
      return false;
    }
    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (cart.length === 0) return;

    if (!showAddressForm) {
      setShowAddressForm(true);
      return;
    }

    if (!validateAddress()) return;

    if (!showPolicyConfirm) {
      setShowPolicyConfirm(true);
      return;
    }

    const fullAddress = `${addressData.street}, ${addressData.city} - ${addressData.pincode}`;

    setIsProcessing(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      // 1. Create order on backend
      const { data } = await createRazorpayOrder({
        amount: totalPrice,
        items: cart.map(item => ({
          product: item._id || item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size
        })),
        shippingAddress: fullAddress
      });

      // 2. Open Razorpay Modal
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "UrbanStreet",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            // 3. Verify payment on backend
            const verifyRes = await verifyPayment({
              ...response,
              dbOrderId: data.dbOrderId
            });

            if (verifyRes.data.success) {
              toast.success("Order placed successfully!");
              clearCart();
              navigate("/orders");
            }
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0A0A0A]">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-grow container mx-auto px-6 md:px-20 py-12 md:py-24">
        <div className="flex justify-between items-end mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
            Your Bag <span className="text-gray-300 dark:text-zinc-800">({isLoggedIn ? totalItems : 0})</span>
          </h1>
          <Link
            to="/orders"
            className="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 border border-gray-200 dark:border-white/10 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            Order History
          </Link>
        </div>

        {!isLoggedIn || cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-100 dark:border-zinc-900 rounded-[3.5rem] bg-gray-50/50 dark:bg-zinc-900/10">
            <ShoppingCartIcon className="h-20 w-20 text-gray-200 dark:text-zinc-800 mb-8" />
            <p className="text-lg font-black text-gray-400 mb-8 uppercase tracking-[0.2em]">Your bag is empty</p>
            <Link to="/men">
              <button className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black font-black rounded-full hover:scale-105 transition-transform uppercase tracking-widest text-[10px] shadow-2xl">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-16 items-start">

            {/* ITEMS LIST */}
            <div className="lg:col-span-2 space-y-10">
              {cart.map((item) => {
                const itemId = `${item._id || item.id}-${item.size}`;
                return (
                  <div key={itemId} className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-gray-100 dark:border-white/5 group">
                    <div className="w-full sm:w-48 h-60 rounded-3xl overflow-hidden bg-gray-50 dark:bg-zinc-900 shadow-inner">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </div>

                    <div className="flex-grow flex flex-col justify-between py-2">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Premium Wear</span>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{item.name}</h3>
                          </div>
                          <button
                            onClick={() => removeItem(itemId)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Size: <span className="text-black dark:text-white bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-lg ml-2">{item.size || "M"}</span></p>
                      </div>

                      <div className="flex justify-between items-end mt-8">
                        <div className="flex items-center gap-6 bg-gray-50 dark:bg-zinc-900 px-6 py-3 rounded-2xl border border-gray-100 dark:border-white/5">
                          <button
                            onClick={() => decreaseQty(itemId)}
                            className="text-gray-400 hover:text-black dark:hover:text-white font-black text-lg p-1"
                          >-</button>
                          <span className="text-sm font-black w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => increaseQty(itemId)}
                            className="text-gray-400 hover:text-black dark:hover:text-white font-black text-lg p-1"
                          >+</button>
                        </div>
                        <p className="text-2xl font-black text-black dark:text-white tracking-tighter">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SUMMARY */}
            <div className="lg:col-span-1 glass p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 sticky top-32 shadow-2xl shadow-indigo-500/5">
              <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-10">Summary</h2>

              {showAddressForm ? (
                <div className="space-y-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                  <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Shipping Details</h3>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Street Address (Min 8 chars)</label>
                    <input
                      type="text"
                      placeholder="e.g. 123 Urban Street, Block 4"
                      className="w-full bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl text-sm dark:text-white border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={addressData.street}
                      onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">City</label>
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl text-sm dark:text-white border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={addressData.city}
                        onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Pincode</label>
                      <input
                        type="text"
                        placeholder="6 Digits"
                        maxLength="6"
                        className="w-full bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl text-sm dark:text-white border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={addressData.pincode}
                        onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="text-[9px] font-black text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-widest"
                  >
                    ← Back to Summary
                  </button>
                </div>
              ) : (
                <div className="space-y-6 mb-12 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span className="font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                    <span className="font-black text-gray-900 dark:text-white">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span className="font-bold uppercase tracking-widest text-[10px]">Estimated Shipping</span>
                    <span className="font-black text-green-500 uppercase tracking-widest">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span className="font-bold uppercase tracking-widest text-[10px]">Tax</span>
                    <span className="font-black text-gray-900 dark:text-white">₹0</span>
                  </div>
                  <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex justify-between items-end">
                    <span className="text-base font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Total</span>
                    <span className="text-3xl font-black text-black dark:text-white tracking-tighter">₹{totalPrice}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-black dark:bg-white dark:text-black text-white text-[10px] font-black py-6 rounded-2xl transition-all active:scale-95 shadow-2xl hover:shadow-indigo-500/20 uppercase tracking-[0.3em] disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : showAddressForm ? "Pay Now" : "Confirm & Pay"}
                </button>

                <div className="flex items-center justify-center gap-2 mt-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4" />
                </div>
              </div>

              <p className="text-[9px] font-bold text-gray-400 mt-10 text-center leading-relaxed uppercase tracking-widest">
                Secure 256-bit SSL encrypted payments.
              </p>
            </div>

          </div>
        )}
      </main>

      <Footer />

      {/* POLICY CONFIRMATION MODAL */}
      {showPolicyConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowPolicyConfirm(false)}></div>
          <div className="relative bg-white dark:bg-[#111111] w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 dark:border-white/5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-8 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-center text-gray-900 dark:text-white uppercase tracking-tight mb-4">Important Notice</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm leading-relaxed mb-10">
              Please note that <span className="font-black text-red-500 uppercase">UrbanStreet has a strictly no-return policy</span>.
              Once the order is placed and payment is processed, it cannot be returned or refunded.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-black dark:bg-white dark:text-black text-white text-[10px] font-black py-5 rounded-2xl transition-all active:scale-95 shadow-xl uppercase tracking-[0.3em]"
              >
                I Agree & Pay
              </button>
              <button
                onClick={() => setShowPolicyConfirm(false)}
                className="w-full bg-gray-50 dark:bg-zinc-900 text-gray-400 text-[10px] font-black py-5 rounded-2xl transition-all hover:text-black dark:hover:text-white uppercase tracking-[0.3em]"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;