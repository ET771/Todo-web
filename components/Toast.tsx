"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type ToastType = "success" | "error";
interface ToastMsg {
  id: number;
  type: ToastType;
  text1: string;
  text2?: string;
}

interface ToastApi {
  show: (t: { type: ToastType; text1: string; text2?: string }) => void;
}

const ToastContext = createContext<ToastApi>({ show: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const show = useCallback(
    (t: { type: ToastType; text1: string; text2?: string }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, ...t }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, 2500);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl px-4 py-3 text-sm text-white shadow-lg ${
              t.type === "success" ? "bg-green-600" : "bg-red-500"
            }`}
          >
            <p className="font-semibold">{t.text1}</p>
            {t.text2 ? <p className="text-white/90">{t.text2}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
