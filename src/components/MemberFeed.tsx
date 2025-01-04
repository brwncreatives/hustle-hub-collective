import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { GroupBingoBoardCard } from "./group/GroupBingoBoardCard";
import { FeedHeader } from "./member-feed/FeedHeader";
import { EmptyFeed } from "./member-feed/EmptyFeed";
import { FeedActivityItem } from "./member-feed/FeedActivity";
import { useGroupActivities } from "@/hooks/useGroupActivities";

export function MemberFeed() {
  const { user } = useAuth();
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());
  const { activities, groupName, loading } = useGroupActivities(user?.id);

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
      
      <Card className="w-full border-none bg-white/5 backdrop-blur-sm">
        <FeedHeader groupName={groupName} />
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-white/60">Loading activities...</p>
              </div>
            ) : activities.length === 0 ? (
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