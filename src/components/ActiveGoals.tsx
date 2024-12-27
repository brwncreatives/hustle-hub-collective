import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Pencil } from "lucide-react";
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
        <Card className="w-full mb-6">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No active goals yet. Click 'Add Goal' to create your first goal!
            </p>
          </CardContent>
        </Card>
      ) : (
        goals.map((goal) => (
          <Card key={goal.id} className="w-full mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <Target className="h-5 w-5" />
                    {goal.title}
                  </CardTitle>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/edit-goal/${goal.id}`)}
                  className="h-8"
                >
                  Edit Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <TaskSection goalId={goal.id} />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};