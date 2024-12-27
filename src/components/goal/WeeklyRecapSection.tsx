import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Globe, MessageSquare } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface WeeklyRecap {
  id: string;
  comment: string;
  weekNumber: number;
  isPublic: boolean;
  timestamp: string;
}

interface WeeklyRecapSectionProps {
  goalId: string;
  showPastRecaps?: boolean;
}

export const WeeklyRecapSection = ({ goalId, showPastRecaps = false }: WeeklyRecapSectionProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekInQuarter(new Date()).toString());
  const [hasTappedIn, setHasTappedIn] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [recaps, setRecaps] = useState<WeeklyRecap[]>([]);

  const weeks = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    const storedRecaps = localStorage.getItem(`recaps-${goalId}`);
    if (storedRecaps) {
      setRecaps(JSON.parse(storedRecaps));
    }
  }, [goalId]);

  const handleTapIn = () => {
    if (hasTappedIn) {
      toast({
        description: "You've already submitted your weekly recap!",
        variant: "destructive",
      });
      return;
    }

    const newRecap = {
      id: crypto.randomUUID(),
      comment,
      weekNumber: parseInt(selectedWeek),
      isPublic,
      timestamp: new Date().toISOString(),
    };

    const updatedRecaps = [...recaps, newRecap];
    setRecaps(updatedRecaps);
    localStorage.setItem(`recaps-${goalId}`, JSON.stringify(updatedRecaps));

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
    <div className="space-y-6">
      {showPastRecaps && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Past Weekly Recaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recaps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12 mb-3 opacity-50" />
                <p>No weekly recaps yet. Start reflecting on your progress!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recaps.map((recap) => (
                  <Card key={recap.id} className="p-4 bg-muted/50">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Week {recap.weekNumber}</Badge>
                          {!recap.isPublic && (
                            <Badge variant="outline" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Private
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(recap.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm">{recap.comment}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">New Weekly Progress Recap</CardTitle>
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
    </div>
  );
};