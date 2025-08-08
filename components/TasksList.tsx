"use client";

import { Task } from "@/types";
import TaskCard from "./TaskCard";

interface TasksListProps {
  tasks: Task[];
  onToggleTask: (
    taskId: string,
    currentStatus: "pending" | "completed"
  ) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TasksList({
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}: TasksListProps) {
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8h6m-6 4h6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-600">Add your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pending Tasks */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Pending Tasks ({pendingTasks.length})
        </h2>
        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onToggleTask={onToggleTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
          {pendingTasks.length === 0 && (
            <p className="text-gray-500 text-center py-4">No pending tasks</p>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Completed Tasks ({completedTasks.length})
          </h2>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleTask={onToggleTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
