import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProduct } from "../api/productApi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

function ProductDetails({ darkMode, setDarkMode }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProduct(id);
        setProduct(data);
        setActiveImage(data.image);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        console.error("Product fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Placeholder gallery images
  const gallery = product ? [
    product.image,
    product.image, // Repeating for demo
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop"
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#0A0A0A] dark:text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-black uppercase tracking-widest animate-pulse">Loading Product</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-[#0A0A0A]">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex-grow flex items-center justify-center">
          <h2 className="text-2xl font-black uppercase tracking-widest dark:text-white opacity-20">Product Not Found</h2>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert("Please select a size");
      return;
    }

    addToCart({ ...product, size: selectedSize });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0A0A0A]">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-grow container mx-auto px-6 md:px-20 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">

          {/* IMAGE SECTION */}
          <div className="flex flex-col md:flex-row-reverse gap-6">
            <div className="relative flex-1 group overflow-hidden rounded-[2.5rem] bg-gray-50 dark:bg-zinc-900/50 aspect-[4/5]">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {added && (
                <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-500 z-10">
                  <span className="bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 px-8 py-4 rounded-full text-sm font-black shadow-2xl uppercase tracking-[0.3em] border border-indigo-500/20">
                    Added to bag
                  </span>
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-24 md:w-24 md:h-32 rounded-2xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${activeImage === img ? "border-black dark:border-white scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={img} alt="Angle" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="flex flex-col h-full py-4">
            <div className="mb-10">
              <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                {product.category} Exclusive
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter mb-4">
                {product.name}
              </h1>
              <div className="flex items-center flex-wrap gap-4">
                <span className="text-3xl font-black text-black dark:text-white">₹{product.price}</span>
                <span className="text-xs font-bold text-gray-400 uppercase line-through italic">₹{Math.floor(product.price * 1.4)}</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${(() => {
                  const stockVal = selectedSize && product.stock && typeof product.stock === 'object'
                    ? product.stock[selectedSize]
                    : (typeof product.stock === 'number' ? product.stock : 0);
                  return stockVal <= 3
                    ? "text-red-500 border-red-500/20 bg-red-500/5 animate-pulse"
                    : "text-indigo-500 border-indigo-500/20 bg-indigo-500/5";
                })()
                  }`}>
                  {(() => {
                    if (!selectedSize) return "Select a size to see stock";
                    const stockVal = product.stock && typeof product.stock === 'object'
                      ? product.stock[selectedSize]
                      : (typeof product.stock === 'number' ? product.stock : 0);

                    if (stockVal === undefined || stockVal <= 0) return "Size Out of Stock";
                    return `${stockVal} pieces left`;
                  })()}
                </span>
              </div>
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed mb-12 max-w-xl">
              Crafted from premium materials with an emphasis on durability and urban aesthetic.
              Designed for those who demand both style and comfort in their daily rotation.
            </p>

            {/* SIZE SELECTION */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Select Size</h4>
                  <button className="text-[10px] font-bold text-gray-400 hover:text-indigo-500 underline transition-colors uppercase tracking-widest">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {product.sizes.map((size) => {
                    const isOutOfStock = product.stock ? product.stock[size] <= 0 : false;
                    return (
                      <button
                        key={size}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(size)}
                        className={`aspect-square flex items-center justify-center rounded-2xl border-2 transition-all duration-300 font-black text-xs uppercase relative overflow-hidden ${selectedSize === size
                          ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-xl"
                          : isOutOfStock
                            ? "border-gray-50 dark:border-zinc-900 text-gray-200 dark:text-zinc-800 cursor-not-allowed"
                            : "border-gray-100 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:border-indigo-500"
                          }`}
                      >
                        {size}
                        {isOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-[1px] bg-gray-200 dark:bg-zinc-800 rotate-45"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || (product.stock && product.stock[selectedSize] <= 0)}
                className="flex-1 bg-black dark:bg-white dark:text-black text-white text-xs font-black py-5 rounded-2xl transition-all active:scale-95 shadow-2xl hover:shadow-indigo-500/20 uppercase tracking-[0.3em] disabled:opacity-20 disabled:cursor-not-allowed"
              >
                {(!selectedSize || product.stock[selectedSize] > 0) ? "Add to Bag" : "Size Out of Stock"}
              </button>
              <button className="p-5 border-2 border-gray-100 dark:border-zinc-800 rounded-2xl hover:bg-red-500/5 hover:border-red-500/20 transition-all group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-8 mt-16 pt-10 border-t border-gray-100 dark:border-zinc-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">✓</div>
                <span className="text-[10px] font-black uppercase tracking-widest dark:text-gray-400">Free Express Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">✓</div>
                <span className="text-[10px] font-black uppercase tracking-widest dark:text-gray-400">30 Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;
