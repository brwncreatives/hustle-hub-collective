import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SubwayLogo } from "./SubwayLogo";

export function HeroSection() {
  const { user } = useAuth();

  return (
    <div className="relative isolate px-6 pt-4 lg:px-8">
      <div className="mx-auto max-w-3xl py-8 sm:py-12">
        <div className="space-y-8">
          <div className="text-center">
            <SubwayLogo />
            <h1 className="text-4xl font-bold tracking-tight text-[#221F26] sm:text-6xl mt-6">
              Pour Into Your Dreams. Build With Your Community.
            </h1>
          </div>
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-lg leading-8 text-[#403E43] text-left">
              Hustle Saturday is your time to stop pouring all your energy into others and start investing in yourself.
            </p>
            <p className="text-lg leading-8 text-[#403E43] text-left">
              What started as a simple Saturday morning meetup—spending 1-3 hours tackling the things we kept putting off—quickly became a space to focus, support one another, and make real progress.
            </p>
            <p className="text-lg leading-8 text-[#403E43] text-left">
              Now, it's your turn. Create an accountability group, set your goals, and achieve more—together.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-x-6">
            {!user ? (
              <Button 
                asChild 
                size="lg" 
                className="gap-2 bg-[#9b87f5] hover:bg-[#7E69AB] transition-colors"
              >
                <Link to="/auth/login">
                  Request to Create a Group Today
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button 
                asChild 
                size="lg"
                className="bg-[#9b87f5] hover:bg-[#7E69AB] transition-colors"
              >
                <Link to="/request-group">Request to Create a Group</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}