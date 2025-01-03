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
      const { data, error } = await supabase
        .from("group_members")
        .select(`
          group_id,
          role,
          groups:groups (
            id,
            name
          )
        `)
        .eq("user_id", user?.id);

      if (error) {
        throw error;
      }

      return data as unknown as GroupMemberResponse[];
    },
    enabled: !!user?.id,
  });

  const handleGroupClick = (groupId: string) => {
    navigate(`/manage-group/${groupId}`);
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