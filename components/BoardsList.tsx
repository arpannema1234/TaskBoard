"use client";

import { Board } from "@/types";

interface BoardsListProps {
  boards: Board[];
  onBoardClick: (boardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
}

export default function BoardsList({
  boards,
  onBoardClick,
  onDeleteBoard,
}: BoardsListProps) {
  if (boards.length === 0) {
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
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No boards yet
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first task board to get organized!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boards.map((board) => (
        <div
          key={board.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
              onClick={() => onBoardClick(board.id)}
            >
              {board.name}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBoard(board.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 transition-opacity"
              title="Delete board"
            >
              <svg
                className="w-5 h-5"
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

          <div
            className="text-sm text-gray-500"
            onClick={() => onBoardClick(board.id)}
          >
            Created {new Date(board.createdAt).toLocaleDateString()}
          </div>

          <div
            className="mt-4 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            onClick={() => onBoardClick(board.id)}
          >
            <span className="text-sm font-medium">Open Board</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
