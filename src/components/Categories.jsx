import { Link } from "react-router-dom";
import useScrollReveal from "../hooks/ScrollReveal";

function Categories() {

  const [ref,isVisible] = useScrollReveal();

  return (
    <section ref={ref} className={`grid md:grid-cols-[1.2fr_1fr] gap-6 px-6 md:px-20 py-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0":"opacity-0 translate-y-10"}`}>

      {/* LEFT BIG CARD - Men's */}
      <div className="relative overflow-hidden rounded-lg h-[300px] md:h-[420px] cursor-pointer brightness-90 hover:brightness-95 transition duration-300">
        <img
          src="/images/men-categories.jpg"
          alt="Men Style"
          className="w-full h-full object-cover "
        />

        <div className="absolute inset-0 p-6 flex flex-col justify-center ">
          <span className="text-blue-600 font-semibold mb-2">
            Hot Deal
          </span>
          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">
            Men's Style
          </h3>
          <p className="mb-4 text-white">Min. 40–80% Off</p>

          <Link to="/men">
            <button className="w-fit px-4 py-2 bg-black text-white hover:bg-gray-800 transition rounded-md">
              Shop Now
            </button>
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 cursor-pointer brightness-90 hover:brightness-95 transition duration-300">

        {/* Kids - Wide */}
        <div className="relative overflow-hidden rounded-lg h-[200px] md:col-span-2">
          <img
            src="/images/twokids.jpg"
            alt="Kids"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 p-5 flex flex-col justify-center  text-white">
            <span className="bg-blue-600 text-xs px-2 py-1 w-fit mb-2">
              25% OFF
            </span>
            <h4 className="text-lg font-semibold mb-3">
              New Arrivals: Children
            </h4>

            <Link to="/kids">
              <button className="w-fit px-3 py-1 bg-black text-white hover:bg-gray-800 transition rounded-md">
                Shop Now
              </button>
            </Link>
          </div>
        </div>

        {/* Jackets */}
        <div className="relative overflow-hidden rounded-lg h-[180px] md:col-span-2 cursor-pointer brightness-90 hover:brightness-95 transition duration-300">
          <img
            src="/images/winter.jpg"
            alt="Jackets"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 p-5 flex flex-col justify-center  text-white">
            <span className="bg-blue-600 text-xs px-2 py-1 w-fit mb-2">
              45% OFF
            </span>
            <h4 className="text-lg font-semibold mb-3">
              Jackets
            </h4>

            <Link to="/jackets">
              <button className="w-fit px-3 py-1 bg-black text-white hover:bg-gray-800 transition rounded-md">
                Shop Now
              </button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Categories;