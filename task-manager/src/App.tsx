import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Register from "./components/Auth/SignUp";
import Login from "./components/Auth/LoginPage";
import TaskList from "./components/taskList";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/tasklist" replace /> : <Register />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/tasklist" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />
            } 
          />
          {/* Public Routes */}

          <Route 
            path="/tasklist" 
            element={
              isAuthenticated ? <TaskList /> : <Navigate to="/login" replace />
            } 
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
