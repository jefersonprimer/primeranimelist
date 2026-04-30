'use client';

import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000]">
      <div className="bg-[#1a1a1a] p-8 rounded-lg max-w-[400px] w-[90%] text-white shadow-lg">
        <h2 className="m-0 mb-4 text-xl text-white">{title}</h2>
        <p className="m-0 mb-6 text-[#ccc]">{message}</p>
        <div className="flex justify-end gap-4">
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-[#f47521] text-white rounded border-none cursor-pointer font-medium transition-colors duration-200 hover:bg-[#e06a1b]"
          >
            Confirm
          </button>
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-[#333] text-white rounded border-none cursor-pointer font-medium transition-colors duration-200 hover:bg-[#444]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;