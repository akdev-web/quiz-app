import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f1f5f9] to-[#e0f2fe] px-4 text-center">
      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        src="https://storyset.com/illustration/page-not-found/pana" // Or use another free vector
        alt="404"
        className="w-full max-w-md mb-6"
      />

      <motion.h1
        className="text-4xl md:text-6xl font-bold text-slate-800 mb-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Page Not Found
      </motion.h1>

      <motion.p
        className="text-slate-600 text-base md:text-lg mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        The page you're looking for doesn't exist or has been moved.
      </motion.p>

      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-2 rounded-full shadow-lg hover:bg-slate-700 transition"
      >
        <ArrowLeft size={20} />
        Go Back
      </motion.button>
    </div>
  );
};

export default NotFound;
