// Servicio para listas - todos raiz sin parentId

import { api } from "./api";
import { Todo, CreateTodoDto, UpdateTodoDto } from "@/types";

export const todoService = {
  // GET /todos - listas del usuario autenticado
  getAll: async (): Promise<Todo[]> => {
    const { data } = await api.get<Todo[]>("/todos");
    return data;
  },

  // GET /todos/:id - detalle de una lista
  getById: async (id: string): Promise<Todo> => {
    const { data } = await api.get<Todo>(`/todos/${id}`);
    return data;
  },

  // POST /todos - crear nueva lista (sin parentId)
  create: async (dto: CreateTodoDto): Promise<Todo> => {
    const { data } = await api.post<Todo>("/todos", dto);
    return data;
  },

  // PUT /todos/:id - actualizar lista
  update: async (id: string, dto: UpdateTodoDto): Promise<Todo> => {
    const { data } = await api.put<Todo>(`/todos/${id}`, dto);
    return data;
  },

  // DELETE /todos/:id
  delete: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  // GET /todos/search?q= - busqueda por titulo y descripcion
  search: async (query: string): Promise<Todo[]> => {
    const { data } = await api.get<Todo[]>("/todos/search", {
      params: { q: query },
    });
    return data;
  },
};
