import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoalForm } from "@/components/goal/GoalForm";
import { GoalFormValues } from "@/components/goal/types";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { WeeklyRecapSection } from "@/components/goal/WeeklyRecapSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const GoalEdit = () => {
  const { goalId } = useParams();
  const [goal, setGoal] = useState<GoalFormValues & { id: string }>();
  const { user, signOut } = useAuth();
  const [recaps, setRecaps] = useState<any[]>([]);

  useEffect(() => {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const foundGoal = goals.find((g: any) => g.id === goalId);
    if (foundGoal) {
      setGoal(foundGoal);
    }

    // Load recaps for this specific goal
    const storedRecaps = localStorage.getItem(`recaps-${goalId}`);
    if (storedRecaps) {
      setRecaps(JSON.parse(storedRecaps));
    }
  }, [goalId]);

  const handleSubmit = (data: GoalFormValues) => {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const updatedGoals = goals.map((g: any) =>
      g.id === goalId ? { ...g, ...data } : g
    );
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted text-foreground">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
        <Header user={user} signOut={signOut} />
        {goal && (
          <>
            <GoalForm
              initialData={goal}
              onSubmit={handleSubmit}
              title="Manage Goal"
            />
            
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Past Weekly Recaps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recaps.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No recaps yet. Start reflecting on your progress!
                  </p>
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
                              {recap.isPublic && (
                                <Badge variant="outline" className="text-xs">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Public
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

            <WeeklyRecapSection goalId={goal.id} />
          </>
        )}
      </div>
    </div>
  );
};

export default GoalEdit;