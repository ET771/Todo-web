"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirige cuando el estado de auth confirma la sesion (evita el bucle)
  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [authLoading, user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Completa todos los campos");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await register(fullName, email, password);
      // El useEffect redirige cuando onAuthStateChanged confirme el usuario
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      const msg =
        code === "auth/email-already-in-use"
          ? "Ese correo ya esta registrado"
          : code === "auth/weak-password"
            ? "La contrasena debe tener al menos 6 caracteres"
            : "No se pudo crear la cuenta. Intenta de nuevo.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <form onSubmit={handleRegister} className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Crear cuenta
        </h1>
        <p className="mb-8 text-center text-gray-500">
          Registrate para empezar
        </p>

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nombre completo"
          className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#005BBF]"
        />
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
          autoComplete="new-password"
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
          {loading ? "Creando cuenta..." : "Registrarme"}
        </button>

        <p className="text-center text-gray-500">
          Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-[#005BBF]">
            Inicia sesion
          </Link>
        </p>
      </form>
    </div>
  );
}
