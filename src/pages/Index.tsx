import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForms } from "@/components/AuthForms";
import { MemberFeed } from "@/components/MemberFeed";
import { Header } from "@/components/Header";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { ActiveGoals } from "@/components/ActiveGoals";
import { AccountabilityGroups } from "@/components/AccountabilityGroups";

const Index = () => {
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#221F26]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-[#221F26] to-[#403E43]">
        <AuthForms />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#221F26] to-[#403E43] text-white">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-md md:max-w-2xl">
        <Header user={user} signOut={signOut} />
        <MotivationalQuote />
        <ActiveGoals />
        <MemberFeed />
        <AccountabilityGroups />
      </div>
    </div>
  );
};

export default Index;