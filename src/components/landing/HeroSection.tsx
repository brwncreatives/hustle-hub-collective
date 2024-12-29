import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SubwayLogo } from "./SubwayLogo";

export function HeroSection() {
  const { user } = useAuth();

  return (
    <div className="relative isolate px-6 pt-4 lg:px-8">
      <div className="mx-auto max-w-3xl py-12 sm:py-20 lg:py-28">
        <div className="text-center space-y-8">
          <SubwayLogo />
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Pour Into Your Dreams. Build With Your Community.
          </h1>
          <div className="space-y-6">
            <p className="text-lg leading-8 text-muted-foreground">
              Hustle Saturday began as a simple idea: a Saturday morning meetup where we'd spend 1-3 hours working on the things we kept putting off. 
              It was a time to focus, support each other, and make real progress.
            </p>
            <p className="text-lg leading-8 text-muted-foreground">
              Create an accountability group, set your goals, and achieve more—together.
            </p>
          </div>
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