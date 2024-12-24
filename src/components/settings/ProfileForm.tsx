import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zpbqzuazbmgyifhwphga.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYnF6dWF6Ym1neWlmaHdwaGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMjI0MTgsImV4cCI6MjA0OTY5ODQxOH0.HVvzkkFpq4m_AecBfYHyyVYHoZgJRIi8uxMxvBOBLmA'
);

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

const ProfileForm = ({ 
  firstName, 
  lastName, 
  avatarUrl,
  onFirstNameChange,
  onLastNameChange,
}: ProfileFormProps) => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
        }
      });

      if (error) throw error;

      toast({
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "Failed to update profile",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
};

export default ProfileForm;