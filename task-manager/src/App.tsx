import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Register from "./components/Auth/SignUp";
import Login from "./components/Auth/LoginPage";
import TaskList from "./components/taskList";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tasklist" element={<TaskList />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
