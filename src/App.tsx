import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import GoalCreation from "@/pages/GoalCreation";
import GoalEdit from "@/pages/GoalEdit";
import GroupCreation from "@/pages/GroupCreation";
import GroupLanding from "@/pages/GroupLanding";
import GroupManagement from "@/pages/GroupManagement";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={!user ? <Landing /> : <Navigate to="/dashboard" replace />}
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
        path="/group/:groupId"
        element={
          <ProtectedRoute>
            <GroupLanding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/group/:groupId/manage"
        element={
          <ProtectedRoute>
            <GroupManagement />
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
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;