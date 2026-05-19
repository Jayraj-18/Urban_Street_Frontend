import { useState } from "react";
import products from "../data/products";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  const [index, setIndex] = useState(0);
  const visibleCount = 4;
  const cardWidth = 260;

  const nextSlide = () => {
    if (index < products.length - visibleCount) {
      setIndex(index + 1);
    }
  };

  const prevSlide = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <section className="px-6 md:px-20 py-14">

      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
        Featured Products
      </h2>

      {/* MOBILE - Horizontal Scroll */}
      <div className="md:hidden flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4">
        {products.map((item) => (
          <div key={item.id} className="min-w-[75%] snap-start">
            <ProductCard product={item} />
          </div>
        ))}
      </div>

      {/* DESKTOP - Slider */}
      <div className="hidden md:flex relative items-center">

        <button
          onClick={prevSlide}
          className="absolute -left-12 z-10 bg-black text-white w-10 h-10 flex items-center justify-center text-2xl"
        >
          ‹
        </button>

        <div className="overflow-hidden w-full max-w-[1040px] mx-auto">
          <div
            className="flex gap-5 transition-transform duration-300"
            style={{ transform: `translateX(-${index * cardWidth}px)` }}
          >
            {products.map((item) => (
              <div key={item.id} className="min-w-[240px]">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="absolute -right-12 z-10 bg-black text-white w-10 h-10 flex items-center justify-center text-2xl"
        >
          ›
        </button>

      </div>

    </section>
  );
}

export default FeaturedProducts;