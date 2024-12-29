import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { LogIn } from "lucide-react";

interface HeaderProps {
  user: User | null;
  signOut: () => Promise<void>;
}

export function Header({ user }: HeaderProps) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth/login";

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Hustle Hub
        </Link>
        <div className="flex items-center gap-4">
          {!user && !isAuthPage && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}