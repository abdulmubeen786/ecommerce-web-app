import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true, // cookies hamesha jayengi
});

// ⭐ Response interceptor — ye hi asli kaam karega
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response, // sab theek hai to bas response pass kar do
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 aaya aur ye request refresh call khud nahi thi
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/user/refresh")
    ) {
      if (isRefreshing) {
        // Agar already refresh chal raha hai, to is request ko wait karwao
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/user/refresh"); // naya access token cookie mein set ho gaya
        processQueue(null);
        return axiosInstance(originalRequest); // original failed request dobara try karo
      } catch (refreshError) {
        processQueue(refreshError);
        // refresh token bhi expire ho chuka — ab logout karna hoga
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
