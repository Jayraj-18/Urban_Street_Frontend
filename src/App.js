import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import { useState, useEffect } from "react";
import Cart from "./pages/Cart";
import Kids from "./pages/Kids"
import SearchResults from "./pages/SearchResults";
import Men from "./pages/Men"
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jackets from "./pages/Jackets";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./styles/main.css";



// Protected Route for Admin
const ProtectedRoute = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  if (!isLoggedIn || user?.role !== "admin") {
    return <Navigate to="/" />;
  }
  return children;
};

// Protected Route for Customers (prevent admin from viewing shopping pages)
const CustomerRoute = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  if (isLoggedIn && user?.role === "admin") {
    return <Navigate to="/admin" />;
  }
  return children;
};

function App() {

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])


  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<CustomerRoute><Home darkMode={darkMode} setDarkMode={setDarkMode} /></CustomerRoute>} />
            <Route path="/cart" element={<CustomerRoute><Cart darkMode={darkMode} setDarkMode={setDarkMode} /></CustomerRoute>} />
            <Route path="/kids" element={<CustomerRoute><Kids darkMode={darkMode} setDarkMode={setDarkMode} /></CustomerRoute>} />
            <Route path="/men" element={<CustomerRoute><Men darkMode={darkMode} setDarkMode={setDarkMode} /></CustomerRoute>} />
            <Route path="/jackets" element={<CustomerRoute><Jackets darkMode={darkMode} setDarkMode={setDarkMode} /></CustomerRoute>} />
            <Route path="/search" element={<CustomerRoute><SearchResults darkMode={darkMode} setDarkMode={setDarkMode} /></CustomerRoute>} />
            <Route path="/product/:id" element={<CustomerRoute><ProductDetails darkMode={darkMode} setDarkMode={setDarkMode} /></CustomerRoute>} />
            <Route path="/login" element={<CustomerRoute><Login darkMode={darkMode} setDarkMode={setDarkMode} /></CustomerRoute>} />
            <Route path="/signup" element={<CustomerRoute><Signup darkMode={darkMode} setDarkMode={setDarkMode} /></CustomerRoute>} />
            <Route path="/orders" element={<CustomerRoute><Orders darkMode={darkMode} setDarkMode={setDarkMode} /></CustomerRoute>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
