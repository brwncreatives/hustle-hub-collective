import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

export function HeroSection() {
  const { user } = useAuth();

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Transform Your Goals into Reality
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Join Hustle Hub and turn your aspirations into achievements. Track your progress,
            celebrate wins, and stay motivated with our unique goal-tracking system.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {!user ? (
              <Button asChild size="lg" className="gap-2">
                <Link to="/join-group">
                  <Rocket className="h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link to="/create-goal">Create Your First Goal</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}