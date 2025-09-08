"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function SuccessOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.15, 1] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_24px_rgba(34,197,94,.5)]"
            >
              <span className="text-2xl">✅</span>
            </motion.div>
            <motion.p
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="text-green-400 font-semibold"
            >
              로그인 성공!
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
