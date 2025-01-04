import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeedActivity, Profile } from "@/types/activity";
import { formatUserName } from "@/utils/profileUtils";
import { useGroupData } from "./useGroupData";

export const useGroupActivities = (userId: string | undefined) => {
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { groupName } = useGroupData(userId);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!userId) {
        setActivities([]);
        setLoading(false);
        return;
      }

      try {
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
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

  return { activities, groupName, loading };
};