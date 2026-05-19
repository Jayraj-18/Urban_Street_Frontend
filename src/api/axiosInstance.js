import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// The request interceptor for manual token injection is no longer needed 
// as the browser will automatically send the HttpOnly cookie.

// Handle 401 globally — redirect to login (except for initial identity check)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isCheckAuthRequest = error.config?.url?.includes("/auth/me");

    if (error.response?.status === 401 && !isCheckAuthRequest) {
      const currentPath = window.location.pathname;
      localStorage.removeItem("user");

      // Only redirect if NOT already on login or signup to prevent refresh loops
      if (currentPath !== "/login" && currentPath !== "/signup") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
