"use client";

import { useState, useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
  type = "warning",
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: "text-red-600",
          confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          iconBg: "bg-red-100",
        };
      case "warning":
        return {
          icon: "text-yellow-600",
          confirmButton:
            "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
          iconBg: "bg-yellow-100",
        };
      case "info":
        return {
          icon: "text-blue-600",
          confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
          iconBg: "bg-blue-100",
        };
      default:
        return {
          icon: "text-yellow-600",
          confirmButton:
            "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
          iconBg: "bg-yellow-100",
        };
    }
  };

  const styles = getTypeStyles();

  const getIcon = () => {
    if (type === "danger") {
      return (
        <svg
          className="w-6 h-6"
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
      );
    }

    return (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={onCancel}
        />

        {/* Modal */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}
            >
              <div className={styles.icon}>{getIcon()}</div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`w-full sm:flex-1 ${styles.confirmButton} text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
