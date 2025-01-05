import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Group {
  id: string;
  name: string;
}

interface GroupMember {
  group_id: string;
  role: string;
  groups: Group;
}

const AccountabilityGroups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: memberGroups, isLoading } = useQuery({
    queryKey: ["memberGroups", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log("Fetching groups for user:", user.id);
      
      try {
        const { data, error } = await supabase
          .from('group_members')
          .select(`
            group_id,
            role,
            groups (
              id,
              name
            )
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error("Error fetching groups:", error);
          toast({
            title: "Error",
            description: "Failed to fetch your groups. Please try again.",
            variant: "destructive",
          });
          return [];
        }

        // Filter out any null groups and transform the data
        return (data || [])
          .filter(item => item.groups) // Remove any items with null groups
          .map(item => ({
            group_id: item.group_id,
            role: item.role,
            groups: {
              id: item.groups.id,
              name: item.groups.name
            }
          })) as GroupMember[];
      } catch (error) {
        console.error("Error in groups query:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!user?.id,
  });

  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Loading Groups...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-12 bg-muted rounded-lg" />
              <div className="h-12 bg-muted rounded-lg" />
              <div className="h-12 bg-muted rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
        {!memberGroups?.length ? (
          <p className="text-muted-foreground text-center py-4">
            You haven't joined any groups yet.
          </p>
        ) : (
          memberGroups.map((memberGroup) => (
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
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AccountabilityGroups;