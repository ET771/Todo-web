# Todo Web

Versión web de la aplicación de gestión de listas de tareas. Replica el diseño y las funcionalidades de la app móvil (Expo) y consume el **mismo backend** desplegado. Permite registro e inicio de sesión con Firebase, crear listas, administrar tareas con seguimiento de progreso, buscar y cerrar sesión.

> Proyecto independiente del móvil y del backend. Construido con Next.js para los puntos extra de versión web.

## Tecnologías

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS** — estilos (replica el diseño de NativeWind del móvil)
- **Firebase Authentication** — login/registro y sesión
- **JWT** — token de Firebase enviado al backend en cada request
- **Axios** — instancia personalizada con interceptors (token + manejo de 401)

## Links deployados

| Servicio | URL |
|----------|-----|
| **Web** | _(se completa tras el deploy en Vercel)_ |
| **Backend (API)** | https://todo-back-production-6d8b.up.railway.app |

## Variables de entorno

Crea un archivo `.env` en la raíz (o configúralas en Vercel):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_API_URL=https://todo-back-production-6d8b.up.railway.app
```

> Los valores de Firebase corresponden al **mismo proyecto** que la app móvil.
> `NEXT_PUBLIC_API_URL` apunta al backend desplegado en Railway.

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo .env con los valores anteriores

# 3. Modo desarrollo
npm run dev

# 4. Build de producción
npm run build && npm start
```

La app queda en `http://localhost:3000`.

## Cuenta de prueba

- **Correo:** `fer@gmail.com`
- **Contraseña:** `Holamundo2026`

## Estructura del proyecto

```
app/                 # Páginas (Next.js App Router)
├── login/           # Inicio de sesión
├── register/        # Registro
├── page.tsx         # Home (listas de tareas)
├── lists/[id]/      # Detalle de lista + tareas
├── search/          # Búsqueda de listas y tareas
└── about/           # Perfil + logout
components/          # Componentes reutilizables (cards, modales, tabs, toast)
services/            # Firebase, Axios, auth y servicios de API
context/             # AuthContext (sesión y protección de rutas)
types/               # Tipos compartidos con el backend
```
