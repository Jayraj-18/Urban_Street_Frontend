import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-black text-gray-500 py-20 px-6 md:px-20 border-t border-white/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

          {/* BRAND */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-xl font-black text-white tracking-tighter mb-6 italic">
              URBAN<span className="font-light">STYLES</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-xs">
              Defining the future of urban fashion. Premium quality, sustainable sourcing, and unmatched style for the modern generation.
            </p>
          </div>

          {/* SHOP */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Shop</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/men" className="hover:text-white transition-colors">Men's Collection</Link></li>
              <li><Link to="/jackets" className="hover:text-white transition-colors">Premium Jackets</Link></li>
              <li><Link to="/kids" className="hover:text-white transition-colors">Kids Wear</Link></li>
              <li><Link to="/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/cart" className="hover:text-white transition-colors">Your Cart</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Connect</h4>
            <div className="space-y-4 text-sm">
              <p className="hover:text-white transition-colors">Email: info@UrbanStreet.com</p>
              <p className="hover:text-white transition-colors">Phone: +91 98765 43210</p>
              <div className="flex gap-4 pt-2">
                {/* Social placeholders */}
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                  <span className="font-black text-[10px]">IG</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                  <span className="font-black text-[10px]">FB</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                  <span className="font-black text-[10px]">X</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-4">
          <p className="text-[10px] uppercase tracking-widest text-gray-700">
            © 2026 UrbanStreet Collective. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-gray-700">
            <span>Secure Payments</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;