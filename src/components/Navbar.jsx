import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SunIcon, MoonIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar({ darkMode, setDarkMode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const { totalItems } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-gray-200/50 dark:border-white/10 glass">
      <div className="container mx-auto px-6 md:px-20 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 bg-black dark:bg-white flex items-center justify-center rounded-lg rotate-3 group-hover:rotate-0 transition-transform">
            <span className="text-white dark:text-black font-black text-xl italic">U</span>
          </div>
          <h2 className="text-xl font-black tracking-tighter dark:text-white group-hover:text-indigo-500 transition-colors">
            URBAN<span className="font-light italic">STREET</span>
          </h2>
        </Link>

        {/* DESKTOP LINKS */}
        <ul className="hidden md:flex items-center gap-10">
          <li>
            <Link to="/" className="text-sm font-bold tracking-tight hover:text-indigo-500 transition-colors uppercase">Home</Link>
          </li>
          <li>
            <Link to="/men" className="text-sm font-bold tracking-tight hover:text-indigo-500 transition-colors uppercase">Men</Link>
          </li>
          <li>
            <Link to="/jackets" className="text-sm font-bold tracking-tight hover:text-indigo-500 transition-colors uppercase">Jackets</Link>
          </li>
          <li>
            <Link to="/kids" className="text-sm font-bold tracking-tight hover:text-indigo-500 transition-colors uppercase">Kids</Link>
          </li>
        </ul>

        {/* ACTIONS */}
        <div className="flex items-center gap-6">

          {/* SEARCH (Optional but sleek) */}
          <form onSubmit={handleSearch} className="hidden lg:flex relative items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-40 focus:w-60 bg-gray-100 dark:bg-white/10 border-none rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {/* CART */}
          <Link to="/cart" className="relative p-2 group">
            <ShoppingCartIcon className="h-6 w-6 text-gray-700 dark:text-gray-300 group-hover:text-indigo-500 transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center animate-bounce shadow-lg shadow-indigo-500/50">
                {totalItems}
              </span>
            )}
          </Link>

          {/* AUTH */}
          <div className="hidden md:flex items-center gap-4 border-l border-gray-200 dark:border-white/10 pl-6">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {user?.role === "admin" && (
                  <Link to="/admin" className="text-xs font-black bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-black transition-colors uppercase tracking-widest">Admin</Link>
                )}
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">HI, {user?.name?.split(" ")[0]}</span>
                <button onClick={handleLogout} className="text-xs font-black text-red-500 hover:underline uppercase tracking-widest">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-xs font-bold hover:text-indigo-600 transition-colors uppercase tracking-widest">Login</Link>
                <Link to="/signup" className="text-xs font-black bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full hover:scale-105 transition-transform uppercase tracking-widest">Signup</Link>
              </div>
            )}
          </div>

          {/* THEME TOGGLE */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            {darkMode ? (
              <SunIcon onClick={() => setDarkMode(!darkMode)} className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon onClick={() => setDarkMode((prev) => !prev)} className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;