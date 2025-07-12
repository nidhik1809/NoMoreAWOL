import { motion } from "framer-motion";

const DashboardCard = ({ title, value, color, delay }) => {
  return (
    <motion.div
      className={`rounded-xl shadow-lg p-6 bg-white/10 backdrop-blur-lg border-l-4 border-${color}`}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
    </motion.div>
  );
};

export default DashboardCard;