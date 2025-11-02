import React from "react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  if (!isOpen) return null;

  const messagesList = message.split("\n").map((msg, index) => (
    <li key={index} className="mb-1">
      {msg}
    </li>
  ));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glassmorphic-white rounded-2xl p-6 max-w-sm w-full text-center neon-glow animate-fade-in">
        <div className="w-16 h-16 bg-gradient-to-r from-neon-fuchsia to-neon-scarlet rounded-full flex items-center justify-center mx-auto mb-4">
          {title === "Success" && (
            <svg
              className="w-8 h-8 text-black drak:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          )}
          {title === "Oops!" && (
            <svg
              className="w-10 h-10 text-black drak:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M12 4v10m0 4h.01"
              />
            </svg>
          )}
        </div>
        <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-800 dark:text-gray-400 mb-4">{messagesList}</p>
        <Button onClick={onClose} size="lg-full" className="px-6 py-2">
          Continue
        </Button>
      </div>
    </div>
  );
};
