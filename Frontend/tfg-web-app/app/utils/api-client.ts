import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, // http://localhost:4000
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Interceptor para agregar el token JWT a todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        // Opcional: redirigir a login
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
