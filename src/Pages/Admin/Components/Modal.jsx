import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  // Jika modal tidak dalam status open (false), jangan tampilkan apa-apa
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Overlay Gelap di Belakang Modal */}
      <div 
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Konten Modal */}
      <div className="relative w-full max-w-md mx-auto my-6 z-50">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          
          {/* Header Modal */}
          <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="block text-2xl">×</span>
            </button>
          </div>

          {/* Body Modal */}
          <div className="relative p-6 flex-auto">
            {children}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Modal;