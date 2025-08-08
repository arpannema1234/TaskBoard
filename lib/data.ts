import fs from "fs";
import path from "path";
import { AppData, User, Board, Task } from "@/types";

const DATA_FILE = path.join(process.cwd(), "data.json");

// Initialize empty data structure
const initialData: AppData = {
  users: [],
  boards: [],
  tasks: [],
};

// Ensure data file exists
export function initializeDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read data from file
export function readData(): AppData {
  try {
    initializeDataFile();
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data file:", error);
    return initialData;
  }
}

// Write data to file
export function writeData(data: AppData): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data file:", error);
    throw new Error("Failed to save data");
  }
}

// User operations
export function createUser(user: Omit<User, "id" | "createdAt">): User {
  const data = readData();
  const newUser: User = {
    id: generateId(),
    ...user,
    createdAt: new Date().toISOString(),
  };

  data.users.push(newUser);
  writeData(data);
  return newUser;
}

export function findUserByEmail(email: string): User | undefined {
  const data = readData();
  return data.users.find((user) => user.email === email);
}

export function findUserById(id: string): User | undefined {
  const data = readData();
  return data.users.find((user) => user.id === id);
}

// Board operations
export function createBoard(board: Omit<Board, "id" | "createdAt">): Board {
  const data = readData();
  const newBoard: Board = {
    id: generateId(),
    ...board,
    createdAt: new Date().toISOString(),
  };

  data.boards.push(newBoard);
  writeData(data);
  return newBoard;
}

export function getBoardsByUserId(userId: string): Board[] {
  const data = readData();
  return data.boards.filter((board) => board.userId === userId);
}

export function findBoardById(id: string): Board | undefined {
  const data = readData();
  return data.boards.find((board) => board.id === id);
}

export function updateBoard(
  id: string,
  updates: Partial<Omit<Board, "id" | "createdAt">>
): Board | null {
  const data = readData();
  const boardIndex = data.boards.findIndex((board) => board.id === id);

  if (boardIndex === -1) return null;

  data.boards[boardIndex] = { ...data.boards[boardIndex], ...updates };
  writeData(data);
  return data.boards[boardIndex];
}

export function deleteBoard(id: string): boolean {
  const data = readData();
  const boardIndex = data.boards.findIndex((board) => board.id === id);

  if (boardIndex === -1) return false;

  // Also delete all tasks in this board
  data.tasks = data.tasks.filter((task) => task.boardId !== id);
  data.boards.splice(boardIndex, 1);
  writeData(data);
  return true;
}

// Task operations
export function createTask(task: Omit<Task, "id" | "createdAt">): Task {
  const data = readData();
  const newTask: Task = {
    id: generateId(),
    ...task,
    createdAt: new Date().toISOString(),
  };

  data.tasks.push(newTask);
  writeData(data);
  return newTask;
}

export function getTasksByBoardId(boardId: string): Task[] {
  const data = readData();
  return data.tasks.filter((task) => task.boardId === boardId);
}

export function findTaskById(id: string): Task | undefined {
  const data = readData();
  return data.tasks.find((task) => task.id === id);
}

export function updateTask(
  id: string,
  updates: Partial<Omit<Task, "id" | "createdAt">>
): Task | null {
  const data = readData();
  const taskIndex = data.tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) return null;

  data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates };
  writeData(data);
  return data.tasks[taskIndex];
}

export function deleteTask(id: string): boolean {
  const data = readData();
  const taskIndex = data.tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) return false;

  data.tasks.splice(taskIndex, 1);
  writeData(data);
  return true;
}

// Utility function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
