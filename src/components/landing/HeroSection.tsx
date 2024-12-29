import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const { user } = useAuth();

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Pour Into Your Dreams. Build With Your Community.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Hustle Saturday is your time to stop giving all your energy to everyone else and start investing in yourself. 
            Create an accountability group, set your goals, and achieve more—together.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {!user ? (
              <Button asChild size="lg" className="gap-2">
                <Link to="/auth/login">
                  Request to Create or Join a Group Today
                  <ArrowRight className="h-4 w-4" />
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