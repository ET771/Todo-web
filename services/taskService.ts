// Servicio para tareas - todos con parentId apuntando a su lista raiz

import { api } from "./api";
import { Todo, CreateTodoDto, UpdateTodoDto } from "@/types";

export const taskService = {
  // GET /todos/:id/tasks - subtareas de una lista
  getByList: async (listId: string): Promise<Todo[]> => {
    const { data } = await api.get<Todo[]>(`/todos/${listId}/tasks`);
    return data;
  },

  // POST /todos - crear tarea con parentId apuntando a la lista
  create: async (
    listId: string,
    dto: Omit<CreateTodoDto, "parentId">
  ): Promise<Todo> => {
    const { data } = await api.post<Todo>("/todos", {
      ...dto,
      parentId: listId,
    });
    return data;
  },

  // PUT /todos/:id - actualizar tarea
  update: async (taskId: string, dto: UpdateTodoDto): Promise<Todo> => {
    const { data } = await api.put<Todo>(`/todos/${taskId}`, dto);
    return data;
  },

  // DELETE /todos/:id
  delete: async (taskId: string): Promise<void> => {
    await api.delete(`/todos/${taskId}`);
  },
};
