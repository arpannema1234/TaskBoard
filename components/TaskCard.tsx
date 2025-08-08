"use client";

import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onToggleTask: (
    taskId: string,
    currentStatus: "pending" | "completed"
  ) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskCard({
  task,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}: TaskCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isDueSoon = (dueDate?: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleTask(task.id, task.status)}
            className={`mt-1 w-5 cursor-pointer h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-colors ${
              task.status === "completed"
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-green-500"
            }`}
          >
            {task.status === "completed" && (
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium text-sm sm:text-base break-words ${
                task.status === "completed"
                  ? "text-gray-500 line-through"
                  : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`text-xs sm:text-sm mt-1 break-words ${
                  task.status === "completed"
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {task.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs text-gray-500">
              <span className="whitespace-nowrap">
                Created {formatDate(task.createdAt)}
              </span>
              {task.dueDate && (
                <span
                  className={`inline-block px-2 py-1 rounded text-xs whitespace-nowrap ${
                    isOverdue(task.dueDate) && task.status === "pending"
                      ? "bg-red-100 text-red-700"
                      : isDueSoon(task.dueDate) && task.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Due {formatDate(task.dueDate)}
                  {isOverdue(task.dueDate) &&
                    task.status === "pending" &&
                    " (Overdue)"}
                  {isDueSoon(task.dueDate) &&
                    task.status === "pending" &&
                    !isOverdue(task.dueDate) &&
                    " (Due Soon)"}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 flex-shrink-0">
          <button
            onClick={() => onEditTask(task)}
            className="text-blue-600 hover:text-blue-700 p-1 sm:p-2 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
            title="Edit task"
            aria-label="Edit task"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="text-red-600 hover:text-red-700 p-1 sm:p-2 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete task"
            aria-label="Delete task"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
