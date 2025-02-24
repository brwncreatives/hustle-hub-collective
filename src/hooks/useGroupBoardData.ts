import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GroupBoardGoal } from "@/components/group/types/board";

export const useGroupBoardData = (userId: string | undefined) => {
  const [groupGoals, setGroupGoals] = useState<GroupBoardGoal[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserGroup = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data: groupMember, error } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error in fetchUserGroup:', error);
          throw error;
        }

        if (groupMember) {
          setGroupId(groupMember.group_id);
        } else {
          console.log('No group found for user');
          toast({
            title: "No Group Found",
            description: "You are not currently a member of any group. Join or create a group to see the bingo board.",
          });
        }
      } catch (error: any) {
        console.error('Error in fetchUserGroup:', error);
        toast({
          title: "Error",
          description: "Could not fetch your group information. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroup();
  }, [userId, toast]);

  useEffect(() => {
    const fetchGroupGoals = async () => {
      if (!groupId) return;

      try {
        const { data: goals, error } = await supabase
          .from('goals')
          .select(`
            id,
            title,
            status,
            user_id,
            profiles (
              first_name,
              last_name
            )
          `)
          .eq('user_id', userId);

        if (error) {
          console.error('Error in fetchGroupGoals:', error);
          throw error;
        }

        const transformedGoals = (goals || []).map((goal: any) => ({
          id: goal.id,
          title: goal.title,
          status: goal.status,
          user_id: goal.user_id,
          user: {
            first_name: goal.profiles?.first_name || "",
            last_name: goal.profiles?.last_name || ""
          }
        }));

        setGroupGoals(transformedGoals);
      } catch (error: any) {
        console.error('Error in fetchGroupGoals:', error);
        toast({
          title: "Error",
          description: "Failed to fetch group goals. Please try again later.",
          variant: "destructive"
        });
      }
    };

    if (groupId) {
      fetchGroupGoals();
    }
  }, [groupId, userId, toast]);

  return { groupGoals, groupId, loading };
};