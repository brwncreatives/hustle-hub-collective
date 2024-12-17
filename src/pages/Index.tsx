import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Users, Trophy, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForms } from "@/components/AuthForms";
import { useNavigate } from "react-router-dom";
import { MemberFeed } from "@/components/MemberFeed";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const Index = () => {
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [showCommentField, setShowCommentField] = useState(false);
  const [comment, setComment] = useState("");
  const [hasTappedIn, setHasTappedIn] = useState(false);

  const motivationalQuotes = [
    "Every Saturday is a fresh start to achieve your goals!",
    "Small progress is still progress.",
    "Your future self will thank you for starting today.",
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const handleTapIn = () => {
    if (hasTappedIn) {
      toast({
        description: "You've already tapped in for your goal today!",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send this to your backend
    console.log("Tap in recorded:", {
      goalId: "learn-react-native",
      comment,
      timestamp: new Date().toISOString(),
    });

    setHasTappedIn(true);
    setComment("");
    setShowCommentField(false);

    toast({
      title: "Progress Updated! 🎯",
      description: comment 
        ? "You've logged your progress with a comment!"
        : "You've logged your progress!",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen flex items-center justify-center">
        <AuthForms />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-md md:max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.user_metadata.avatar_url || "https://github.com/shadcn.png"} />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">Welcome back!</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={() => signOut()}>
          <Trophy className="h-4 w-4" />
        </Button>
      </div>

      {/* Motivational Quote */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground italic">{randomQuote}</p>
        </CardContent>
      </Card>

      {/* Active Goals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Active Goals
          </CardTitle>
          <Button onClick={() => navigate("/create-goal")} size="sm">
            Add Goal
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Learn React Native</p>
                <p className="text-sm text-muted-foreground">Complete 3 tutorials this week</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge>In Progress</Badge>
                <Button
                  variant={hasTappedIn ? "secondary" : "default"}
                  size="sm"
                  onClick={() => setShowCommentField(!showCommentField)}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Tap In
                </Button>
              </div>
            </div>
            {showCommentField && (
              <div className="mt-4 space-y-2">
                <Textarea
                  placeholder="Add a quick update about your progress..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button 
                  onClick={handleTapIn}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Update
                </Button>
              </div>
            )}
            <Progress value={33} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Member Feed */}
      <MemberFeed />

      {/* Accountability Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Groups
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Create an accountability group to stay motivated!
          </p>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={() => navigate("/create-group")}
          >
            Create a Group
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;