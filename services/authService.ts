import {
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";
import { api } from "./api";

const TOKEN_KEY = "token";

function saveToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export async function login(email: string, password: string): Promise<void> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const token = await cred.user.getIdToken();
  saveToken(token);
}

export async function register(
  fullName: string,
  email: string,
  password: string
): Promise<void> {
  // El backend crea el usuario en Firebase y lo persiste en la BD
  await api.post("/users", { fullName, email, password });

  // Login para obtener el JWT
  const cred = await signInWithEmailAndPassword(auth, email, password);

  // Guarda el nombre para mostrarlo en el perfil
  await updateProfile(cred.user, { displayName: fullName });

  saveToken(await cred.user.getIdToken());
}

export async function logout(): Promise<void> {
  await signOut(auth);
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
