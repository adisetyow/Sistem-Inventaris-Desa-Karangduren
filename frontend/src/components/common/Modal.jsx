import { Transition } from "@headlessui/react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <Transition
      show={isOpen}
      as="div"
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Latar Belakang Overlay */}
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
        </Transition.Child>

        {/* Konten Modal */}
        <Transition.Child
          as="div"
          className="relative w-full max-w-lg p-6 mx-auto bg-white rounded-2xl shadow-xl border border-slate-100"
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-5">{children}</div>
        </Transition.Child>
      </div>
    </Transition>
  );
}
