import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GroupBoardGoal } from "@/components/group/types/board";

export const useGroupBoardData = (userId: string | undefined) => {
  const [groupGoals, setGroupGoals] = useState<GroupBoardGoal[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserGroup = async () => {
    if (!userId) return;

    try {
      const { data: groupMember, error: groupError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (groupError) {
        console.error('Error fetching user group:', groupError);
        toast({
          title: "Error",
          description: "Could not fetch your group information. Please try again later.",
          variant: "destructive"
        });
        return;
      }

      if (groupMember) {
        console.log('Found group ID:', groupMember.group_id);
        setGroupId(groupMember.group_id);
      } else {
        console.log('No group found for user');
        toast({
          title: "No Group Found",
          description: "You are not currently a member of any group. Join or create a group to see the bingo board.",
        });
      }
    } catch (error) {
      console.error('Error in fetchUserGroup:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupGoals = async () => {
    if (!userId || !groupId) return;

    try {
      // First get member IDs
      const { data: memberIds } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId);

      if (!memberIds) return;

      // First fetch goals
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('id, title, status, user_id')
        .in('user_id', memberIds.map(member => member.user_id));

      if (goalsError) throw goalsError;

      // Then fetch profiles separately
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', goals.map(goal => goal.user_id));

      if (profilesError) throw profilesError;

      // Create a map of profiles for easier lookup
      const profileMap = new Map(
        profiles?.map(profile => [profile.id, profile]) || []
      );

      // Transform the goals data to include profile information
      const transformedGoals: GroupBoardGoal[] = goals.map(goal => {
        const userProfile = profileMap.get(goal.user_id);
        return {
          id: goal.id,
          title: goal.title,
          status: goal.status,
          user_id: goal.user_id,
          user: userProfile ? {
            first_name: userProfile.first_name,
            last_name: userProfile.last_name
          } : null
        };
      });

      console.log('Fetched goals with profiles:', transformedGoals);
      setGroupGoals(transformedGoals);
    } catch (error) {
      console.error('Error in fetchGroupGoals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch group goals. Please try again later.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchUserGroup();
  }, [userId]);

  useEffect(() => {
    if (groupId) {
      fetchGroupGoals();
    }
  }, [groupId]);

  return { groupGoals, groupId, loading };
};