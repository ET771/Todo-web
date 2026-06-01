"use client";

import { ProtectedRoute } from "./ProtectedRoute";
import { TabBar } from "./TabBar";

// Contenedor tipo movil (ancho max, centrado) con barra de tabs y proteccion de ruta.
// Replica el area de las (tabs) de la app mobile.
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="mx-auto min-h-screen w-full max-w-md bg-white pb-20">
        {children}
        <TabBar />
      </div>
    </ProtectedRoute>
  );
}

// Boton flotante (+) reutilizable, identico al FAB del mobile
export function Fab({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 left-1/2 z-20 ml-[140px] flex h-14 w-14 items-center justify-center rounded-full bg-[#005BBF] text-3xl font-light text-white shadow-lg shadow-[#005BBF]/40 transition hover:bg-[#0049a0]"
      aria-label="Crear"
    >
      +
    </button>
  );
}
