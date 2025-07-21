import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [newTask, setNewTask] = useState("");
  const [workMode, setWorkMode] = useState(localStorage.getItem("workMode") || "office");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeWorkLog, setActiveWorkLog] = useState({}); // Track active work logs by task ID

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:8081/api/employees/email/current", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployeeData(data);
        
        const tasksRes = await axios.get(`http://localhost:8081/api/assignments/employee/${data.empId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasksRes.data);
        
        const meetingsRes = await axios.get(`http://localhost:8081/api/meetings/employee/${data.empId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMeetings(meetingsRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8081/api/tasks",
        {
          title: newTask,
          employeeId: employeeData.empId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const assignmentRes = await axios.post(
        "http://localhost:8081/api/assignments",
        {
          taskId: res.data.id,
          employeeId: employeeData.empId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTasks([...tasks, assignmentRes.data]);
      setNewTask("");
      setShowTaskForm(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleWorkModeChange = (mode) => {
    setWorkMode(mode);
    localStorage.setItem("workMode", mode);
  };

  const handleClockIn = async (taskId, assignmentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8081/api/worklogs/start",
        {
          date: new Date().toISOString().split("T")[0],
          clockIn: new Date().toISOString().slice(11, 19),
          isWorkFromHome: workMode === "wfh",
          employeeId: employeeData.empId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveWorkLog({ ...activeWorkLog, [taskId]: res.data.id });

      // Update task status to "In Progress"
      await axios.put(
        `http://localhost:8081/api/assignments/${assignmentId}`,
        { status: "In Progress", completionPercentage: activeWorkLog[taskId] ? 50 : 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh tasks
      const tasksRes = await axios.get(`http://localhost:8081/api/assignments/employee/${employeeData.empId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Clock-in error:", err);
    }
  };

  const handleClockOut = async (taskId, assignmentId) => {
    try {
      const token = localStorage.getItem("token");
      const workLogId = activeWorkLog[taskId];
      await axios.put(
        `http://localhost:8081/api/worklogs/end/${workLogId}`,
        {
          clockOut: new Date().toISOString().slice(11, 19),
          lunchBreakMinutes: 30, // Example: assume 30 min lunch break
          idleMinutes: 0, // Example: assume no idle time
          isWorkFromHome: workMode === "wfh",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update task status to "Completed"
      await axios.put(
        `http://localhost:8081/api/assignments/${assignmentId}`,
        { status: "Completed", completionPercentage: 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from active work logs
      const newActiveWorkLog = { ...activeWorkLog };
      delete newActiveWorkLog[taskId];
      setActiveWorkLog(newActiveWorkLog);

      // Refresh tasks
      const tasksRes = await axios.get(`http://localhost:8081/api/assignments/employee/${employeeData.empId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Clock-out error:", err);
    }
  };

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
            Employee Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 rounded-full p-1">
              <button
                onClick={() => handleWorkModeChange("office")}
                className={`px-3 py-1 rounded-full text-sm ${workMode === "office" ? "bg-blue-600" : "hover:bg-white/5"}`}
              >
                Office
              </button>
              <button
                onClick={() => handleWorkModeChange("wfh")}
                className={`px-3 py-1 rounded-full text-sm ${workMode === "wfh" ? "bg-green-600" : "hover:bg-white/5"}`}
              >
                WFH
              </button>
            </div>
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
        </div>
      </motion.header>

      {/* Tab Navigation */}
      <div className="container mx-auto px-6 pt-4">
        <div className="flex space-x-2 border-b border-white/10">
          {["profile", "tasks", "meetings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                activeTab === tab 
                  ? "bg-blue-600 text-white" 
                  : "text-blue-300 hover:bg-white/5"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 rounded-b-2xl rounded-tr-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4 text-blue-300">My Profile</h2>
            {employeeData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400">Name</p>
                    <p className="text-lg">{employeeData.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-lg">{employeeData.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400">Department</p>
                    <p className="text-lg">{employeeData.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Work Mode</p>
                    <p className="text-lg capitalize">{workMode}</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-gray-400">Current Status</p>
                  <p className="text-lg text-green-400">Active</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {workMode === "wfh" ? "Working from home" : "Working in office"}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 rounded-b-2xl rounded-tr-2xl p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-300">My Tasks</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                >
                  {showTaskForm ? "Cancel" : "Add Task"}
                </button>
              </div>
            </div>

            {showTaskForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter task description"
                    className="flex-1 px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddTask}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <motion.div
                    key={task.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{task.task.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Due: {new Date(task.task.dueDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-400">
                          Priority: {task.task.priority} | Complexity: {task.task.complexity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            task.status === "Completed" 
                              ? "bg-green-900/50 text-green-300" 
                              : "bg-yellow-900/50 text-yellow-300"
                          }`}
                        >
                          {task.status}
                        </span>
                        {task.status !== "Completed" && (
                          <>
                            {activeWorkLog[task.task.id] ? (
                              <button
                                onClick={() => handleClockOut(task.task.id, task.id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
                              >
                                Clock Out
                              </button>
                            ) : (
                              <button
                                onClick={() => handleClockIn(task.task.id, task.id)}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                              >
                                Clock In
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center mt-3">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${task.completionPercentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm">{task.completionPercentage}%</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No tasks assigned yet
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Meetings Tab */}
        {activeTab === "meetings" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 rounded-b-2xl rounded-tr-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-6 text-blue-300">Upcoming Meetings</h2>
            <div className="space-y-4">
              {meetings.length > 0 ? (
                meetings.map(meeting => (
                  <motion.div
                    key={meeting.id}
                    whileHover={{ y: -2 }}
                    className="p-4 bg-white/5 rounded-lg border-l-4 border-blue-500 hover:bg-white/10 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{meeting.topic}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(meeting.date).toLocaleDateString()} • {meeting.durationMinutes} mins
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full">
                        {meeting.meetingType}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-300">{meeting.note}</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No upcoming meetings
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;