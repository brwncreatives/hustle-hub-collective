import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InviteFormProps {
  groupId: string;
}

export const InviteForm = ({ groupId }: InviteFormProps) => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const sendEmailInvite = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an email address",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('group_invites')
        .insert([
          { 
            group_id: groupId,
            email: email,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send invite",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });
      setEmail("");
    } catch (error) {
      console.error('Error sending invite:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send invite",
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Input
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={sendEmailInvite}>
        <Mail className="mr-2 h-4 w-4" />
        Send
      </Button>
    </div>
  );
};