import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import Settings from "@/pages/Settings";
import GoalCreation from "@/pages/GoalCreation";
import GoalEdit from "@/pages/GoalEdit";
import GroupCreation from "@/pages/GroupCreation";
import GroupManagement from "@/pages/GroupManagement";
import { useAuth } from "@/contexts/AuthContext";

export function Router() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user ? <Navigate to="/dashboard" replace /> : <Landing />
        } 
      />
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
        path="/goals/new" 
        element={
          <ProtectedRoute>
            <GoalCreation />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/goals/:goalId/edit" 
        element={
          <ProtectedRoute>
            <GoalEdit />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/groups/new" 
        element={
          <ProtectedRoute>
            <GroupCreation />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/groups/:groupId" 
        element={
          <ProtectedRoute>
            <GroupManagement />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}