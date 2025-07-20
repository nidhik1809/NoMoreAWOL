import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoginLanding = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [name, setName] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login logic
        const res = await axios.post("http://localhost:8081/api/auth/login", {
          email,
          password,
          role,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", role);
        if (role === "MANAGER") {
          navigate("/manager");
        } else {
          navigate("/employee");
        }
      } else {
        // Register logic
        if (password !== confirmPassword) {
          setErrorMessage("Passwords don't match!");
          return;
        }
        await axios.post("http://localhost:8081/api/auth/register", {
          name,
          email,
          password,
          role,
        });
        setRegistrationSuccess(true);
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrorMessage("");
      }
    } catch (err) {
      setErrorMessage(
        `${isLogin ? "Login" : "Registration"} failed: ${
          err.response?.data?.message || "Server error"
        }`
      );
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex">
        <div className="w-1/2 bg-[#0a0f2c] flex flex-col items-center justify-center fixed left-0 top-0 bottom-0">
          <motion.h1 
            className="bg-gradient-to-r from-white via-sky-300 to-purple-400 bg-clip-text text-transparent text-7xl font-bold drop-shadow"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15,
              duration: 1,
            }}
          >
            NoMoreAWOL
          </motion.h1>
        </div>

        <div className="w-1/2 bg-[#1a1a1a] flex items-center justify-center fixed right-0 top-0 bottom-0">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-sm text-white text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
            <p className="mb-6 text-blue-200">You can now login with your credentials</p>
            <button
              onClick={() => {
                setIsLogin(true);
                setRegistrationSuccess(false);
              }}
              className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold shadow-md transition duration-300"
            >
              Login here
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-[#0a0f2c] flex flex-col items-center justify-center fixed left-0 top-0 bottom-0">
        <motion.h1 
          className="bg-gradient-to-r from-white via-sky-300 to-purple-400 bg-clip-text text-transparent text-7xl font-bold drop-shadow"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 15,
            duration: 1,
          }}
        >
          NoMoreAWOL
        </motion.h1>

        <motion.p 
          className="text-[#b3b3b3] italic text-lg tracking-wide mt-4 pb-20"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          "An employee work productivity tracker"
        </motion.p>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-1/2 bg-[#1a1a1a] flex items-center justify-center fixed right-0 top-0 bottom-0">
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-sm text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          key={isLogin ? "login" : "register"}
        >
          <h2 className="text-2xl font-bold text-center text-white mb-6 drop-shadow">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block mb-1 text-sm font-semibold">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block mb-1 text-sm font-semibold">Email</label>
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-semibold">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block mb-1 text-sm font-semibold">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block mb-1 text-sm font-semibold">Role</label>
              <div className="relative">
                <select
                  className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-8"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="EMPLOYEE" className="bg-[#1a1a1a] text-white">Employee</option>
                  <option value="MANAGER" className="bg-[#1a1a1a] text-white">Manager</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <motion.button
              type="submit"
              className="w-full py-3 mt-4 font-semibold text-white bg-rosegold hover:bg-primary rounded-lg transition duration-300 ease-in-out shadow-lg
              bg-gradient-to-r Ofrom-purple-500
              hover: from-purple-600
              hover:to-blue-600 focus: outline-none focus:ring
              focus: ring-purple-300
              Oactive:bg-blue-700 px-6 py-3 rounded-lg
              text-white font-semibold
              shadow-md transition duration-300 ease-in-out
              transform hover:scale-105"
            >
              {isLogin ? "Login" : "Register"}
            </motion.button>
          </form>
          
          <p className="text-center mt-6 text-sm text-gray-300">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage("");
              }}
              className="text-purple-300 font-semibold hover:text-purple-200 hover:underline focus:outline-none ml-1"
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginLanding;