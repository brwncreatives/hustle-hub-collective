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
      // First get group members
      const { data: groupMembers, error: membersError } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId);

      if (membersError) throw membersError;

      const memberIds = groupMembers.map(member => member.user_id);
      
      // Get goals and user profiles in separate queries
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('id, title, status, user_id')
        .in('user_id', memberIds);

      if (goalsError) throw goalsError;

      // Get profiles for the member IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', memberIds);

      if (profilesError) throw profilesError;

      // Map profiles to a dictionary for easier lookup
      const profileMap = profiles.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>);

      // Combine goals with profile information
      const goalsWithProfiles = goals.map(goal => ({
        ...goal,
        user: profileMap[goal.user_id] || { first_name: null, last_name: null }
      }));

      setGroupGoals(goalsWithProfiles);
      console.log('Goals with profiles:', goalsWithProfiles);
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