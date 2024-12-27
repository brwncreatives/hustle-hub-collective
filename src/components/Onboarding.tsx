import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const totalSteps = 3;

  const completeOnboarding = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        description: "Welcome to Hustle Hub! Let's start achieving your goals.",
      });

      // Force reload to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        variant: "destructive",
        description: "There was an error completing your onboarding. Please try again.",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <CardTitle>Welcome to Hustle Hub! 🎉</CardTitle>
            <CardDescription className="mt-4">
              We're excited to help you achieve your goals. Let's get started with a quick tour.
            </CardDescription>
          </>
        );
      case 2:
        return (
          <>
            <CardTitle>Set Your Goals 🎯</CardTitle>
            <CardDescription className="mt-4">
              Create weekly goals and break them down into manageable tasks. Track your progress and celebrate your wins!
            </CardDescription>
          </>
        );
      case 3:
        return (
          <>
            <CardTitle>Join the Community 🤝</CardTitle>
            <CardDescription className="mt-4">
              Connect with like-minded individuals, share your progress, and stay accountable to your goals.
            </CardDescription>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center justify-center space-x-2 mb-4">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index + 1 <= currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        {renderStep()}
      </CardHeader>
      <CardContent className="flex justify-between">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
        )}
        <div className="flex-1" />
        {currentStep < totalSteps ? (
          <Button onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}>
            Next
          </Button>
        ) : (
          <Button onClick={completeOnboarding}>Get Started</Button>
        )}
      </CardContent>
    </Card>
  );
}