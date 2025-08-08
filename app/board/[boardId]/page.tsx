"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Board, Task } from "@/types";
import Header from "@/components/Header";
import TasksList from "@/components/TasksList";
import TaskModal from "@/components/TaskModal";
import Loader from "@/components/Loader";
import ConfirmModal from "@/components/ConfirmModal";

export default function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const [board, setBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const router = useRouter();
  const { boardId } = use(params);
  useEffect(() => {
    fetchBoardAndTasks();
  }, [boardId]);

  const fetchBoardAndTasks = async () => {
    setIsLoading(true);
    try {
      // Fetch board details
      const boardResponse = await fetch("/api/boards");
      const boardData = await boardResponse.json();

      if (boardData.success) {
        const currentBoard = boardData.data.boards.find(
          (b: Board) => b.id === boardId
        );
        if (currentBoard) {
          setBoard(currentBoard);
        } else {
          setError("Board not found");
          return;
        }
      }

      // Fetch tasks for this board
      const tasksResponse = await fetch(`/api/boards/${boardId}/tasks`);
      const tasksData = await tasksResponse.json();

      if (tasksData.success) {
        setTasks(tasksData.data.tasks);
      } else {
        setError(tasksData.error || "Failed to fetch tasks");
      }
    } catch (error) {
      setError("An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/boards/${boardId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (data.success) {
        setTasks([...tasks, data.data.task]);
        setShowTaskModal(false);
      } else {
        setError(data.error || "Failed to create task");
      }
    } catch (error) {
      setError("An error occurred while creating the task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        setTasks(
          tasks.map((task) => (task.id === taskId ? data.data.task : task))
        );
        setEditingTask(null);
      } else {
        setError(data.error || "Failed to update task");
      }
    } catch (error) {
      setError("An error occurred while updating the task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: string;
    status?: "pending" | "completed";
  }) => {
    if (editingTask) {
      // Edit mode
      await handleUpdateTask(editingTask.id, taskData);
    } else {
      // Create mode
      await handleCreateTask(taskData);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    console.log(taskId);
    setTaskToDelete(taskId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    setIsLoading(true);
    setShowDeleteConfirm(false);

    try {
      const response = await fetch(
        `/api/boards/${boardId}/tasks/${taskToDelete}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setTasks(tasks.filter((task) => task.id !== taskToDelete));
      } else {
        setError(data.error || "Failed to delete task");
      }
    } catch (error) {
      setError("An error occurred while deleting the task");
    } finally {
      setIsLoading(false);
      setTaskToDelete(null);
    }
  };

  const cancelDeleteTask = () => {
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const handleToggleTask = async (
    taskId: string,
    currentStatus: "pending" | "completed"
  ) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    await handleUpdateTask(taskId, { status: newStatus });
  };

  if (error && !board) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        {isLoading && <Loader />}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm sm:text-base">
            {error}
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {isLoading && <Loader />}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="flex-1">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium mb-3 sm:mb-2 flex items-center text-sm sm:text-base transition-colors"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 break-words">
              {board?.name}
            </h1>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowTaskModal(true)}
              className="w-full lg:w-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
            >
              <span className="sm:hidden">Add Task</span>
              <span className="hidden sm:inline">Add New Task</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="w-full">
          <TasksList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        <TaskModal
          isOpen={showTaskModal}
          task={editingTask}
          onClose={handleCloseTaskModal}
          onSave={handleSaveTask}
        />

        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={confirmDeleteTask}
          onCancel={cancelDeleteTask}
        />
      </div>
    </div>
  );
}
