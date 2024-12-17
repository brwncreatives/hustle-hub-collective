import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, User, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [nudgedMembers, setNudgedMembers] = useState<Set<string>>(new Set());

  const handleNudge = (memberId: string, memberName: string) => {
    if (nudgedMembers.has(memberId)) {
      toast({
        description: `You've already encouraged ${memberName} recently!`,
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
            {mockMembers.map((member) => (
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className={nudgedMembers.has(member.id) ? "text-primary" : ""}
                    onClick={() => handleNudge(member.id, member.name)}
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{member.goal.progress}% Complete</span>
                  </div>
                  <Progress value={member.goal.progress} className="h-2" />
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}