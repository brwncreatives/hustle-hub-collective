import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TaskSection } from "./goal/TaskSection";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Goal {
  id: string;
  title: string;
  status: string;
}

export const ActiveGoals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedStatus, setEditedStatus] = useState("");

  useEffect(() => {
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

  const startEditing = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditedTitle(goal.title);
    setEditedStatus(goal.status);
  };

  const saveEdit = (goalId: string) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId
        ? { ...goal, title: editedTitle, status: editedStatus }
        : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setEditingGoalId(null);
  };

  const cancelEdit = () => {
    setEditingGoalId(null);
    setEditedTitle("");
    setEditedStatus("");
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
              <div className="flex items-center justify-between">
                {editingGoalId === goal.id ? (
                  <div className="flex-1 space-y-4">
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-lg"
                    />
                    <Select
                      value={editedStatus}
                      onValueChange={setEditedStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit(goal.id)}
                        className="bg-primary hover:bg-primary/80"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                      <Target className="h-5 w-5" />
                      {goal.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(goal)}
                      className="ml-2"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {!editingGoalId && (
                  <div>
                    <Badge
                      variant="default"
                      className={`mb-2 ${getStatusColor(goal.status)}`}
                    >
                      {goal.status}
                    </Badge>
                  </div>
                )}
                <TaskSection goalId={goal.id} />
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};