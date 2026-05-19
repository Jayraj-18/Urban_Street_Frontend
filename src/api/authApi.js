import axiosInstance from "./axiosInstance";

// Register a new user
export const signupUser = (data) => axiosInstance.post("/auth/signup", data);

// Login
export const loginUser = (data) => axiosInstance.post("/auth/login", data);

// Logout
export const logoutUser = () => axiosInstance.post("/auth/logout");

// Get current logged-in user
export const getMe = () => axiosInstance.get("/auth/me");
