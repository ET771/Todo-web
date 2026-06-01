import Link from "next/link";

// Pagina 404 propia, sin dependencias de Firebase, para que el prerender
// del build no inicialice auth.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="mb-2 text-4xl font-bold text-gray-900">404</h1>
      <p className="mb-6 text-gray-500">Esta pagina no existe.</p>
      <Link
        href="/"
        className="rounded-xl bg-[#005BBF] px-6 py-3 font-semibold text-white"
      >
        Ir al inicio
      </Link>
    </div>
  );
}
