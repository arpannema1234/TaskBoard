"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Board } from "@/types";
import BoardsList from "@/components/BoardsList";
import CreateBoardModal from "@/components/CreateBoardModal";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import ConfirmModal from "@/components/ConfirmModal";

export default function DashboardPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await fetch("/api/boards");
      const data = await response.json();

      if (data.success) {
        setBoards(data.data.boards);
      } else {
        setError(data.error || "Failed to fetch boards");
      }
    } catch (error) {
      setError("An error occurred while fetching boards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBoard = async (name: string) => {
    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (data.success) {
        setBoards([...boards, data.data.board]);
        setShowCreateModal(false);
      } else {
        setError(data.error || "Failed to create board");
      }
    } catch (error) {
      setError("An error occurred while creating the board");
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    setBoardToDelete(boardId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteBoard = async () => {
    if (!boardToDelete) return;

    setShowDeleteConfirm(false);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/boards/${boardToDelete}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setBoards(boards.filter((board) => board.id !== boardToDelete));
      } else {
        setError(data.error || "Failed to delete board");
      }
    } catch (error) {
      setError("An error occurred while deleting the board");
    } finally {
      setIsLoading(false);
      setBoardToDelete(null);
    }
  };

  const cancelDeleteBoard = () => {
    setShowDeleteConfirm(false);
    setBoardToDelete(null);
  };

  const handleBoardClick = (boardId: string) => {
    router.push(`/board/${boardId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {isLoading && <Loader message="Loading boards..." />}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Your Task Boards
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium py-2.5 sm:py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
          >
            Create New Board
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="w-full">
          <BoardsList
            boards={boards}
            onBoardClick={handleBoardClick}
            onDeleteBoard={handleDeleteBoard}
          />
        </div>

        {showCreateModal && (
          <CreateBoardModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateBoard}
          />
        )}

        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="Delete Board"
          message="Are you sure you want to delete this board? This will also delete all tasks in the board."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={confirmDeleteBoard}
          onCancel={cancelDeleteBoard}
        />
      </div>
    </div>
  );
}
