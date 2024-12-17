import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, User, TrendingUp, Users, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";

type Member = {
  id: string;
  name: string;
  avatar?: string;
  goal: {
    title: string;
    progress: number;
    target: number;
  };
};

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
  const [showCommentField, setShowCommentField] = useState<{ [key: string]: boolean }>({});

  const handleTapIn = (memberId: string, memberName: string) => {
    if (nudgedMembers.has(memberId)) {
      toast({
        description: `You've already tapped in for your goal today!`,
        variant: "destructive",
      });
      return;
    }

    const comment = comments[memberId]?.trim() || "";
    
    // Here you would typically send this to your backend
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
    if (nudgedMembers.has(memberId)) {
      toast({
        description: `You've already encouraged ${memberName} today!`,
        variant: "destructive",
      });
      return;
    }

    setNudgedMembers(new Set([...nudgedMembers, memberId]));
    toast({
      title: "Encouragement sent! 🎉",
      description: `You've sent encouragement to ${memberName}!`,
    });
  };

  const toggleCommentField = (memberId: string) => {
    setShowCommentField(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Group Progress Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {mockMembers.map((member) => {
              const isOwnGoal = member.id === user?.id;
              
              return (
                <Card key={member.id} className="p-4">
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
                    <div className="flex flex-col gap-2">
                      {isOwnGoal ? (
                        <Button
                          variant={nudgedMembers.has(member.id) ? "secondary" : "default"}
                          size="sm"
                          onClick={() => toggleCommentField(member.id)}
                          className="flex items-center gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Tap In
                        </Button>
                      ) : (
                        <Button
                          variant={nudgedMembers.has(member.id) ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleNudge(member.id, member.name)}
                          className="flex items-center gap-2"
                        >
                          <Bell className="h-4 w-4" />
                          Nudge
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {isOwnGoal && showCommentField[member.id] && (
                    <div className="mt-4 space-y-2">
                      <Textarea
                        placeholder="Add a quick update about your progress..."
                        value={comments[member.id] || ""}
                        onChange={(e) => setComments(prev => ({
                          ...prev,
                          [member.id]: e.target.value
                        }))}
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

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{member.goal.progress}% Complete</span>
                    </div>
                    <Progress value={member.goal.progress} className="h-2" />
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}