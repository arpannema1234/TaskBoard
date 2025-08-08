import React from "react";

interface LoaderProps {
  message?: string;
  size?: "small" | "medium" | "large";
  type?: "spinner" | "pulse" | "dots";
}

export default function Loader({
  message = "Loading...",
  size = "medium",
  type = "spinner",
}: LoaderProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const renderLoader = () => {
    switch (type) {
      case "spinner":
        return (
          <div
            className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
          ></div>
        );

      case "pulse":
        return (
          <div
            className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}
          ></div>
        );

      case "dots":
        return (
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        );

      default:
        return (
          <div
            className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
          ></div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="mb-4">{renderLoader()}</div>

        <p
          className={`${textSizeClasses[size]} text-gray-700 font-medium text-center`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
