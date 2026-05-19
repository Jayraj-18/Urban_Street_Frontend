import axiosInstance from "./axiosInstance";

export const getProducts = () => axiosInstance.get("/products");
export const getProduct = (id) => axiosInstance.get(`/products/${id}`);
export const addProduct = (productData) => axiosInstance.post("/products", productData);
export const updateProduct = (id, productData) => axiosInstance.put(`/products/${id}`, productData);
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);
