import React, { ReactNode } from "react";
import Button from "../Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string; // <-- Add title prop
  isFullScreen?: boolean;
  hideActions?: boolean;
  onAccept?: () => void;
  loading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title, // <-- Destructure title
  isFullScreen,
  hideActions,
  // onAccept,
  // loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`bg-white text-gray-700 rounded-lg shadow-lg flex flex-col rounded-t-medium ${
          isFullScreen ? "min-h-[100dvh] w-screen" : "max-w-lg w-full"
        }`}
      >
        {/* Header with left-aligned close button and title */}
        <div className="modal-header flex items-center justify-between px-4 py-2 border-b bg-autogo-tiber">
          {title && (
            <span className="text-lg font-semibold ml-2 text-black">
              {title}
            </span>
          )}
          {/* {!hideActions && ( */}
          <button
            className="close text-2xl text-black font-bold hover:text-gray-700 focus:outline-none"
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
          {/* )} */}
        </div>
        {/* Modal content */}
        <div className="modal-body px-6 py-4 flex-1">{children}</div>
        {/* Footer with action buttons */}
        {!hideActions && (
          <div className="modal-footer flex justify-center gap-2 px-4 py-3 border-t">
            <Button label="Aceptar" onClick={onClose} className="text-white" />
            <Button label="Cerrar" onClick={onClose} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
