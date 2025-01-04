import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Group {
  id: string;
  name: string;
  role: 'member' | 'admin';
}

interface GroupMemberResponse {
  group_id: string;
  role: 'member' | 'admin';
  groups: {
    id: string;
    name: string;
  };
}

export const AccountabilityGroups = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGroup = async () => {
      if (!user) return;
      
      try {
        // First check if user owns any groups
        const { data: ownedGroups, error: ownedError } = await supabase
          .from('groups')
          .select('id, name')
          .eq('owner_id', user.id)
          .single();

        if (ownedGroups) {
          setGroup({
            id: ownedGroups.id,
            name: ownedGroups.name,
            role: 'admin'
          });
          setLoading(false);
          return;
        }

        // If not an owner, check if member of any groups
        const { data: memberGroups, error: memberError } = await supabase
          .from('group_members')
          .select(`
            group_id,
            role,
            groups (
              id,
              name
            )
          `)
          .eq('user_id', user.id)
          .single();

        if (memberGroups) {
          const groupData = memberGroups as GroupMemberResponse;
          setGroup({
            id: groupData.groups.id,
            name: groupData.groups.name,
            role: groupData.role
          });
        }

        if (memberError && memberError.code !== 'PGRST116') {
          console.error('Error fetching member groups:', memberError);
          toast({
            title: "Error",
            description: "Failed to fetch your groups. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error in fetchUserGroup:', error);
        toast({
          title: "Error",
          description: "Failed to fetch your groups. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroup();
  }, [user, toast]);
  
  if (loading) {
    return (
      <Card className="border-none bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            Loading...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-none bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Users className="h-5 w-5" />
          Your Group
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!group ? (
          <div className="text-center space-y-4 py-6">
            <p className="text-muted-foreground">
              Join an accountability group to stay motivated and track progress together.
            </p>
            <Button
              className="w-full sm:w-auto"
              onClick={() => navigate('/join-group')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Join a Group
            </Button>
          </div>
        ) : (
          <Button
            className="w-full justify-between"
            variant="outline"
            onClick={() => navigate(`/manage-group/${group.id}`)}
          >
            <span>{group.name}</span>
            <span className="text-xs text-muted-foreground capitalize">{group.role}</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};