"use client";

import { useRouter } from "next/navigation";
import { Todo } from "@/types";

// Porcentaje de tareas completadas de una lista
function getProgress(todo: Todo): number {
  const tasks = todo.tasks ?? [];
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.completed).length;
  return Math.round((done / tasks.length) * 100);
}

export function TaskListCard({
  item,
  onMenu,
}: {
  item: Todo;
  onMenu?: () => void;
}) {
  const router = useRouter();
  const progress = getProgress(item);
  const taskCount = item.tasks?.length ?? 0;

  return (
    <div
      onClick={() => router.push(`/lists/${item.id}`)}
      className="mb-3 cursor-pointer rounded-xl border border-gray-300 p-4 transition hover:border-[#005BBF] hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
        {onMenu ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenu();
            }}
            className="px-2 text-lg text-gray-400 hover:text-gray-600"
          >
            ...
          </button>
        ) : null}
      </div>

      <p className="mb-2 text-sm text-gray-500">
        {item.description ||
          `${taskCount} tarea${taskCount !== 1 ? "s" : ""}`}
      </p>

      <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[#005BBF] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{progress}% completado</p>
    </div>
  );
}
