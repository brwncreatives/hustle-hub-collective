import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TaskSection } from "./goal/TaskSection";
import { WeeklyRecapSection } from "./goal/WeeklyRecapSection";
import { useState, useEffect } from "react";

interface Goal {
  id: string;
  title: string;
  status: string;
}

export const ActiveGoals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    // For now, we'll get the goals from localStorage
    const storedGoals = localStorage.getItem('goals');
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
      console.log("Retrieved goals:", JSON.parse(storedGoals));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'not started':
        return 'bg-gray-400 hover:bg-gray-500 text-white';
      case 'in progress':
        return 'bg-[#7E69AB] hover:bg-[#7E69AB]/80 text-white';
      case 'completed':
        return 'bg-[#9b87f5] hover:bg-[#9b87f5]/80 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
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

      {goals.length === 0 ? (
        <Card className="border-none bg-white/5 backdrop-blur-sm">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No active goals yet. Click 'Add Goal' to create your first goal!
            </p>
          </CardContent>
        </Card>
      ) : (
        goals.map((goal) => (
          <Card key={goal.id} className="border-none bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <Target className="h-5 w-5" />
                Active Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div>
                  <Badge
                    variant="default"
                    className={`mb-2 ${getStatusColor(goal.status)}`}
                  >
                    {goal.status}
                  </Badge>
                  <p className="font-medium text-foreground">{goal.title}</p>
                </div>

                <TaskSection goalId={goal.id} />

                <div className="flex justify-end gap-2 mt-4">
                  <WeeklyRecapSection goalId={goal.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};