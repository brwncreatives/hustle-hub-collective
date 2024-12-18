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
    "Hustle hard, dream bigger! 🗽",
    "Every Saturday is your chance to level up! 💪",
    "Make your mark on these streets! 🌟",
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
      <div className="flex items-center justify-center min-h-screen bg-[#221F26]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-[#221F26] to-[#403E43]">
        <AuthForms />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#221F26] to-[#403E43] text-white">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-md md:max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#F97316]/10 p-4 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Avatar className="border-2 border-[#F97316]">
              <AvatarImage src={user.user_metadata.avatar_url || "https://github.com/shadcn.png"} />
              <AvatarFallback className="bg-[#F97316]">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-xl bg-gradient-to-r from-[#F97316] to-[#D946EF] text-transparent bg-clip-text">
                Welcome to the Hustle
              </h2>
              <p className="text-sm text-[#F97316]/80">{user.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => signOut()}
            className="border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white transition-all"
          >
            <Trophy className="h-4 w-4" />
          </Button>
        </div>

        {/* Motivational Quote */}
        <Card className="border-none bg-[#F97316]/5 backdrop-blur-sm">
          <CardContent className="pt-6">
            <p className="text-center text-xl font-bold bg-gradient-to-r from-[#F97316] to-[#D946EF] text-transparent bg-clip-text">
              {randomQuote}
            </p>
          </CardContent>
        </Card>

        {/* Active Goals */}
        <Card className="border-none bg-black/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 text-[#F97316]">
              <Target className="h-5 w-5" />
              Active Goals
            </CardTitle>
            <Button 
              onClick={() => navigate("/create-goal")}
              size="sm"
              className="bg-[#F97316] hover:bg-[#F97316]/80 text-white"
            >
              Add Goal
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">Learn React Native</p>
                  <p className="text-sm text-[#F97316]/80">Complete 3 tutorials this week</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge className="bg-[#F97316] hover:bg-[#F97316]/80">In Progress</Badge>
                  <Button
                    variant={hasTappedIn ? "secondary" : "default"}
                    size="sm"
                    onClick={() => setShowCommentField(!showCommentField)}
                    className={`flex items-center gap-2 ${
                      hasTappedIn 
                        ? "bg-[#403E43] hover:bg-[#403E43]/80" 
                        : "bg-[#F97316] hover:bg-[#F97316]/80"
                    }`}
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
                    className="min-h-[80px] bg-black/20 border-[#F97316]/20 focus:border-[#F97316] text-white"
                  />
                  <Button 
                    onClick={handleTapIn}
                    className="w-full bg-[#F97316] hover:bg-[#F97316]/80"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Update
                  </Button>
                </div>
              )}
              <Progress value={33} className="h-2 bg-black/20">
                <div className="h-full bg-gradient-to-r from-[#F97316] to-[#D946EF] rounded-full" />
              </Progress>
            </div>
          </CardContent>
        </Card>

        {/* Member Feed */}
        <MemberFeed />

        {/* Accountability Groups */}
        <Card className="border-none bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-[#F97316]">
              <Users className="h-5 w-5" />
              Your Groups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-[#F97316]/80">
              Create an accountability group to stay motivated!
            </p>
            <Button 
              className="w-full border-2 border-[#F97316] bg-transparent hover:bg-[#F97316] text-[#F97316] hover:text-white transition-all" 
              variant="outline" 
              onClick={() => navigate("/create-group")}
            >
              Create a Group
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;