import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeTasks: 0,
    productivity: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || localStorage.getItem("role") !== "MANAGER") navigate("/");
    
    const fetchData = async () => {
      try {
        // Fetch team data
        const empRes = await axios.get("http://localhost:8081/api/employees", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(empRes.data);
        
        // Fetch stats
        const statsRes = await axios.get("http://localhost:8081/api/assignments/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats({
          totalEmployees: empRes.data.length,
          activeTasks: statsRes.data.activeTasks,
          productivity: statsRes.data.avgProductivity
        });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    
    fetchData();
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-auto">
      {/* Header */}
      <motion.header 
        className="bg-white/10 backdrop-blur-lg p-4 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
            Manager Dashboard
          </h1>
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/");
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto p-6 space-y-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[
            { title: "Team Members", value: stats.totalEmployees, color: "bg-blue-600" },
            { title: "Active Tasks", value: stats.activeTasks, color: "bg-purple-600" },
            { title: "Productivity", value: `${stats.productivity}%`, color: "bg-green-600" }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className={`${stat.color} rounded-2xl p-6 shadow-lg`}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-sm opacity-80">{stat.title}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Table */}
        <motion.div
          className="bg-white/5 rounded-2xl p-6 shadow-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Team Members</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 text-left">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Tasks</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.empId} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-4">{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, emp.taskCount || 0 * 20)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-900/50 text-green-300">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl shadow-lg transition text-left">
            <h3 className="font-medium text-blue-300">Assign New Task</h3>
            <p className="text-sm mt-2 text-gray-400">Create and delegate tasks</p>
          </button>
          <button className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl shadow-lg transition text-left">
            <h3 className="font-medium text-blue-300">Schedule Meeting</h3>
            <p className="text-sm mt-2 text-gray-400">Plan team discussions</p>
          </button>
          <button className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl shadow-lg transition text-left">
            <h3 className="font-medium text-blue-300">View Reports</h3>
            <p className="text-sm mt-2 text-gray-400">Analyze productivity</p>
          </button>
        </motion.div>
      </main>
    </div>
  );
};
export default ManagerDashboard;