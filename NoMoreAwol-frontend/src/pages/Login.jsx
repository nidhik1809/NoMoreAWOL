// filepath: k:\Coding\Springboot Projects\nomoreawol-frontend\src\pages\Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/api/auth/login", {
        email,
        password,
        role,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);
      if (role === "manager") {
        navigate("/manager");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-primary to-rosegold">
      <motion.div
        className="backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl p-10 w-full max-w-md text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-rosegold mb-6 drop-shadow">
          Welcome Back!
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
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
            Login
          </button>
        </form>
        <p className="text-center mt-6 text-sm">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-primary font-semibold hover:underline"
          >
            Register here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;