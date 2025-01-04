import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings, User } from "lucide-react";
import GroupInvite from "@/components/GroupInvite";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface GroupMember {
  id: string;
  user_id: string;
  role: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    id: string;
  };
}

const GroupManagement = () => {
  const { id: groupId } = useParams();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState("");

  // Fetch group data
  const { data: groupData } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .single();

      if (error) {
        console.error("Error fetching group:", error);
        throw error;
      }

      setGroupName(data.name);
      return data;
    },
    enabled: !!groupId,
  });

  // Fetch group members
  const { data: members } = useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select(`
          id,
          user_id,
          role,
          profiles:profiles (
            first_name,
            last_name,
            id
          )
        `)
        .eq("group_id", groupId);

      if (error) {
        console.error("Error fetching members:", error);
        throw error;
      }

      return data as GroupMember[];
    },
    enabled: !!groupId,
  });

  const handleSaveGroupName = async () => {
    try {
      const { error } = await supabase
        .from("groups")
        .update({ name: groupName })
        .eq("id", groupId);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Group name updated successfully",
      });
    } catch (error) {
      console.error("Error updating group name:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update group name",
      });
    }
  };

  if (!groupData || !members) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} signOut={signOut} />
        <div className="container mx-auto px-4 py-8">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} signOut={signOut} />
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="max-w-[200px]"
                    />
                    <Button size="sm" onClick={handleSaveGroupName}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <CardTitle className="flex items-center gap-2">
                    {groupName}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-lg font-semibold">Members</Label>
              <div className="mt-4 space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {member.profiles.first_name} {member.profiles.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.profiles.id}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <GroupInvite groupId={groupId || ""} groupName={groupName} />
      </div>
    </div>
  );
};

export default GroupManagement;