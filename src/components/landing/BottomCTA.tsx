import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function BottomCTA() {
  const { user } = useAuth();

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            Ready to Start Your Journey?
          </h2>
          <div className="mt-10 flex items-center justify-center">
            {!user ? (
              <Button asChild size="lg" className="gap-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 transition-colors">
                <Link to="/auth/login">
                  Request to Create a Group Today
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 transition-colors">
                <Link to="/request-group">Request to Create a Group</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}