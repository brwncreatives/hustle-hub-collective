import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface HeaderProps {
  user: any;
  signOut: () => void;
}

export const Header = ({ user, signOut }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between bg-[#F97316]/10 p-4 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Avatar className="border-2 border-[#F97316]">
          <AvatarImage src={user.user_metadata.avatar_url || "https://github.com/shadcn.png"} />
          <AvatarFallback className="bg-[#F97316]">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-xl bg-gradient-to-r from-[#F97316] to-[#D946EF] text-transparent bg-clip-text">
            Welcome to the Hustle
          </h2>
          <p className="text-sm text-[#F97316]/80">{user.email}</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => signOut()}
        className="border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white transition-all"
      >
        <Trophy className="h-4 w-4" />
      </Button>
    </div>
  );
};