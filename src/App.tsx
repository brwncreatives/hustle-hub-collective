import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import GoalCreation from "./pages/GoalCreation";
import GoalEdit from "./pages/GoalEdit";
import GroupLanding from "./pages/GroupLanding";
import GroupManagement from "./pages/GroupManagement";
import Settings from "./pages/Settings";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

const AuthCallback = () => {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        window.location.href = "/";
      }
    });
  }, []);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-goal" element={<GoalCreation />} />
            <Route path="/manage-goal/:goalId" element={<GoalEdit />} />
            <Route path="/join-group" element={<GroupLanding />} />
            <Route path="/manage-group/:groupId" element={<GroupManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;