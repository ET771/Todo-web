"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TabBar } from "@/components/TabBar";
import { TaskItem } from "@/components/TaskItem";
import { FormModal } from "@/components/FormModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ActionMenu } from "@/components/ActionMenu";
import { Spinner } from "@/components/Spinner";
import { useToast } from "@/components/Toast";
import { todoService } from "@/services/todoService";
import { taskService } from "@/services/taskService";
import { Todo } from "@/types";

export default function ListDetailPage() {
  return (
    <ProtectedRoute>
      <Detail />
    </ProtectedRoute>
  );
}

function Detail() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const toast = useToast();

  const [list, setList] = useState<Todo | null>(null);
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [menuFor, setMenuFor] = useState<Todo | null>(null);
  const [toEdit, setToEdit] = useState<Todo | null>(null);
  const [toDelete, setToDelete] = useState<Todo | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [listData, tasksData] = await Promise.all([
        todoService.getById(id),
        taskService.getByList(id),
      ]);
      setList(listData);
      setTasks(tasksData);
    } catch {
      setError("No se pudieron cargar las tareas");
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    })();
  }, [fetchData]);

  // Toggle con actualizacion optimista
  const handleToggle = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newCompleted = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: newCompleted } : t))
    );
    try {
      await taskService.update(taskId, { completed: newCompleted });
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: task.completed } : t
        )
      );
      toast.show({ type: "error", text1: "No se pudo actualizar la tarea" });
    }
  };

  const handleCreate = async (v: { title: string; description: string }) => {
    const created = await taskService.create(id, v);
    setTasks((prev) => [...prev, created]);
    toast.show({ type: "success", text1: "Tarea creada" });
  };

  const handleEdit = async (v: { title: string; description: string }) => {
    if (!toEdit) return;
    const updated = await taskService.update(toEdit.id, v);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setToEdit(null);
    toast.show({ type: "success", text1: "Tarea actualizada" });
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    await taskService.delete(toDelete.id);
    setTasks((prev) => prev.filter((t) => t.id !== toDelete.id));
    toast.show({ type: "success", text1: "Tarea eliminada" });
  };

  const completed = tasks.filter((t) => t.completed).length;
  const percentage =
    tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 md:pl-60">
      <div className="mx-auto min-h-screen w-full max-w-md bg-white p-4 pb-24 md:max-w-3xl md:bg-gray-50 md:p-8">
      {/* Header con back */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => router.push("/")}
          className="text-2xl text-[#005BBF]"
          aria-label="Volver"
        >
          &#8249;
        </button>
        <span className="text-sm font-medium text-gray-500">Mis listas</span>
      </div>

      {loading && (
        <div className="mt-20 flex justify-center">
          <Spinner />
        </div>
      )}

      {!loading && error && (
        <div className="mt-16 flex flex-col items-center">
          <p className="mb-3 text-red-500">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchData().finally(() => setLoading(false));
            }}
            className="rounded-xl bg-[#005BBF] px-6 py-3 font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Tarjeta header de la lista */}
          <div className="mb-6 rounded-2xl bg-[#005BBF] p-5 text-white">
            <p className="mb-2 text-xs">LISTA</p>
            <h1 className="mb-1 text-xl font-bold">{list?.title}</h1>
            <p className="mb-4 text-sm text-white/80">
              {tasks.length} tarea{tasks.length !== 1 ? "s" : ""} en total
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="mt-2 text-xs">{percentage}% completado</p>
          </div>

          {/* Encabezado de seccion */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-600">
              TAREAS PENDIENTES
            </h2>
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs">
              {tasks.length - completed} restantes
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="mt-8 flex flex-col items-center text-center">
              <p className="mb-3 text-4xl">OK</p>
              <p className="text-gray-500">
                No hay tareas en esta lista todavia.
                <br />
                Toca el boton + para agregar una.
              </p>
            </div>
          ) : (
            <div>
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  onMenu={() => setMenuFor(task)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* FAB */}
      {!loading && !error && (
        <button
          onClick={() => setShowCreate(true)}
          className="fixed bottom-8 right-1/2 z-20 mr-[-160px] flex h-14 w-14 items-center justify-center rounded-full bg-[#005BBF] text-3xl font-light text-white shadow-lg shadow-[#005BBF]/40 hover:bg-[#0049a0] md:bottom-10 md:right-10 md:mr-0"
          aria-label="Crear tarea"
        >
          +
        </button>
      )}

      <FormModal
        open={showCreate}
        title="Nueva tarea"
        submitLabel="Crear"
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />

      <FormModal
        open={!!toEdit}
        title="Editar tarea"
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
        title="Eliminar tarea"
        message={`Eliminar "${toDelete?.title}"?`}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
      </div>
      <TabBar />
    </div>
  );
}
