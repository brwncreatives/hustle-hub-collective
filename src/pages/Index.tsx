import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForms } from "@/components/AuthForms";
import { MemberFeed } from "@/components/MemberFeed";
import { Header } from "@/components/Header";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { ActiveGoals } from "@/components/ActiveGoals";
import { AccountabilityGroups } from "@/components/AccountabilityGroups";
import { WeeklyRecapSection } from "@/components/goal/WeeklyRecapSection";
import { GoalBingoCard } from "@/components/goal/GoalBingoCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

const Index = () => {
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();
  const [useBingoView, setUseBingoView] = useState(() => {
    const stored = localStorage.getItem('preferredView');
    return stored ? stored === 'bingo' : false;
  });

  useEffect(() => {
    localStorage.setItem('preferredView', useBingoView ? 'bingo' : 'list');
  }, [useBingoView]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <AuthForms />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted text-foreground">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-md md:max-w-2xl">
        <Header user={user} signOut={signOut} />
        <MotivationalQuote />
        
        <div className="flex items-center space-x-2 bg-card p-4 rounded-lg shadow-sm">
          <Switch
            id="view-toggle"
            checked={useBingoView}
            onCheckedChange={setUseBingoView}
          />
          <Label htmlFor="view-toggle">
            {useBingoView ? "Using Bingo Card View" : "Using Weekly Task List"}
          </Label>
        </div>

        {useBingoView ? (
          <GoalBingoCard />
        ) : (
          <ActiveGoals />
        )}
        
        <WeeklyRecapSection goalId="global" />
        <MemberFeed />
        <AccountabilityGroups />
      </div>
    </div>
  );
};

export default Index;