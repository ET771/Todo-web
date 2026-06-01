"use client";

import { Todo } from "@/types";

export function TaskItem({
  task,
  onToggle,
  onMenu,
}: {
  task: Todo;
  onToggle: (id: string) => void;
  onMenu: (id: string) => void;
}) {
  return (
    <div
      className={`mb-3 flex items-center justify-between rounded-xl p-4 ${
        task.completed ? "bg-gray-200" : "border border-gray-300 bg-white"
      }`}
    >
      <div className="flex flex-1 items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`flex h-6 w-6 items-center justify-center rounded-md border ${
            task.completed
              ? "border-green-600 bg-green-600"
              : "border-gray-400"
          }`}
        >
          {task.completed && (
            <span className="text-xs font-bold text-white">v</span>
          )}
        </button>

        <div className="flex-1">
          <p
            className={`font-semibold ${
              task.completed ? "text-gray-500 line-through" : "text-gray-900"
            }`}
          >
            {task.title}
          </p>
          {task.description ? (
            <p className="text-sm text-gray-500">{task.description}</p>
          ) : null}
        </div>
      </div>

      <button
        onClick={() => onMenu(task.id)}
        className="px-2 text-lg text-gray-400 hover:text-gray-600"
      >
        ...
      </button>
    </div>
  );
}
