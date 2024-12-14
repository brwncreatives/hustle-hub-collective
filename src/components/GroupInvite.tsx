import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zpbqzuazbmgyifhwphga.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYnF6dWF6Ym1neWlmaHdwaGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMjI0MTgsImV4cCI6MjA0OTY5ODQxOH0.HVvzkkFpq4m_AecBfYHyyVYHoZgJRIi8uxMxvBOBLmA'
);

interface GroupInviteProps {
  groupId: string;
  groupName: string;
}

const GroupInvite = ({ groupId, groupName }: GroupInviteProps) => {
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateInviteCode = async () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setInviteCode(code);
    
    const { error } = await supabase
      .from('group_invites')
      .insert([
        { 
          group_id: groupId,
          code: code,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        }
      ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate invite code",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Invite code generated successfully",
    });
  };

  const sendEmailInvite = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an email address",
      });
      return;
    }

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
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
        <CardDescription>
          Invite people to join {groupName} via email or share an invite code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Invitation</Label>
          <div className="flex space-x-2">
            <Input
              id="email"
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
        </div>

        <div className="space-y-2">
          <Label>Invite Code</Label>
          <div className="flex space-x-2">
            <Input
              readOnly
              value={inviteCode}
              placeholder="Generate an invite code"
            />
            {inviteCode ? (
              <Button onClick={copyInviteCode}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <Button onClick={generateInviteCode}>Generate</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupInvite;