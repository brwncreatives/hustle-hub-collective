import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GoalList } from "./goal/GoalList";

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
  const { user } = useAuth();
  const { toast } = useToast();

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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch goals and tasks. Please try again.",
        });
      }
    };

    fetchGoalsAndTasks();
  }, [user, toast]);

  const handleStatusChange = async (goalId: string, newStatus: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('goals')
        .update({ status: newStatus })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      setGoals(prevGoals =>
        prevGoals.map(goal =>
          goal.id === goalId
            ? { ...goal, status: newStatus }
            : goal
        )
      );

      toast({
        description: "Goal status updated successfully",
      });
    } catch (error) {
      console.error('Error updating goal status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update goal status. Please try again.",
      });
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

      <GoalList goals={goals} onStatusChange={handleStatusChange} />
    </div>
  );
};