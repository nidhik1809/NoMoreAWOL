// filepath: k:\Coding\Springboot Projects\nomoreawol-frontend\src\pages\Home.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-cyan-500 to-rosegold">
      <motion.div
        className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-center text-rosegold mb-8 drop-shadow">
          NomoreAWOL
        </h1>
        <div className="flex flex-col gap-6">
          <button
            onClick={() => navigate("/login")}
            className="py-4 font-semibold text-white bg-navy hover:bg-cyan-600 rounded-lg transition duration-300 shadow-lg"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="py-4 font-semibold text-white bg-rosegold hover:bg-navy rounded-lg transition duration-300 shadow-lg"
          >
            Register
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;