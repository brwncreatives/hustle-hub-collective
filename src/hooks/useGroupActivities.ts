import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeedActivity } from "@/components/member-feed/types";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface GroupData {
  groups: {
    name: string;
  };
}

const formatUserName = (profile: Profile | undefined) => {
  if (!profile) return 'Member';
  
  // If both names exist, use them
  if (profile.first_name && profile.last_name) {
    return `${profile.first_name} ${profile.last_name}`;
  }
  
  // Return whichever name exists, or 'Member' if neither does
  return profile.first_name || profile.last_name || 'Member';
};

export const useGroupActivities = (userId: string | undefined) => {
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupAndActivities = async () => {
      if (!userId) return;

      try {
        // Fetch user's group
        const { data: groupData } = await supabase
          .from('group_members')
          .select(`
            groups (
              name
            )
          `)
          .eq('user_id', userId)
          .single();

        if (groupData?.groups?.name) {
          setGroupName(groupData.groups.name);
        }

        // Fetch all profiles first
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name');

        console.log("User profiles:", profiles);

        // Create a map of user profiles for easy lookup
        const profileMap = new Map(
          profiles?.map(profile => [profile.id, profile]) || []
        );

        // Fetch completed tasks with explicit joins
        const { data: completedTasks, error: tasksError } = await supabase
          .from('tasks')
          .select(`
            *,
            goals (
              title,
              user_id
            )
          `)
          .eq('completed', true)
          .order('updated_at', { ascending: false });

        if (tasksError) throw tasksError;

        // Fetch new goals with explicit joins
        const { data: newGoals, error: goalsError } = await supabase
          .from('goals')
          .select('*, user_id')
          .order('created_at', { ascending: false })
          .limit(10);

        if (goalsError) throw goalsError;

        // Transform and combine activities
        const allActivities: FeedActivity[] = [];

        if (completedTasks) {
          completedTasks.forEach(task => {
            if (task.goals) {
              const profile = profileMap.get(task.goals.user_id);
              const userName = formatUserName(profile);
              
              allActivities.push({
                id: `task-${task.id}`,
                type: 'complete_task',
                userId: task.goals.user_id,
                userName,
                timestamp: task.updated_at,
                data: {
                  taskTitle: task.title,
                  goalTitle: task.goals.title
                }
              });
            }
          });
        }

        if (newGoals) {
          newGoals.forEach(goal => {
            const profile = profileMap.get(goal.user_id);
            const userName = formatUserName(profile);
            
            allActivities.push({
              id: `goal-${goal.id}`,
              type: 'add_goal',
              userId: goal.user_id,
              userName,
              timestamp: goal.created_at,
              data: {
                goalTitle: goal.title
              }
            });
          });
        }

        // Sort activities by timestamp
        allActivities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setActivities(allActivities);
        console.log("Feed activities:", allActivities);
      } catch (error) {
        console.error('Error fetching feed data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupAndActivities();
  }, [userId]);

  return { activities, groupName, loading };
};