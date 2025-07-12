// filepath: k:\Coding\Springboot Projects\nomoreawol-frontend\src\pages\Register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/api/auth/register", {
        email,
        password,
        role,
      });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-cyan-500 to-rosegold">
      <motion.div
        className="backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl p-10 w-full max-w-md text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-rosegold mb-6 drop-shadow">
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">Role</label>
            <select
              className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 font-semibold text-white bg-rosegold hover:bg-primary rounded-lg transition duration-300 ease-in-out shadow-lg"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-6 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;