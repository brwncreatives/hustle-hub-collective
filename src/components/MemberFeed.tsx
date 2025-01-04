import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationsPopover } from "./notifications/NotificationsPopover";
import { FeedActivity } from "./member-feed/types";
import { GroupBingoBoardCard } from "./group/GroupBingoBoardCard";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { supabase } from "@/integrations/supabase/client";

const getActivityIcon = (type: FeedActivity['type']) => {
  switch (type) {
    case 'join_group':
      return '👋';
    case 'add_goal':
      return '🎯';
    case 'complete_task':
      return '✅';
    case 'complete_goal':
      return '🏆';
    case 'weekly_reflection':
      return '📝';
    default:
      return '📣';
  }
};

const getActivityMessage = (activity: FeedActivity) => {
  switch (activity.type) {
    case 'join_group':
      return 'joined the group';
    case 'add_goal':
      return `set a new goal: ${activity.data.goalTitle}`;
    case 'complete_task':
      return `completed "${activity.data.taskTitle}" in ${activity.data.goalTitle}`;
    case 'complete_goal':
      return `achieved their goal: ${activity.data.goalTitle}`;
    case 'weekly_reflection':
      return `shared a Week ${activity.data.weekNumber} reflection`;
    default:
      return 'performed an activity';
  }
};

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
        const { data: groupMember } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', user.id)
          .single();

        if (groupMember) {
          const { data: group } = await supabase
            .from('groups')
            .select('name')
            .eq('id', groupMember.group_id)
            .single();

          if (group) {
            setGroupName(group.name);
          }
        }

        // Fetch completed tasks
        const { data: completedTasks } = await supabase
          .from('tasks')
          .select(`
            *,
            goals:goals(title, user_id),
            profiles:goals(user_id(id, first_name, last_name))
          `)
          .eq('completed', true)
          .order('updated_at', { ascending: false });

        // Fetch new goals
        const { data: newGoals } = await supabase
          .from('goals')
          .select(`
            *,
            profiles:profiles!goals_user_id_fkey(first_name, last_name)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        // Combine and transform activities
        const allActivities: FeedActivity[] = [];

        if (completedTasks) {
          completedTasks.forEach(task => {
            if (task.goals && task.profiles) {
              const goal = task.goals;
              const profile = task.profiles;
              allActivities.push({
                id: `task-${task.id}`,
                type: 'complete_task',
                userId: goal.user_id,
                userName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
                timestamp: task.updated_at,
                data: {
                  taskTitle: task.title,
                  goalTitle: goal.title
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

  // Filter activities to only show public weekly reflections or the user's own private reflections
  const filteredActivities = activities.filter(activity => {
    if (activity.type === 'weekly_reflection') {
      return activity.data.isPublic || activity.userId === user?.id;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <GroupBingoBoardCard />
      
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {groupName || "Group"} Activity Feed
          </CardTitle>
          <NotificationsPopover />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {filteredActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No activities yet</p>
                <p className="text-sm text-muted-foreground">
                  Activities will appear here as members interact with the group
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <Card key={activity.id} className="p-4 bg-card/50">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.userAvatar} />
                        <AvatarFallback>{activity.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{activity.userName}</span>
                          <span className="text-muted-foreground text-sm">
                            {getActivityMessage(activity)}
                          </span>
                        </div>
                        {activity.type === 'weekly_reflection' && activity.data.reflection && (
                          <div className="mt-2 p-3 rounded-lg bg-muted/50">
                            <p className="text-sm italic">{activity.data.reflection}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getActivityIcon(activity.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </span>
                          {activity.type === 'weekly_reflection' && !activity.data.isPublic && activity.userId === user?.id && (
                            <Badge variant="secondary" className="text-xs">
                              Private
                            </Badge>
                          )}
                          <button
                            onClick={() => handleLike(activity.id)}
                            className={`flex items-center gap-1 text-xs ${
                              likedActivities.has(activity.id) ? 'text-pink-500' : 'text-muted-foreground'
                            } hover:text-pink-500 transition-colors`}
                          >
                            <Heart className="h-3.5 w-3.5" fill={likedActivities.has(activity.id) ? "currentColor" : "none"} />
                            <span>{likedActivities.has(activity.id) ? 'Liked' : 'Like'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}