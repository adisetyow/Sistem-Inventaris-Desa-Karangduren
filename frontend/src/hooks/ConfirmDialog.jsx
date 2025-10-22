import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export function useConfirmDialog() {
  const [dialog, setDialog] = useState(null);

  const confirm = (options) => {
    return new Promise((resolve) => {
      setDialog({
        ...options,
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          resolve(false);
        },
      });
    });
  };

  const ConfirmDialog = () =>
    createPortal(
      <AnimatePresence>
        {dialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center border border-sky-100"
            >
              <div className="flex flex-col items-center mb-4">
                <div className="bg-sky-50 text-sky-600 p-3 rounded-full mb-3">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {dialog.title || "Konfirmasi"}
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  {dialog.message || "Apakah Anda yakin?"}
                </p>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={dialog.onCancel}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200 text-sm font-medium"
                >
                  {dialog.cancelText || "Batal"}
                </button>
                <button
                  onClick={dialog.onConfirm}
                  className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  {dialog.confirmText || "Ya"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );

  return { confirm, ConfirmDialog };
}
