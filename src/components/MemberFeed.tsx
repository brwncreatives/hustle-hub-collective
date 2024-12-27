import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Users, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { MemberFeedItem } from "./member-feed/MemberFeedItem";
import { NotificationsPopover } from "./notifications/NotificationsPopover";
import { Member } from "./member-feed/types";

// Mock data - replace with actual data from your backend
const mockMembers: Member[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://github.com/shadcn.png",
    goal: {
      title: "Complete React Course",
      progress: 65,
      target: 100,
    },
    weeklyRecap: {
      content: "This week has been challenging but rewarding! I've made significant progress in understanding React hooks and context. Looking forward to diving into more advanced topics next week. 💪",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      reactions: {
        heart: ["user1", "user2"]
      }
    },
  },
  {
    id: "2",
    name: "Mike Johnson",
    goal: {
      title: "Build 5 Projects",
      progress: 40,
      target: 100,
    },
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "https://github.com/emma.png",
    goal: {
      title: "Learn TypeScript",
      progress: 80,
      target: 100,
    },
  },
];

export function MemberFeed() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [nudgedMembers, setNudgedMembers] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [showCommentField, setShowCommentField] = useState<{
    [key: string]: boolean;
  }>({});

  const handleTapIn = (memberId: string, memberName: string) => {
    if (nudgedMembers.has(memberId)) {
      toast({
        description: `You've already tapped in for your goal today!`,
        variant: "destructive",
      });
      return;
    }

    const comment = comments[memberId]?.trim() || "";

    console.log("Tap in recorded:", {
      memberId,
      memberName,
      comment,
      timestamp: new Date().toISOString(),
    });

    setNudgedMembers(new Set([...nudgedMembers, memberId]));
    setComments({ ...comments, [memberId]: "" });
    setShowCommentField({ ...showCommentField, [memberId]: false });

    toast({
      title: "Progress Updated! 🎯",
      description: comment
        ? `You've logged your progress with a comment!`
        : `You've logged your progress!`,
    });
  };

  const handleNudge = (memberId: string, memberName: string) => {
    setNudgedMembers(new Set([...nudgedMembers, memberId]));
    toast({
      title: "Encouragement sent! 🎉",
      description: `You've sent encouragement to ${memberName}!`,
    });
  };

  const toggleCommentField = (memberId: string) => {
    setShowCommentField((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Group Progress Feed
        </CardTitle>
        <NotificationsPopover />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {mockMembers.map((member) => (
              <div key={member.id} className="space-y-2">
                <MemberFeedItem
                  member={member}
                  isOwnGoal={member.id === user?.id}
                  hasNudged={nudgedMembers.has(member.id)}
                  onNudge={handleNudge}
                  onTapIn={handleTapIn}
                  showCommentField={showCommentField[member.id]}
                  onToggleComment={() => toggleCommentField(member.id)}
                />

                {member.id === user?.id && showCommentField[member.id] && (
                  <div className="mt-4 space-y-2">
                    <Textarea
                      placeholder="Add a quick update about your progress..."
                      value={comments[member.id] || ""}
                      onChange={(e) =>
                        setComments((prev) => ({
                          ...prev,
                          [member.id]: e.target.value,
                        }))
                      }
                      className="min-h-[80px]"
                    />
                    <Button
                      onClick={() => handleTapIn(member.id, member.name)}
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Update
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
