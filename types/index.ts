// Tipos que reflejan los modelos del backend Quarkus

export type Priority = "LOW" | "MEDIUM" | "HIGH";

// Sin parentId = lista raiz. Con parentId = tarea dentro de una lista.
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string | null;
  dueDate: string | null;
  priority: Priority | null;
  parentId: string | null;
  tasks: Todo[];
  categories: Category[];
  comments: Comment[];
  owner?: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface Category {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  parentId?: string;
  priority?: Priority;
  dueDate?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: Priority;
}
