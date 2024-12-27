import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  title: string;
  status: string;
  quarter?: string;
}

export const GoalBingoCard = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { toast } = useToast();
  const gridSize = 5;
  const totalCells = gridSize * gridSize;

  useEffect(() => {
    // Mock data with a completed goal for demonstration
    const mockGoals = [
      { id: '1', title: 'Complete React Course', status: 'completed', quarter: 'Q1-2024' },
      { id: '2', title: 'Build Portfolio', status: 'in progress', quarter: 'Q1-2024' },
      { id: '3', title: 'Learn TypeScript', status: 'not started', quarter: 'Q1-2024' },
    ];
    setGoals(mockGoals);
  }, []);

  const getCompletedGoalsCount = () => {
    return goals.filter(goal => goal.status.toLowerCase() === 'completed').length;
  };

  const checkForBingo = () => {
    const completedGoals = goals.filter(goal => goal.status.toLowerCase() === 'completed');
    if (completedGoals.length >= 5) {
      toast({
        title: "BINGO! 🎉",
        description: "You've completed a line of goals! Keep up the great work!",
      });
    }
  };

  useEffect(() => {
    checkForBingo();
  }, [goals]);

  // Create a 5x5 grid with goals and empty cells
  const createBingoGrid = () => {
    const grid = [];
    const completedGoals = goals.filter(goal => goal.status.toLowerCase() === 'completed');
    const inProgressGoals = goals.filter(goal => goal.status.toLowerCase() === 'in progress');
    const notStartedGoals = goals.filter(goal => goal.status.toLowerCase() === 'not started');
    
    // Combine all goals and pad with empty cells if needed
    const allGoals = [...completedGoals, ...inProgressGoals, ...notStartedGoals];
    const paddedGoals = [...allGoals];
    
    while (paddedGoals.length < totalCells) {
      paddedGoals.push({ id: `empty-${paddedGoals.length}`, title: '', status: 'empty' });
    }

    // Create the grid rows
    for (let i = 0; i < gridSize; i++) {
      const row = paddedGoals.slice(i * gridSize, (i + 1) * gridSize);
      grid.push(row);
    }

    return grid;
  };

  const getGoalIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Trophy className="h-5 w-5 text-[#9b87f5]" />;
      case 'in progress':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'not started':
        return <Target className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getGoalColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-[#9b87f5]/10 border-[#9b87f5] shadow-md shadow-[#9b87f5]/20';
      case 'in progress':
        return 'bg-yellow-50 border-yellow-200';
      case 'not started':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50/50 border-dashed border-gray-200';
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>2025 Goal Bingo</span>
          <Badge variant="secondary">
            {getCompletedGoalsCount()} / {goals.length} Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {createBingoGrid().map((row, rowIndex) => (
            row.map((goal, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square p-2 border rounded-lg flex flex-col items-center justify-center text-center transition-all ${getGoalColor(goal.status)}`}
              >
                {goal.status !== 'empty' ? (
                  <>
                    {getGoalIcon(goal.status)}
                    <span className="text-xs mt-1 line-clamp-2">{goal.title}</span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">Empty</span>
                )}
              </div>
            ))
          ))}
        </div>
      </CardContent>
    </Card>
  );
};