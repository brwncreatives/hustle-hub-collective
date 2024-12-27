import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: any;
  signOut: () => void;
}

export const Header = ({ user, signOut }: HeaderProps) => {
  const navigate = useNavigate();
  
  // Safely access user metadata with null checks
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const avatarUrl = user?.user_metadata?.avatar_url;
  
  let displayName = firstName;
  if (!displayName && user?.email) {
    const emailName = user.email.split('@')[0];
    const [firstPart] = emailName.split(/[._-]/).map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    );
    displayName = firstPart || 'User';
  }
  
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 
    displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg backdrop-blur-sm">
      <h1 
        onClick={() => navigate('/')} 
        className="text-3xl font-bold text-primary cursor-pointer hover:opacity-80"
      >
        Hustle Saturday
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="border-2 border-primary cursor-pointer hover:opacity-80">
            <AvatarImage src={avatarUrl || "https://github.com/shadcn.png"} />
            <AvatarFallback className="bg-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate('/')}>
            Home
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};