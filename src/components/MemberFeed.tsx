import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { FeedActivity } from "./member-feed/types";
import { GroupBingoBoardCard } from "./group/GroupBingoBoardCard";
import { supabase } from "@/integrations/supabase/client";
import { FeedHeader } from "./member-feed/FeedHeader";
import { EmptyFeed } from "./member-feed/EmptyFeed";
import { FeedActivityItem } from "./member-feed/FeedActivity";

export function MemberFeed() {
  const { user } = useAuth();
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState<string>("");
  const [activities, setActivities] = useState<FeedActivity[]>([]);

  useEffect(() => {
    const fetchGroupAndActivities = async () => {
      if (!user) return;

      try {
        // Fetch user's group
        const { data: groupData } = await supabase
          .from('group_members')
          .select('groups(name)')
          .eq('user_id', user.id)
          .single();

        if (groupData?.groups?.name) {
          setGroupName(groupData.groups.name);
        }

        // Fetch completed tasks with related data
        const { data: completedTasks, error: tasksError } = await supabase
          .from('tasks')
          .select(`
            *,
            goals (
              title,
              user_id,
              profiles (
                first_name,
                last_name
              )
            )
          `)
          .eq('completed', true)
          .order('updated_at', { ascending: false });

        if (tasksError) throw tasksError;

        // Fetch new goals with user profiles
        const { data: newGoals, error: goalsError } = await supabase
          .from('goals')
          .select(`
            *,
            profiles (
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (goalsError) throw goalsError;

        // Transform and combine activities
        const allActivities: FeedActivity[] = [];

        if (completedTasks) {
          completedTasks.forEach(task => {
            if (task.goals?.profiles) {
              allActivities.push({
                id: `task-${task.id}`,
                type: 'complete_task',
                userId: task.goals.user_id,
                userName: `${task.goals.profiles.first_name || ''} ${task.goals.profiles.last_name || ''}`.trim(),
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
            if (goal.profiles) {
              allActivities.push({
                id: `goal-${goal.id}`,
                type: 'add_goal',
                userId: goal.user_id,
                userName: `${goal.profiles.first_name || ''} ${goal.profiles.last_name || ''}`.trim(),
                timestamp: goal.created_at,
                data: {
                  goalTitle: goal.title
                }
              });
            }
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
      }
    };

    fetchGroupAndActivities();
  }, [user]);

  const handleLike = (activityId: string) => {
    setLikedActivities(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(activityId)) {
        newLiked.delete(activityId);
      } else {
        newLiked.add(activityId);
      }
      return newLiked;
    });
  };

  return (
    <div className="space-y-6">
      <GroupBingoBoardCard />
      
      <Card className="w-full">
        <FeedHeader groupName={groupName} />
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {activities.length === 0 ? (
              <EmptyFeed />
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <FeedActivityItem
                    key={activity.id}
                    activity={activity}
                    isLiked={likedActivities.has(activity.id)}
                    onLike={handleLike}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}