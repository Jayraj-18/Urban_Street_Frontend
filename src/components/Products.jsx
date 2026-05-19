import { useState, useEffect } from "react";
import { getProducts } from "../api/productApi";
import ProductCard from "./ProductCard";
import useScrollReveal from "../hooks/ScrollReveal";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, isVisible] = useScrollReveal();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const visibleCards = 4;
  const cardWidth = 260;

  const nextSlide = () => {
    if (index < products.length - visibleCards) setIndex(index + 1);
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <section
      ref={ref}
      className={`px-6 md:px-20 py-12 dark:text-white transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-8">
        Featured Products
      </h2>

      {/* MOBILE VERSION */}
      <div className="md:hidden overflow-x-auto flex gap-4 snap-x snap-mandatory pb-4">
        {loading ? (
          <p className="text-center w-full py-10">Loading products...</p>
        ) : (
          products.map((product) => (
            <div key={product.id || product._id} className="min-w-[75%] snap-start">
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>

      {/* DESKTOP SLIDER */}
      <div className="hidden md:flex relative items-center">
        <button
          onClick={prevSlide}
          className="absolute -left-12 z-10 bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 flex items-center justify-center text-2xl transition-colors rounded"
        >
          ‹
        </button>

        <div className="overflow-hidden w-full max-w-[1040px] mx-auto">
          <div
            className="flex gap-5 transition-transform duration-300"
            style={{ transform: `translateX(-${index * cardWidth}px)` }}
          >
            {loading ? (
              <p className="w-full text-center py-10">Loading...</p>
            ) : (
              products.map((product) => (
                <div key={product.id || product._id} className="min-w-[240px]">
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="absolute -right-12 z-10 bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 flex items-center justify-center text-2xl transition-colors rounded"
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default Products;