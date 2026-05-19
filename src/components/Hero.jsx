import { Link } from "react-router-dom";
import useScrollReveal from "../hooks/ScrollReveal";

function Hero() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`relative w-full h-[500px] md:h-[800px] overflow-hidden transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
    >
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 bg-black">
        <img
          src="/images/hero-men.jpg"
          alt="Men Fashion"
          className="w-full h-full object-cover object-center opacity-50 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full container mx-auto px-6 md:px-20 flex flex-col justify-center items-start">

        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in-down">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/90">
            Limited Edition Collection
          </span>
        </div>

        {/* Main Heading with Layered Text */}
        <div className="space-y-2 mb-8">
          <h2 className="text-indigo-500 text-lg md:text-xl font-medium tracking-wide animate-fade-in-left delay-100">
            New Arrivals 2026
          </h2>
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter animate-fade-in-left delay-200">
            URBAN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500">
              STREET
            </span>
          </h1>
        </div>

        {/* Description */}
        <p className="max-w-md text-sm md:text-lg text-gray-400 mb-10 leading-relaxed animate-fade-in-left delay-300">
          Elevate your daily rotation with our latest drop. Premium fabrics,
          unmatched fit, and the edge you've been looking for.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-500">
          <Link to="/men">
            <button className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <span className="relative z-10 flex items-center gap-2">
                Shop Men's Wear
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </Link>

          <Link to="/jackets">
            <button className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-full backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/60 active:scale-95">
              Explore Jackets
            </button>
          </Link>
        </div>

        {/* Floating Stats or Features */}
        <div className="absolute bottom-12 right-6 md:right-20 hidden lg:flex gap-12 text-white animate-fade-in-up delay-700">
          <div className="flex flex-col">
            <span className="text-3xl font-black">500+</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-500">Styles</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black">100%</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-500">Original</span>
          </div>
        </div>
      </div>

      {/* Decorative Blur Gradients */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none"></div>
    </section>
  );
}

export default Hero;