import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import GoalCreation from "./pages/GoalCreation";
import GoalEdit from "./pages/GoalEdit";
import GroupLanding from "./pages/GroupLanding";
import GroupManagement from "./pages/GroupManagement";
import GroupCreation from "./pages/GroupCreation";
import Settings from "./pages/Settings";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import { useAuth } from "./contexts/AuthContext";
import { AuthForms } from "./components/AuthForms";

const AuthCallback = () => {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        window.location.href = "/dashboard";
      }
    });
  }, []);

  return null;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/auth/login" element={user ? <Navigate to="/dashboard" /> : <AuthForms />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Index />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-goal"
        element={
          <PrivateRoute>
            <GoalCreation />
          </PrivateRoute>
        }
      />
      <Route
        path="/manage-goal/:goalId"
        element={
          <PrivateRoute>
            <GoalEdit />
          </PrivateRoute>
        }
      />
      <Route path="/join-group" element={<GroupLanding />} />
      <Route
        path="/create-group"
        element={
          <PrivateRoute>
            <GroupCreation />
          </PrivateRoute>
        }
      />
      <Route
        path="/manage-group/:groupId"
        element={
          <PrivateRoute>
            <GroupManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;