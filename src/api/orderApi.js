import axiosInstance from "./axiosInstance";

// Place a new order
export const placeOrder = (data) => axiosInstance.post("/orders", data);

// Get current user's orders
export const getMyOrders = () => axiosInstance.get("/orders/my");

// Get single order by ID
export const getOrderById = (id) => axiosInstance.get(`/orders/${id}`);

// Razorpay flows
export const createRazorpayOrder = (orderData) =>
  axiosInstance.post("/orders/razorpay-order", orderData);

export const verifyPayment = (paymentData) =>
  axiosInstance.post("/orders/verify", paymentData);

// Admin: Get all orders
export const getAllOrders = () => axiosInstance.get("/orders");

// Admin: Update order status
export const updateOrderStatus = (id, status) => 
  axiosInstance.put(`/orders/${id}/status`, { status });
