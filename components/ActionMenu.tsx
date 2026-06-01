"use client";

// Menu emergente con acciones Editar / Eliminar (equivalente al Alert del mobile)
export function ActionMenu({
  open,
  title,
  onEdit,
  onDelete,
  onClose,
}: {
  open: boolean;
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-2 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="px-4 py-3 text-center text-sm font-semibold text-gray-500">
          {title}
        </p>
        <button
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="w-full rounded-xl px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-100"
        >
          Editar
        </button>
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="w-full rounded-xl px-4 py-3 text-left font-medium text-red-500 hover:bg-red-50"
        >
          Eliminar
        </button>
        <button
          onClick={onClose}
          className="w-full rounded-xl px-4 py-3 text-left font-medium text-gray-500 hover:bg-gray-100"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
