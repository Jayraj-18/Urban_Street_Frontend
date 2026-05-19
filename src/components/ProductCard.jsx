import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [showSizePrompt, setShowSizePrompt] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setShowSizePrompt(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (product.sizes && product.sizes.length > 0) {
      setShowSizePrompt(true);
    } else {
      confirmAdd("M");
    }
  };

  const confirmAdd = (size) => {
    addToCart({ ...product, size });
    setAdded(true);
    setShowSizePrompt(false);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div ref={cardRef} className="relative group rounded-3xl overflow-hidden transition-all duration-500 border border-gray-100/50 dark:border-white/5 bg-white dark:bg-[#111111] flex flex-col hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">

      <Link to={`/product/${product.id || product._id}`} className="block flex-1">
        <div className="relative overflow-hidden bg-gray-50 dark:bg-zinc-900/50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[320px] object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>

          {added && (
            <div className="absolute inset-0 bg-indigo-600/10 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
              <span className="bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 px-5 py-2.5 rounded-full text-xs font-black shadow-2xl uppercase tracking-widest">
                Added to bag
              </span>
            </div>
          )}

          {/* Size Prompt Overlay */}
          {showSizePrompt && (
            <div className="absolute inset-0 bg-white/98 dark:bg-[#0A0A0A]/98 z-20 p-6 flex flex-col justify-center items-center animate-in slide-in-from-bottom-4 duration-300">
              <h5 className="text-xs font-black mb-6 text-white uppercase tracking-[0.2em]">Select Size</h5>
              <div className="grid grid-cols-3 gap-3 mb-8 w-full">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.preventDefault();
                      confirmAdd(size);
                    }}
                    className="aspect-square rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all text-xs font-black uppercase shadow-sm"
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowSizePrompt(false);
                }}
                className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</span>
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight line-clamp-1">
              {product.name}
            </h4>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <p className="text-lg font-black text-black dark:text-white">
                ₹{product.price}
              </p>
              {(() => {
                const totalStock = typeof product.stock === 'number'
                  ? product.stock
                  : (product.stock ? Object.values(product.stock).reduce((a, b) => a + b, 0) : 0);

                if (totalStock <= 3 && totalStock > 0) {
                  return (
                    <span className="text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse mt-0.5">
                      Only {totalStock} left
                    </span>
                  );
                }
                if (totalStock <= 0) {
                  return (
                    <span className="text-[8px] font-black text-red-500 uppercase tracking-widest mt-0.5">
                      Out of stock
                    </span>
                  );
                }
                return null;
              })()}
            </div>
            <div className="flex gap-1.5 self-start pt-1">
              {product.sizes?.slice(0, 3).map(s => (
                <span key={s} className="text-[10px] font-black bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md border border-gray-100 dark:border-white/5 uppercase">
                  {s}
                </span>
              ))}
              {product.sizes?.length > 3 && (
                <span className="text-[10px] font-black text-gray-300 dark:text-zinc-700">+</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="px-6 pb-6">
        <button
          onClick={handleAddToCartClick}
          className="w-full bg-black dark:bg-white dark:text-black text-white text-[10px] font-black py-4 rounded-2xl transition-all active:scale-95 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/5 uppercase tracking-[0.2em]"
        >
          Add to Cart
        </button>
      </div>

    </div>
  );
}

export default ProductCard;