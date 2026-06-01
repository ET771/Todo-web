"use client";

import { useEffect, useState } from "react";

// Modal reutilizable para crear/editar listas y tareas (titulo + descripcion)
export function FormModal({
  open,
  title,
  submitLabel,
  initialTitle = "",
  initialDescription = "",
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  submitLabel: string;
  initialTitle?: string;
  initialDescription?: string;
  onClose: () => void;
  onSubmit: (values: { title: string; description: string }) => Promise<void>;
}) {
  const [value, setValue] = useState(initialTitle);
  const [desc, setDesc] = useState(initialDescription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValue(initialTitle);
      setDesc(initialDescription);
      setError(null);
    }
  }, [open, initialTitle, initialDescription]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!value.trim()) {
      setError("El titulo es obligatorio");
      return;
    }
    try {
      setLoading(true);
      await onSubmit({ title: value.trim(), description: desc.trim() });
      onClose();
    } catch {
      setError("Ocurrio un error. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900">{title}</h2>

        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Titulo"
          className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#005BBF]"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Descripcion (opcional)"
          rows={3}
          className="mb-3 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#005BBF]"
        />

        {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl px-4 py-2 font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-[#005BBF] px-5 py-2 font-semibold text-white hover:bg-[#0049a0] disabled:opacity-60"
          >
            {loading ? "Guardando..." : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
