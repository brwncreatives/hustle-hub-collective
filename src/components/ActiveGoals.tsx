import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const ActiveGoals = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCommentField, setShowCommentField] = useState(false);
  const [comment, setComment] = useState("");
  const [hasTappedIn, setHasTappedIn] = useState(false);

  const handleTapIn = () => {
    if (hasTappedIn) {
      toast({
        description: "You've already tapped in for your goal today!",
        variant: "destructive",
      });
      return;
    }

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

  return (
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
  );
};