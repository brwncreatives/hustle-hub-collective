import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForms } from "@/components/AuthForms";
import { MemberFeed } from "@/components/MemberFeed";
import { Header } from "@/components/Header";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { ActiveGoals } from "@/components/ActiveGoals";
import { WeeklyRecapSection } from "@/components/goal/WeeklyRecapSection";
import { Onboarding } from "@/components/Onboarding";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      if (user) {
        try {
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .maybeSingle();

          if (fetchError) {
            console.error('Error fetching profile:', fetchError);
            throw fetchError;
          }

          if (!profile) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: user.id,
                  onboarding_completed: false,
                }
              ]);

            if (insertError) {
              console.error('Error creating profile:', insertError);
              throw insertError;
            }

            setOnboardingCompleted(false);
          } else {
            setOnboardingCompleted(profile.onboarding_completed ?? false);
          }
        } catch (error: any) {
          console.error('Error in fetchOnboardingStatus:', error);
          toast({
            variant: "destructive",
            description: "Failed to fetch onboarding status. Please try refreshing the page.",
          });
        }
      }
    };

    fetchOnboardingStatus();
  }, [user, toast]);

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

  if (onboardingCompleted === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted text-foreground">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Header user={user} signOut={signOut} />
          <Onboarding />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted text-foreground">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-md md:max-w-2xl">
        <Header user={user} signOut={signOut} />
        <MotivationalQuote />
        <ActiveGoals />
        <WeeklyRecapSection goalId="global" />
        <MemberFeed />
      </div>
    </div>
  );
};

export default Index;