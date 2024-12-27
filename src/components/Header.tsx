import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";
import { Settings, LogOut, Users } from "lucide-react";

interface HeaderProps {
  user: User | null;
  signOut: () => Promise<void>;
}

export function Header({ user, signOut }: HeaderProps) {
  const firstName = user?.user_metadata?.first_name || "User";

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Hustle Hub
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/manage-group/1" className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Manage Group
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {firstName}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}