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

const Index = () => {
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();

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
        <GoalBingoCard />
        <ActiveGoals />
        <WeeklyRecapSection goalId="global" />
        <MemberFeed />
        <AccountabilityGroups />
      </div>
    </div>
  );
};

export default Index;