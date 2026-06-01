"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unica fuente de redireccion: cuando el estado de auth confirma la sesion.
  // Asi se evita el bucle login <-> home por redirecciones que compiten.
  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [authLoading, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Ingresa tu email y contrasena");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      // No redirigimos aqui: el useEffect de arriba lo hara cuando
      // onAuthStateChanged confirme el usuario (evita el race condition).
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      const msg =
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
          ? "Email o contrasena incorrectos"
          : "Error al iniciar sesion. Intenta de nuevo.";
      setError(msg);
      setLoading(false);
    }
    // Si fue exito, mantenemos loading=true hasta que el useEffect redirija
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Bienvenido
        </h1>
        <p className="mb-8 text-center text-gray-500">
          Inicia sesion para continuar
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electronico"
          autoComplete="email"
          className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#005BBF]"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contrasena"
          autoComplete="current-password"
          className="mb-6 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#005BBF]"
        />

        {error ? (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mb-4 w-full rounded-xl bg-[#005BBF] py-3 font-semibold text-white hover:bg-[#0049a0] disabled:opacity-60"
        >
          {loading ? "Iniciando sesion..." : "Iniciar sesion"}
        </button>

        <p className="text-center text-gray-500">
          No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-[#005BBF]">
            Registrate
          </Link>
        </p>
      </form>
    </div>
  );
}
