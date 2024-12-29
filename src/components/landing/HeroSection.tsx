import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const { user } = useAuth();

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000 sm:text-6xl">
            Pour Into Your Dreams. Build With Your Community.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom-5 duration-1000">
            Hustle Saturday is your time to stop giving all your energy to everyone else and start investing in yourself. 
            Create an accountability group, set your goals, and achieve more—together.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 animate-in slide-in-from-bottom-6 duration-1000">
            {!user ? (
              <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                <Link to="/auth/login">
                  Request to Create or Join a Group Today
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                <Link to="/create-goal">Create Your First Goal</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}