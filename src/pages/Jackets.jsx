import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/productApi";
import { useState, useEffect } from "react";
import useScrollReveal from "../hooks/ScrollReveal";

function Jackets({ darkMode, setDarkMode }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts();
        setProducts(data.filter(p => p.category === "jackets"));
      } catch (error) {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [ref, isVisible] = useScrollReveal();

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <section ref={ref} className={`container mx-auto px-6 md:px-20 py-12 md:py-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        
        <header className="mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-4 block">Outerwear Elite</span>
          <h1 className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-6">
            Jackets <span className="text-gray-300 dark:text-zinc-800">& Coats</span>
          </h1>
          <div className="w-20 h-1 bg-black dark:bg-white mb-8"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
            Stay shielded without compromising on style. Our premium jackets are engineered for the urban climate, blending technical performance with high-fashion aesthetics.
          </p>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {loading ? (
            <div className="col-span-full py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-20 text-center opacity-30 font-black uppercase tracking-widest italic">No pieces found in this category</div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Jackets;
