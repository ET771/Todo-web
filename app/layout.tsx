import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Todo Web",
  description: "Gestion de listas de tareas - version web",
};

// Renderizado dinamico: la app depende de Firebase Auth (cliente), no tiene
// sentido prerenderizar estaticamente. Evita que el build ejecute getAuth en
// el servidor sin las variables de entorno publicas.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
