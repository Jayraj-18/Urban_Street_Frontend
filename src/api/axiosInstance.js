import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isCheckAuthRequest = error.config?.url?.includes("/auth/me");

    if (error.response?.status === 401 && !isCheckAuthRequest) {
      const currentPath = window.location.pathname;
      localStorage.removeItem("user");

      if (currentPath !== "/login" && currentPath !== "/signup") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;