import { Header } from "@/components/Header";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { ActiveGoals } from "@/components/ActiveGoals";
import AccountabilityGroups from "@/components/AccountabilityGroups";
import { MemberFeed } from "@/components/MemberFeed";
import { WeeklyRecapSection } from "@/components/goal/WeeklyRecapSection";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMostRecentGoal = async () => {
      if (!user) return;
      
      const { data: goals, error } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && goals && goals.length > 0) {
        setActiveGoalId(goals[0].id);
      }
    };

    const fetchUserProfile = async () => {
      if (!user) return;
      
      const { data: { user: userData } } = await supabase.auth.getUser();
      if (userData?.user_metadata?.avatar_url) {
        setAvatarUrl(userData.user_metadata.avatar_url);
      }
    };

    fetchMostRecentGoal();
    fetchUserProfile();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} signOut={signOut} />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">
              Welcome, {user?.user_metadata?.first_name || 'User'}!
            </h2>
          </div>
        </div>
        <MotivationalQuote />
        <ActiveGoals />
        {activeGoalId && (
          <WeeklyRecapSection goalId={activeGoalId} showPastRecaps={true} />
        )}
        <AccountabilityGroups />
        <MemberFeed />
      </div>
    </div>
  );
};

export default Dashboard;