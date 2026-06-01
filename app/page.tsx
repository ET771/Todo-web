"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell, Fab } from "@/components/AppShell";
import { TaskListCard } from "@/components/TaskListCard";
import { FormModal } from "@/components/FormModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ActionMenu } from "@/components/ActionMenu";
import { Spinner } from "@/components/Spinner";
import { useToast } from "@/components/Toast";
import { todoService } from "@/services/todoService";
import { Todo } from "@/types";

export default function HomePage() {
  return (
    <AppShell>
      <Home />
    </AppShell>
  );
}

function Home() {
  const toast = useToast();
  const [lists, setLists] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [menuFor, setMenuFor] = useState<Todo | null>(null);
  const [toEdit, setToEdit] = useState<Todo | null>(null);
  const [toDelete, setToDelete] = useState<Todo | null>(null);

  const fetchLists = useCallback(async () => {
    try {
      setError(null);
      const data = await todoService.getAll();
      setLists(data);
    } catch {
      setError("No se pudieron cargar las listas");
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchLists();
      setLoading(false);
    })();
  }, [fetchLists]);

  const handleCreate = async (v: { title: string; description: string }) => {
    const created = await todoService.create(v);
    setLists((prev) => [created, ...prev]);
    toast.show({ type: "success", text1: "Lista creada" });
  };

  const handleEdit = async (v: { title: string; description: string }) => {
    if (!toEdit) return;
    const updated = await todoService.update(toEdit.id, v);
    setLists((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setToEdit(null);
    toast.show({ type: "success", text1: "Lista actualizada" });
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await todoService.delete(toDelete.id);
      setLists((prev) => prev.filter((l) => l.id !== toDelete.id));
      toast.show({ type: "success", text1: "Lista eliminada" });
    } catch {
      toast.show({ type: "error", text1: "Error al eliminar la lista" });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis listas</h1>
        <p className="mt-1 text-sm text-gray-500">
          {lists.length > 0
            ? `${lists.length} lista${lists.length !== 1 ? "s" : ""}`
            : "Sin listas aun"}
        </p>
      </header>

      {loading && (
        <div className="mt-20 flex justify-center">
          <Spinner label="Cargando listas..." />
        </div>
      )}

      {!loading && error && (
        <div className="mt-16 flex flex-col items-center">
          <p className="mb-3 text-red-500">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchLists().finally(() => setLoading(false));
            }}
            className="rounded-xl bg-[#005BBF] px-6 py-3 font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && lists.length === 0 && (
        <div className="mt-16 flex flex-col items-center px-6 text-center">
          <p className="mb-4 text-5xl">[ ]</p>
          <h2 className="mb-2 text-xl font-bold text-gray-700">
            No tienes listas todavia
          </h2>
          <p className="mb-6 text-gray-400">
            Crea tu primera lista para empezar a organizar tus tareas
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-xl bg-[#005BBF] px-8 py-3 font-semibold text-white"
          >
            Crear lista
          </button>
        </div>
      )}

      {!loading && !error && lists.length > 0 && (
        <div className="md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {lists.map((item) => (
            <TaskListCard
              key={item.id}
              item={item}
              onMenu={() => setMenuFor(item)}
            />
          ))}
        </div>
      )}

      <Fab onClick={() => setShowCreate(true)} />

      <FormModal
        open={showCreate}
        title="Nueva lista"
        submitLabel="Crear"
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />

      <FormModal
        open={!!toEdit}
        title="Editar lista"
        submitLabel="Guardar"
        initialTitle={toEdit?.title}
        initialDescription={toEdit?.description}
        onClose={() => setToEdit(null)}
        onSubmit={handleEdit}
      />

      <ActionMenu
        open={!!menuFor}
        title={menuFor?.title ?? ""}
        onEdit={() => setToEdit(menuFor)}
        onDelete={() => setToDelete(menuFor)}
        onClose={() => setMenuFor(null)}
      />

      <ConfirmModal
        open={!!toDelete}
        title="Eliminar lista"
        message={`Eliminar "${toDelete?.title}"? Esta accion no se puede deshacer.`}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
