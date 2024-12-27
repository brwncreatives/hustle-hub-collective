import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  const [showTasks, setShowTasks] = useState(false);

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
                <p className="text-sm text-muted-foreground">
                  Complete 3 tutorials this week
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTasks(!showTasks)}
                >
                  {showTasks ? "Hide Tasks" : "Show Tasks"}
                </Button>
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

            {showTasks && <TaskList goalId="learn-react-native" />}

            {showCommentField && (
              <div className="mt-4 space-y-2">
                <Textarea
                  placeholder="Add a quick update about your progress..."
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
            <Progress value={33} className="h-2">
              <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full" />
            </Progress>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};