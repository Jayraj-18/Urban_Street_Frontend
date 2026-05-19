import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../api/productApi";
import { getAllOrders, updateOrderStatus } from "../api/orderApi";
import { toast } from "react-hot-toast";

function AdminDashboard({ darkMode, setDarkMode }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "men",
    description: "",
    sizes: [],
    stock: {},
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getAllOrders();
      setOrders(data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProduct(currentProductId, newProduct);
        toast.success("Product updated successfully!");
      } else {
        await addProduct(newProduct);
        toast.success("Product added successfully!");
      }
      setShowAddForm(false);
      setIsEditing(false);
      setNewProduct({ name: "", price: "", image: "", category: "men", description: "", sizes: [], stock: {} });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    }
  };

  const handleEditClick = (product) => {
    setNewProduct({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description || "",
      sizes: product.sizes || [],
      stock: product.stock || {},
    });
    setCurrentProductId(product._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0A0A0A]">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-grow container mx-auto px-6 md:px-20 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 uppercase tracking-widest font-bold">Store Management & Analytics</p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab("products")}
              className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === "products" ? "bg-black text-white dark:bg-white dark:text-black shadow-xl" : "bg-gray-100 dark:bg-zinc-900 text-gray-400"
              }`}
            >
              Products
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === "orders" ? "bg-black text-white dark:bg-white dark:text-black shadow-xl" : "bg-gray-100 dark:bg-zinc-900 text-gray-400"
              }`}
            >
              Orders
            </button>
          </div>

          {activeTab === "products" && (
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setIsEditing(false);
                setNewProduct({ name: "", price: "", image: "", category: "men", description: "", sizes: [], stock: {} });
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-transform hover:scale-105 shadow-lg shadow-indigo-500/20"
            >
              {showAddForm ? "Close Form" : "Add New Product"}
            </button>
          )}
        </div>

        {activeTab === "products" ? (
          <>
            {showAddForm && (
              <div className="mb-12 bg-white dark:bg-[#111111] p-8 rounded-2xl shadow-xl border dark:border-zinc-800 transition-all">
                <h3 className="text-xl font-semibold mb-6 dark:text-white">
                  {isEditing ? "Edit Product" : "Add New Inventory"}
                </h3>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Product Name</label>
                    <input type="text" required className="w-full p-3 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Price (₹)</label>
                    <input type="number" required className="w-full p-3 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Image URL</label>
                    <input type="text" required className="w-full p-3 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Category</label>
                    <select className="w-full p-3 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                      <option value="men">Men</option>
                      <option value="kids">Kids</option>
                      <option value="jackets">Jackets</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border dark:border-zinc-800">
                    <label className="block text-xs font-black uppercase tracking-widest mb-4 dark:text-gray-400">Inventory per Size (pcs)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {newProduct.sizes.map(size => (
                        <div key={size}>
                          <label className="block text-[10px] font-bold mb-1 dark:text-gray-500 uppercase">{size}</label>
                          <input type="number" min="0" className="w-full p-2 rounded-lg border dark:bg-zinc-900 dark:border-zinc-700 dark:text-white text-sm" value={newProduct.stock[size] || 0} onChange={(e) => setNewProduct({ ...newProduct, stock: { ...newProduct.stock, [size]: parseInt(e.target.value) || 0 } })} />
                        </div>
                      ))}
                      {newProduct.sizes.length === 0 && <p className="col-span-full text-xs italic text-gray-400">Add sizes above to manage stock</p>}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg">Save Product</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border dark:border-zinc-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Inventory (Size / Qty)</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-zinc-800 text-sm">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-10 font-medium">Loading items...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-10 font-medium text-gray-400">No products found</td></tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={product.image} className="w-12 h-14 object-cover rounded-md" alt="" />
                            <span className="font-semibold dark:text-white">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-xs dark:text-gray-300">{product.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {product.sizes?.map(s => (
                              <div key={s} className="flex flex-col items-center">
                                <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-bold uppercase">{s}</span>
                                <span className={`text-[8px] font-black mt-1 ${product.stock[s] <= 3 ? "text-red-500 animate-pulse" : "text-gray-400"}`}>{product.stock[s] || 0} pcs</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold dark:text-white">₹{product.price}</td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                          <button onClick={() => handleEditClick(product)} className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2">Edit</button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700 font-medium px-4 py-2">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-zinc-900/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b dark:border-zinc-800">
                    <th className="px-6 py-4">Order Details</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-zinc-800">
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-20 font-medium">Loading orders...</td></tr>
                  ) : orders.filter(o => o.paymentStatus === "paid").map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono text-gray-400">#{order._id.slice(-8).toUpperCase()}</span>
                          <span className="text-xs font-bold dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black dark:text-white uppercase tracking-tight">{order.user?.name || "Guest"}</span>
                          <span className="text-[10px] text-gray-400">{order.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-[10px] font-black dark:text-gray-400 w-4">{item.quantity}x</span>
                              <span className="text-[10px] font-bold dark:text-gray-200">{item.name}</span>
                              <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-gray-500">{item.size}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <select 
                          className={`text-[9px] font-black uppercase px-2 py-1.5 rounded-lg border bg-transparent cursor-pointer transition-all ${
                            order.status === "Delivered" 
                              ? "text-green-500 border-green-500/20" 
                              : order.status === "Dispatched"
                                ? "text-blue-500 border-blue-500/20"
                                : "text-amber-500 border-amber-500/20"
                          }`}
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="mt-2">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border opacity-50 ${
                            order.paymentStatus === "paid" ? "text-green-500 border-green-500/20" : "text-red-500 border-red-500/20"
                          }`}>
                            Payment: {order.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[10px] text-gray-400 max-w-[150px] leading-relaxed truncate hover:whitespace-normal transition-all">{order.shippingAddress}</p>
                      </td>
                    </tr>
                  ))}
                  {orders.filter(o => o.paymentStatus === "paid").length === 0 && !loading && (
                    <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-500 uppercase tracking-widest text-xs font-bold opacity-20">No paid orders received yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
