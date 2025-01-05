import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface GroupMemberResponse {
  group_id: string;
  role: string;
  groups: {
    id: string;
    name: string;
  };
}

const AccountabilityGroups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: memberGroups, isLoading } = useQuery({
    queryKey: ["memberGroups", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log("Fetching groups for user:", user.id);
      
      // First, get all groups where user is either a member or owner
      const { data: groups, error: groupsError } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          group_members!inner (
            role
          )
        `)
        .eq('group_members.user_id', user.id);

      if (groupsError) {
        console.error("Error fetching groups:", groupsError);
        throw groupsError;
      }

      // Transform the data to match the expected format
      const formattedGroups = groups?.map(group => ({
        group_id: group.id,
        role: group.group_members[0]?.role || 'member',
        groups: {
          id: group.id,
          name: group.name
        }
      })) || [];

      console.log("Formatted groups:", formattedGroups);
      return formattedGroups as GroupMemberResponse[];
    },
    enabled: !!user?.id,
  });

  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          Your Accountability Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {memberGroups?.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            You haven't joined any groups yet.
          </p>
        )}
        {memberGroups?.map((memberGroup) => (
          <div
            key={memberGroup.group_id}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer"
            onClick={() => handleGroupClick(memberGroup.groups.id)}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{memberGroup.groups.name}</p>
                <p className="text-sm text-muted-foreground">
                  Role: {memberGroup.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AccountabilityGroups;