import type { Config } from "tailwindcss";

// Colores tomados de la app mobile (NativeWind):
//   azul primario #005BBF (FAB, avatar, header de lista)
//   tint #0a7ea4, grises de Tailwind por defecto
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#005BBF",
          light: "#3b82f6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
