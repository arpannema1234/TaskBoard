"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types";

interface TaskModalProps {
  isOpen: boolean;
  task: Task | null; // If provided, it's edit mode; if not, it's create mode
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    description?: string;
    dueDate?: string;
    status?: "pending" | "completed";
  }) => void;
}

export default function TaskModal({
  isOpen,
  task,
  onClose,
  onSave,
}: TaskModalProps) {
  const isEditMode = !!task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "completed">("pending");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update form values when task prop changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "pending");
      setDueDate(
        task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
      );
    } else {
      // Reset form for create mode
      setTitle("");
      setDescription("");
      setStatus("pending");
      setDueDate("");
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);

    const taskData: {
      title: string;
      description?: string;
      dueDate?: string;
      status?: "pending" | "completed";
    } = {
      title: title.trim(),
    };

    if (description.trim()) {
      taskData.description = description.trim();
    }

    if (dueDate) {
      taskData.dueDate = dueDate;
    }

    if (isEditMode) {
      taskData.status = status;
    }

    await onSave(taskData);
    setIsLoading(false);

    // Reset form only in create mode
    if (!isEditMode) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("pending");
    }
  };

  const handleClose = () => {
    // Reset form only in create mode
    if (!isEditMode) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("pending");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          {/* Task Title */}
          <div>
            <label
              htmlFor="taskTitle"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
            >
              Task Title *
            </label>
            <input
              type="text"
              id="taskTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all"
              placeholder="Enter task title"
              required
              maxLength={200}
              autoFocus
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {title.length}/200 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="taskDescription"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
            >
              Description (optional)
            </label>
            <textarea
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base transition-all"
              placeholder="Enter task description"
              rows={3}
              maxLength={1000}
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {description.length}/1000 characters
            </p>
          </div>

          {/* Status (only in edit mode) */}
          {isEditMode && (
            <div>
              <label
                htmlFor="taskStatus"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                id="taskStatus"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "pending" | "completed")
                }
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          {/* Due Date */}
          <div>
            <label
              htmlFor="taskDueDate"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
            >
              Due Date (optional)
            </label>
            <input
              type="date"
              id="taskDueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all"
              min={
                !isEditMode ? new Date().toISOString().split("T")[0] : undefined
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Task"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
