import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function BottomCTA() {
  const { user } = useAuth();

  return (
    <div className="py-24 sm:py-32 bg-gradient-to-br from-background to-muted/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent sm:text-4xl mb-6">
            Ready to Start Your Journey?
          </h2>
          <div className="mt-10 flex items-center justify-center">
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