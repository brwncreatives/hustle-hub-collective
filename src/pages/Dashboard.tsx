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
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">
      {/* Metro-inspired flowing background with adjusted opacity */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 opacity-[0.08]"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, transparent 20%, #666666 20.5%, transparent 21%),
              radial-gradient(circle at 0% 50%, transparent 30%, #666666 30.5%, transparent 31%),
              radial-gradient(circle at 100% 50%, transparent 40%, #666666 40.5%, transparent 41%)
            `,
            backgroundSize: '60px 60px',
            transform: 'rotate(-15deg)',
          }}
        />
      </div>

      {/* Decorative subway lines */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg className="absolute w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M -10,20 Q 30,40 70,20 T 110,40" fill="none" stroke="#ea384c" strokeWidth="0.5" />
          <path d="M -10,40 Q 40,60 80,40 T 110,60" fill="none" stroke="#0EA5E9" strokeWidth="0.5" />
          <path d="M -10,60 Q 50,80 90,60 T 110,80" fill="none" stroke="#22c55e" strokeWidth="0.5" />
          <path d="M -10,80 Q 60,100 100,80 T 110,100" fill="none" stroke="#F97316" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10">
        <Header user={user} signOut={signOut} />
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-[#9b87f5] ring-offset-2 ring-offset-[#121212]">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome, {user?.user_metadata?.first_name || 'User'}!
              </h2>
              <p className="text-white/60">Let's make progress on your goals today</p>
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
    </div>
  );
};

export default Dashboard;