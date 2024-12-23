import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface HeaderProps {
  user: any;
  signOut: () => void;
}

export const Header = ({ user, signOut }: HeaderProps) => {
  // Get the full name from user metadata, fallback to email-based name if not available
  const firstName = user.user_metadata?.first_name;
  const lastName = user.user_metadata?.last_name;
  
  // If no metadata name is available, extract from email as fallback
  let displayName = `${firstName || ''} ${lastName || ''}`.trim();
  if (!displayName) {
    const emailName = user.email?.split('@')[0] || '';
    const [firstPart, lastPart] = emailName.split(/[._-]/).map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    );
    displayName = firstPart && lastPart ? `${firstPart} ${lastPart}` : firstPart || 'User';
  }
  
  // Get initials for avatar fallback
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 
    displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-primary text-center">Hustle Saturday</h1>
      <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Avatar className="border-2 border-primary">
            <AvatarImage src={user.user_metadata.avatar_url || "https://github.com/shadcn.png"} />
            <AvatarFallback className="bg-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-xl text-primary">
              Welcome Back
            </h2>
            <p className="text-sm text-muted-foreground">{displayName}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => signOut()}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <Trophy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};