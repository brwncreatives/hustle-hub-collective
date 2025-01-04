import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import Settings from "@/pages/Settings";
import GoalCreation from "@/pages/GoalCreation";
import GoalEdit from "@/pages/GoalEdit";
import GroupCreation from "@/pages/GroupCreation";
import GroupManagement from "@/pages/GroupManagement";

import "./App.css";

const queryClient = new QueryClient();

// Get the base URL from the environment or default to '/'
const baseUrl = import.meta.env.BASE_URL || '/';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router basename={baseUrl}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-goal" 
                element={
                  <ProtectedRoute>
                    <GoalCreation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-goal/:goalId" 
                element={
                  <ProtectedRoute>
                    <GoalEdit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-group" 
                element={
                  <ProtectedRoute>
                    <GroupCreation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manage-group/:groupId" 
                element={
                  <ProtectedRoute>
                    <GroupManagement />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;