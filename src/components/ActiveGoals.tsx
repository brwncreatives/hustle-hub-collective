import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, MessageSquare, Lock, Globe } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { TaskList } from "./TaskList";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ActiveGoals = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showRecapModal, setShowRecapModal] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [hasTappedIn, setHasTappedIn] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const weeks = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const handleTapIn = () => {
    if (hasTappedIn) {
      toast({
        description: "You've already submitted your weekly recap!",
        variant: "destructive",
      });
      return;
    }

    console.log("Weekly recap recorded:", {
      goalId: "learn-react-native",
      comment,
      weekNumber: parseInt(selectedWeek),
      isPublic,
      timestamp: new Date().toISOString(),
    });

    setHasTappedIn(true);
    setComment("");
    setShowRecapModal(false);

    toast({
      title: "Weekly Recap Submitted! 🎯",
      description: `Your week ${selectedWeek} reflection has been ${isPublic ? 'shared publicly' : 'saved privately'}. Keep pushing forward!`,
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
                onClick={() => setShowRecapModal(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <MessageSquare className="h-4 w-4" />
                Weekly Recap
              </Button>
            </div>

            <TaskList goalId="learn-react-native" />

            <Dialog open={showRecapModal} onOpenChange={setShowRecapModal}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Weekly Progress Recap
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="week" className="text-sm text-muted-foreground">Select Week</label>
                    <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                      <SelectTrigger id="week" className="w-full">
                        <SelectValue placeholder="Select week" />
                      </SelectTrigger>
                      <SelectContent>
                        {weeks.map((week) => (
                          <SelectItem key={week} value={week}>
                            Week {week}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Reflect on your progress this week. How are you feeling about your goals? What challenges did you face? What victories did you achieve?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[150px] bg-transparent border-primary/20 focus:border-primary placeholder:text-muted-foreground/70"
                  />
                  <div className="flex items-center justify-between border-t border-primary/10 pt-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                        className="data-[state=checked]:bg-primary"
                      />
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        {isPublic ? (
                          <>
                            <Globe className="h-3 w-3" />
                            Share publicly
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3" />
                            Keep private
                          </>
                        )}
                      </span>
                    </div>
                    <Button onClick={handleTapIn}>
                      Submit Recap
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};