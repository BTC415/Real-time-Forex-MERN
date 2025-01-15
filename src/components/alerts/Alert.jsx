import React, { useEffect } from 'react';
import { BiCheckCircle, BiErrorCircle, BiInfoCircle } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';

const icons = {
  success: <BiCheckCircle className="w-5 h-5" />,
  error: <BiErrorCircle className="w-5 h-5" />,
  info: <BiInfoCircle className="w-5 h-5" />
};

const colors = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200'
};

export default function Alert({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 p-3 border rounded-lg shadow-lg ${colors[type]}`}
        >
          {icons[type]}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}