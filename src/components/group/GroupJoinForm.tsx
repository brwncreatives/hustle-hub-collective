import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const GroupJoinForm = () => {
  const [inviteCode, setInviteCode] = useState("");
  const { toast } = useToast();

  const handleJoinGroup = async () => {
    if (!inviteCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an invite code",
      });
      return;
    }

    try {
      // Here we'll implement the group joining logic
      toast({
        title: "Success",
        description: "Group joined successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to join group",
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Input
        placeholder="Enter invite code"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
      />
      <Button onClick={handleJoinGroup}>Join Group</Button>
    </div>
  );
};