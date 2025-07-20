import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import LoginLanding from "./pages/LoginLanding";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";

// Updated ProtectedRoute component
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Convert both to uppercase for consistent comparison
  if (requiredRole && role?.toUpperCase() !== requiredRole.toUpperCase()) {
    return <Navigate to={role?.toUpperCase() === "MANAGER" ? "/manager" : "/employee"} replace />;
  }

  return children;
};

function App() {
  // Remove unnecessary state - using localStorage directly is more reliable
  useEffect(() => {
    // This is just for debugging
    console.log("Current auth status:", {
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role")
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginLanding />} />
        
        {/* Protected Routes - using uppercase roles to match backend */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute requiredRole="EMPLOYEE">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/manager"
          element={
            <ProtectedRoute requiredRole="MANAGER">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;