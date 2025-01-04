import { Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FeedActivity } from "./types";

interface FeedActivityProps {
  activity: FeedActivity;
  isLiked: boolean;
  onLike: (activityId: string) => void;
}

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

export const FeedActivityItem = ({ activity, isLiked, onLike }: FeedActivityProps) => {
  return (
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
              onClick={() => onLike(activity.id)}
              className={`flex items-center gap-1 text-xs ${
                isLiked ? 'text-pink-500' : 'text-muted-foreground'
              } hover:text-pink-500 transition-colors`}
            >
              <Heart className="h-3.5 w-3.5" fill={isLiked ? "currentColor" : "none"} />
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};