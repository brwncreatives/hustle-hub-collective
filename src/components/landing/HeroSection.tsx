import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SubwayLogo } from "./SubwayLogo";

export function HeroSection() {
  const { user } = useAuth();

  return (
    <div className="relative isolate px-6 pt-4 lg:px-8">
      <div className="mx-auto max-w-3xl py-8 sm:py-12 lg:py-16">
        <div className="space-y-8">
          <div className="text-center">
            <SubwayLogo />
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl mt-6">
              Pour Into Your Dreams. Build With Your Community.
            </h1>
          </div>
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-lg leading-8 text-muted-foreground text-left">
              Hustle Saturday is your time to stop giving all your energy to everyone else and start investing in yourself.
            </p>
            <p className="text-lg leading-8 text-muted-foreground text-left">
              Hustle Saturday began as a simple idea: a Saturday morning meetup where we'd spend 1-3 hours working on the things we kept putting off. 
              It was a time to focus, support each other, and make real progress.
            </p>
            <p className="text-lg leading-8 text-muted-foreground text-left">
              Create an accountability group, set your goals, and achieve more—together.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-x-6 pt-4">
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