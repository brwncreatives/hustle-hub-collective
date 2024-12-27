import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TaskList } from "./TaskList";
import { useState, useEffect } from "react";
import { GoalStatusBadge } from "./goal/GoalStatusBadge";
import { Badge } from "./ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "./ui/progress";

interface Goal {
  id: string;
  title: string;
  status: string;
  quarter?: string;
  categories?: string[];
  progress?: number;
}

export const ActiveGoals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchGoalsAndTasks = async () => {
      if (!user) return;

      try {
        // Fetch goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id);

        if (goalsError) throw goalsError;

        // For each goal, fetch its tasks
        const goalsWithProgress = await Promise.all(
          goalsData.map(async (goal) => {
            const { data: tasks, error: tasksError } = await supabase
              .from('tasks')
              .select('*')
              .eq('goal_id', goal.id);

            if (tasksError) throw tasksError;

            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.completed).length;
            const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

            return {
              ...goal,
              progress
            };
          })
        );

        setGoals(goalsWithProgress);
        console.log("Retrieved goals with progress:", goalsWithProgress);
      } catch (error) {
        console.error('Error fetching goals and tasks:', error);
      }
    };

    fetchGoalsAndTasks();
  }, [user]);

  const startEditingStatus = (goalId: string, currentStatus: string) => {
    setEditingStatus(goalId);
    setSelectedStatus(currentStatus);
  };

  const saveStatus = async (goalId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('goals')
        .update({ status: selectedStatus })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      setGoals(prevGoals =>
        prevGoals.map(goal =>
          goal.id === goalId
            ? { ...goal, status: selectedStatus }
            : goal
        )
      );
      setEditingStatus(null);
    } catch (error) {
      console.error('Error updating goal status:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Your Goals</h2>
        <Button
          onClick={() => navigate("/create-goal")}
          size="sm"
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No goals yet</p>
              <p className="text-sm text-muted-foreground">
                Click 'New Goal' to start tracking your progress
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="w-full overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/manage-goal/${goal.id}`)}
                      className="h-8"
                    >
                      Manage Goal
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <GoalStatusBadge
                        status={goal.status}
                        isEditing={editingStatus === goal.id}
                        selectedStatus={selectedStatus}
                        onStatusChange={setSelectedStatus}
                        onSave={() => saveStatus(goal.id)}
                        onCancel={() => setEditingStatus(null)}
                        onStartEditing={() => startEditingStatus(goal.id, goal.status)}
                      />
                      {goal.quarter && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary text-xs h-[22px] px-2 hover:bg-primary/20"
                        >
                          {goal.quarter?.split('-')[0]}
                        </Badge>
                      )}
                      {goal.categories?.map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="text-xs h-[22px] px-2 bg-accent/50 border-accent/20"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TaskList goalId={goal.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};