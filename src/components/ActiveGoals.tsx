import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TaskSection } from "./goal/TaskSection";
import { useState, useEffect } from "react";
import { GoalStatusBadge } from "./goal/GoalStatusBadge";

interface Goal {
  id: string;
  title: string;
  status: string;
}

export const ActiveGoals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const storedGoals = localStorage.getItem('goals');
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
      console.log("Retrieved goals:", JSON.parse(storedGoals));
    }
  }, []);

  const startEditingStatus = (goalId: string, currentStatus: string) => {
    setEditingStatus(goalId);
    setSelectedStatus(currentStatus);
  };

  const saveStatus = (goalId: string) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId
        ? { ...goal, status: selectedStatus }
        : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setEditingStatus(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Your Goals</h2>
        <Button
          onClick={() => navigate("/create-goal")}
          size="sm"
          className="bg-primary hover:bg-primary/80 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="w-full mb-6">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                You haven't set any goals yet
              </p>
              <p className="text-sm text-muted-foreground">
                Click 'New Goal' to start tracking your progress
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        goals.map((goal) => (
          <Card key={goal.id} className="w-full mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {goal.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <GoalStatusBadge
                      status={goal.status}
                      isEditing={editingStatus === goal.id}
                      selectedStatus={selectedStatus}
                      onStatusChange={setSelectedStatus}
                      onSave={() => saveStatus(goal.id)}
                      onCancel={() => setEditingStatus(null)}
                      onStartEditing={() => startEditingStatus(goal.id, goal.status)}
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/edit-goal/${goal.id}`)}
                  className="h-8"
                >
                  Edit Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-2">Tasks</h3>
                  <TaskSection goalId={goal.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};