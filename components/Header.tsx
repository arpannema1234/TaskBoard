"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "./Loader";

export default function Header() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      {isLoading && <Loader message="Logging out..." />}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo/Brand */}
          <div
            className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
            onClick={() => router.push("/dashboard")}
          >
            <span className="hidden sm:inline">TaskBoards</span>
            <span className="sm:hidden">TB</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center space-x-4 lg:space-x-6">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-700 cursor-pointer hover:text-blue-600 font-medium transition-colors text-sm lg:text-base"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 lg:px-6 rounded-lg transition-colors text-sm lg:text-base"
            >
              Logout
            </button>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
              title="Dashboard"
              aria-label="Go to Dashboard"
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
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
                />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-md transition-colors"
              title="Logout"
              aria-label="Logout"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
