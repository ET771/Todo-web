import axios from "axios";
import { auth } from "./firebase";

// Instancia personalizada de Axios apuntando al backend desplegado
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
});

// Interceptor de request: adjunta el JWT de Firebase en cada peticion.
// Toma el token directo del usuario actual de Firebase (siempre fresco);
// si no hay usuario aun, cae al token guardado en localStorage.
api.interceptors.request.use(async (config) => {
  let token: string | null = null;
  try {
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    } else if (typeof window !== "undefined") {
      token = window.localStorage.getItem("token");
    }
  } catch {
    token = null;
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response: un 401 en endpoint protegido limpia la sesion.
// La redireccion la maneja ProtectedRoute (navegacion suave), no forzamos
// una recarga dura aqui para evitar bucles.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    const isPublicEndpoint = url.includes("/users") || url.includes("/status");

    if (error.response?.status === 401 && !isPublicEndpoint) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);
