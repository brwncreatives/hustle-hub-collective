import { Header } from "@/components/Header";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { ActiveGoals } from "@/components/ActiveGoals";
import { AccountabilityGroups } from "@/components/AccountabilityGroups";
import { MemberFeed } from "@/components/MemberFeed";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} signOut={signOut} />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <MotivationalQuote />
        <ActiveGoals />
        <AccountabilityGroups />
        <MemberFeed />
      </div>
    </div>
  );
};

export default Dashboard;