import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentWeekInQuarter } from "@/utils/dateUtils";

interface WeeklyRecapSectionProps {
  goalId: string;
}

export const WeeklyRecapSection = ({ goalId }: WeeklyRecapSectionProps) => {
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekInQuarter(new Date()).toString());
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
      goalId,
      comment,
      weekNumber: parseInt(selectedWeek),
      isPublic,
      timestamp: new Date().toISOString(),
    });

    setHasTappedIn(true);
    setComment("");

    toast({
      title: "Weekly Recap Submitted! 🎯",
      description: `Your Week ${selectedWeek} reflection has been ${
        isPublic ? "shared publicly" : "saved privately"
      }. Keep pushing forward!`,
    });
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Weekly Progress Recap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="week" className="text-sm text-muted-foreground">
            Select Week
          </label>
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
          <Button onClick={handleTapIn}>Submit Recap</Button>
        </div>
      </CardContent>
    </Card>
  );
};