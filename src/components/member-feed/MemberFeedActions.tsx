import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, Send } from "lucide-react";

interface MemberFeedActionsProps {
  memberId: string;
  memberName: string;
  isOwnGoal: boolean;
  hasNudged: boolean;
  onNudge: (memberId: string, memberName: string) => void;
  onTapIn: () => void;
}

export const MemberFeedActions = ({
  memberId,
  memberName,
  isOwnGoal,
  hasNudged,
  onNudge,
  onTapIn,
}: MemberFeedActionsProps) => {
  const { toast } = useToast();

  const handleNudge = () => {
    if (hasNudged) {
      toast({
        description: `You've already encouraged ${memberName} today!`,
        variant: "destructive",
      });
      return;
    }

    // This would typically send a notification to the backend
    console.log("Nudge sent:", {
      recipientId: memberId,
      recipientName: memberName,
      timestamp: new Date().toISOString(),
    });

    onNudge(memberId, memberName);
  };

  if (isOwnGoal) {
    return (
      <Button
        variant={hasNudged ? "secondary" : "default"}
        size="sm"
        onClick={onTapIn}
        className="flex items-center gap-2"
      >
        <Send className="h-4 w-4" />
        Tap In
      </Button>
    );
  }

  return (
    <Button
      variant={hasNudged ? "secondary" : "default"}
      size="sm"
      onClick={handleNudge}
      className="flex items-center gap-2"
    >
      <Bell className="h-4 w-4" />
      Nudge
    </Button>
  );
};