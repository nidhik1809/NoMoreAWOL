import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const AssignTaskModal = ({ isOpen, onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [task, setTask] = useState({
    title: "",
    description: "",
    estimatedHours: "",
    priority: "Medium",
    complexity: "Medium",
    dueDate: "",
    employeeId: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8081/api/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch (err) {
        setErrorMessage("Failed to fetch employees");
      }
    };
    if (isOpen) fetchEmployees();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // First, create the task
      const taskRes = await axios.post(
        "http://localhost:8081/api/tasks",
        {
          title: task.title,
          description: task.description,
          estimatedHours: parseInt(task.estimatedHours),
          priority: task.priority,
          complexity: task.complexity,
          dueDate: task.dueDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Then, assign the task to the employee
      await axios.post(
        "http://localhost:8081/api/assignments",
        {
          taskId: taskRes.data.id,
          employeeId: task.employeeId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onClose(); // Close modal on success
      setTask({
        title: "",
        description: "",
        estimatedHours: "",
        priority: "Medium",
        complexity: "Medium",
        dueDate: "",
        employeeId: "",
      });
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Failed to assign task: " + (err.response?.data?.message || "Server error"));
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-lg max-h-[80vh] overflow-y-auto rounded-2xl p-8 w-full max-w-md text-white"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-300">Assign New Task</h2>
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Employee</label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.employeeId}
              onChange={(e) => setTask({ ...task, employeeId: e.target.value })}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.empId} value={emp.empId} className="bg-[#1a1a1a]">
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Task Title</label>
            <input
              type="text"
              placeholder="Enter task title"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Description</label>
            <textarea
              placeholder="Enter task description"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Estimated Hours</label>
            <input
              type="number"
              placeholder="Enter estimated hours"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.estimatedHours}
              onChange={(e) => setTask({ ...task, estimatedHours: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Priority</label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            >
              <option value="Low" className="bg-[#1a1a1a]">Low</option>
              <option value="Medium" className="bg-[#1a1a1a]">Medium</option>
              <option value="High" className="bg-[#1a1a1a]">High</option>
              <option value="Urgent" className="bg-[#1a1a1a]">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Complexity</label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.complexity}
              onChange={(e) => setTask({ ...task, complexity: e.target.value })}
            >
              <option value="Simple" className="bg-[#1a1a1a]">Simple</option>
              <option value="Medium" className="bg-[#1a1a1a]">Medium</option>
              <option value="Complex" className="bg-[#1a1a1a]">Complex</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Due Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.dueDate}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Assign Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AssignTaskModal;