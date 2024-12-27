import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { TrendingUp, User, MessageSquare, Heart } from "lucide-react";
import { MemberFeedActions } from "./MemberFeedActions";
import { Member } from "./types";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MemberFeedItemProps {
  member: Member;
  isOwnGoal: boolean;
  hasNudged: boolean;
  onNudge: (memberId: string, memberName: string) => void;
  onTapIn: (memberId: string, memberName: string) => void;
  showCommentField: boolean;
  onToggleComment: () => void;
}

export const MemberFeedItem = ({
  member,
  isOwnGoal,
  hasNudged,
  onNudge,
  onTapIn,
  showCommentField,
  onToggleComment,
}: MemberFeedItemProps) => {
  const { toast } = useToast();

  const handleReaction = () => {
    // In a real app, this would make an API call to store the reaction
    console.log(`Reacting with heart to ${member.name}'s recap`);
    toast({
      description: `You showed support for ${member.name}'s weekly reflection! ❤️`,
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={member.avatar} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="font-medium">{member.name}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {member.goal.title}
              </p>
            </div>
          </div>
          <MemberFeedActions
            memberId={member.id}
            memberName={member.name}
            isOwnGoal={isOwnGoal}
            hasNudged={hasNudged}
            onNudge={onNudge}
            onTapIn={() => onTapIn(member.id, member.name)}
          />
        </div>

        {member.weeklyRecap && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>Week {member.weeklyRecap.weekNumber} Reflection</span>
              <span className="text-xs">
                {formatDistanceToNow(new Date(member.weeklyRecap.timestamp), { addSuffix: true })}
              </span>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm italic">{member.weeklyRecap.content}</p>
              <div className="flex items-center gap-2 mt-4 border-t border-muted/20 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-pink-500 hover:text-pink-600 hover:bg-pink-100/10"
                  onClick={handleReaction}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  <span className="text-xs">{member.weeklyRecap.reactions?.heart?.length || 0}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};