export interface User {
  id: string;
  email: string;
  password: string; // hashed
  createdAt: string;
}

export interface Board {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
  dueDate?: string;
  createdAt: string;
  boardId: string;
}

export interface AppData {
  users: User[];
  boards: Board[];
  tasks: Task[];
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
