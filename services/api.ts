import axios from "axios";

// Instancia personalizada de Axios apuntando al backend desplegado
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
});

// Interceptor de request: adjunta el JWT de Firebase en cada peticion
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor de response: un 401 en endpoint protegido limpia la sesion
// y redirige al login (igual que la app mobile)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    const isPublicEndpoint = url.includes("/users") || url.includes("/status");

    if (error.response?.status === 401 && !isPublicEndpoint) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
