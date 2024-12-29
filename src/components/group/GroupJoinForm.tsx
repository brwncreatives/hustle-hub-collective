import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const GroupJoinForm = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoinGroup = async () => {
    if (!inviteCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an invite code",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to join a group",
      });
      return;
    }

    setLoading(true);

    try {
      // First, verify the invite code exists and is valid
      const { data: inviteData, error: inviteError } = await supabase
        .from('group_invites')
        .select('group_id, status, expires_at')
        .eq('id', inviteCode)
        .single();

      if (inviteError || !inviteData) {
        throw new Error('Invalid invite code');
      }

      if (inviteData.status !== 'pending') {
        throw new Error('This invite has already been used');
      }

      if (new Date(inviteData.expires_at) < new Date()) {
        throw new Error('This invite has expired');
      }

      // Check if user is already a member
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', inviteData.group_id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        throw new Error('You are already a member of this group');
      }

      // Join the group
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_id: inviteData.group_id,
          user_id: user.id,
          role: 'member'
        });

      if (joinError) {
        throw joinError;
      }

      // Update invite status
      await supabase
        .from('group_invites')
        .update({ status: 'accepted' })
        .eq('id', inviteCode);

      toast({
        title: "Success",
        description: "You have successfully joined the group",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to join group",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Input
        placeholder="Enter invite code"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        disabled={loading}
      />
      <Button onClick={handleJoinGroup} disabled={loading}>
        {loading ? "Joining..." : "Join Group"}
      </Button>
    </div>
  );
};