import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { TrendingUp, User } from "lucide-react";
import { MemberFeedActions } from "./MemberFeedActions";
import { Member } from "./types";

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
  return (
    <Card className="p-4">
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
    </Card>
  );
};