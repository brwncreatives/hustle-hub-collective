import { useState } from "react";
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

const mockActivities: FeedActivity[] = [
  {
    id: "1",
    type: "join_group",
    userId: "1",
    userName: "Sarah Chen",
    userAvatar: "https://github.com/shadcn.png",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    data: {}
  },
  {
    id: "2",
    type: "add_goal",
    userId: "1",
    userName: "Sarah Chen",
    userAvatar: "https://github.com/shadcn.png",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    data: {
      goalTitle: "Complete React Course"
    }
  },
  {
    id: "3",
    type: "complete_task",
    userId: "2",
    userName: "Mike Johnson",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    data: {
      goalTitle: "Build 5 Projects",
      taskTitle: "Set up project repository"
    }
  },
  {
    id: "4",
    type: "weekly_reflection",
    userId: "1",
    userName: "Sarah Chen",
    userAvatar: "https://github.com/shadcn.png",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    data: {
      weekNumber: 3,
      reflection: "This week has been challenging but rewarding! I've made significant progress in understanding React hooks and context. Looking forward to diving into more advanced topics next week. 💪"
    }
  }
];

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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Group Activity Feed
          </CardTitle>
          <NotificationsPopover />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {mockActivities.map((activity) => (
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
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}