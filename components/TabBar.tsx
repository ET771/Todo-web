"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Inicio", icon: "house" },
  { href: "/search", label: "Buscar", icon: "search" },
  { href: "/about", label: "Perfil", icon: "user" },
];

function Icon({ name, active }: { name: string; active: boolean }) {
  const color = active ? "#005BBF" : "#9ca3af";
  const common = {
    width: 24,
    height: 24,
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "house")
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M3 9.5 12 3l9 6.5" />
        <path d="M5 10v10h14V10" />
      </svg>
    );
  if (name === "search")
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function TabBar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Movil: barra inferior */}
      <nav className="fixed bottom-0 left-0 z-30 w-full border-t border-gray-200 bg-white md:hidden">
        <div className="mx-auto flex max-w-md">
          {tabs.map((t) => {
            const active = isActive(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className="flex flex-1 flex-col items-center gap-1 py-2"
              >
                <Icon name={t.icon} active={active} />
                <span
                  className="text-xs"
                  style={{ color: active ? "#005BBF" : "#9ca3af" }}
                >
                  {t.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Escritorio: barra lateral fija */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col border-r border-gray-200 bg-white px-4 py-6 md:flex">
        <div className="mb-8 px-3">
          <span className="text-xl font-bold text-[#005BBF]">Todo</span>
          <span className="text-xl font-bold text-gray-900">Web</span>
        </div>
        <nav className="flex flex-col gap-1">
          {tabs.map((t) => {
            const active = isActive(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition ${
                  active
                    ? "bg-blue-50 text-[#005BBF]"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Icon name={t.icon} active={active} />
                <span>{t.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
