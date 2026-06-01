"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/authService";

export default function AboutPage() {
  return (
    <AppShell>
      <About />
    </AppShell>
  );
}

function About() {
  const router = useRouter();
  const { user } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? "?");

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="px-6 pt-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Mi cuenta</h1>

      {/* Avatar */}
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#005BBF]">
          <span className="text-3xl font-bold text-white">{initials}</span>
        </div>
        {user?.displayName ? (
          <p className="text-xl font-semibold text-gray-900">
            {user.displayName}
          </p>
        ) : null}
        <p className="mt-1 text-sm text-gray-500">{user?.email ?? ""}</p>
      </div>

      {/* Info */}
      <div className="mb-8 space-y-3 rounded-2xl bg-gray-50 p-4">
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Nombre
          </p>
          <p className="font-medium text-gray-900">
            {user?.displayName ?? "Sin nombre"}
          </p>
        </div>
        <div className="h-px bg-gray-200" />
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Correo
          </p>
          <p className="font-medium text-gray-900">{user?.email ?? ""}</p>
        </div>
      </div>

      <button
        onClick={() => setConfirmLogout(true)}
        className="w-full rounded-2xl bg-red-500 py-3.5 font-semibold text-white hover:bg-red-600"
      >
        Cerrar sesion
      </button>

      <ConfirmModal
        open={confirmLogout}
        title="Cerrar sesion"
        message="Estas seguro de que quieres cerrar sesion?"
        confirmLabel="Cerrar sesion"
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
