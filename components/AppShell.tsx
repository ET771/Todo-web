"use client";

import { ProtectedRoute } from "./ProtectedRoute";
import { TabBar } from "./TabBar";

// Layout responsive:
//  - movil: columna unica con barra de tabs abajo (como la app mobile)
//  - escritorio: sidebar lateral + contenido ancho centrado
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 md:pl-60">
        <main className="mx-auto min-h-screen w-full max-w-md bg-white pb-20 md:max-w-5xl md:bg-gray-50 md:pb-10">
          {children}
        </main>
        <TabBar />
      </div>
    </ProtectedRoute>
  );
}

// Boton flotante (+) reutilizable. Centrado sobre la columna en movil,
// abajo a la derecha del contenido en escritorio.
export function Fab({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-1/2 z-20 mr-[-160px] flex h-14 w-14 items-center justify-center rounded-full bg-[#005BBF] text-3xl font-light text-white shadow-lg shadow-[#005BBF]/40 transition hover:bg-[#0049a0] md:bottom-10 md:right-10 md:mr-0"
      aria-label="Crear"
    >
      +
    </button>
  );
}
