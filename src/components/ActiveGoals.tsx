import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { TaskList } from "./TaskList";

export const ActiveGoals = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCommentField, setShowCommentField] = useState(false);
  const [comment, setComment] = useState("");
  const [hasTappedIn, setHasTappedIn] = useState(false);

  const handleTapIn = () => {
    if (hasTappedIn) {
      toast({
        description: "You've already submitted your weekly recap!",
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
      title: "Weekly Recap Submitted! 🎯",
      description: "Your weekly reflection has been recorded. Keep pushing forward!",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => navigate("/create-goal")}
          size="sm"
          className="bg-primary hover:bg-primary/80 text-primary-foreground"
        >
          Add Goal
        </Button>
      </div>

      <Card className="border-none bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-primary">
            <Target className="h-5 w-5" />
            Active Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <Badge
                  variant="default"
                  className="mb-2 bg-green-500 hover:bg-green-600"
                >
                  In Progress
                </Badge>
                <p className="font-medium text-foreground">Learn React Native</p>
              </div>
              <Button
                variant={hasTappedIn ? "secondary" : "default"}
                size="sm"
                onClick={() => setShowCommentField(!showCommentField)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
                Weekly Recap
              </Button>
            </div>

            <TaskList goalId="learn-react-native" />

            {showCommentField && (
              <div className="mt-4 space-y-2">
                <Textarea
                  placeholder="Reflect on your progress this week. How are you feeling about your goals? What challenges did you face? What victories did you achieve?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px] bg-white/5 border-primary/20 focus:border-primary"
                />
                <Button onClick={handleTapIn} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Update
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};