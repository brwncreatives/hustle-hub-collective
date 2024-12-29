import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Star } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BingoGrid } from "./BingoGrid";
import { Goal } from "./types/bingo";

export const GoalBingoCard = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { toast } = useToast();
  const gridSize = 5;
  const totalCells = gridSize * gridSize;
  const previousCompletedLinesRef = useRef<number>(0);

  const getCompletedGoalsCount = () => {
    return goals.filter(goal => goal.status.toLowerCase() === 'completed').length;
  };

  const checkForBingo = () => {
    let currentCompletedLines = 0;

    // Check horizontal lines
    for (let row = 0; row < gridSize; row++) {
      if (isLineComplete(row * gridSize, (row + 1) * gridSize)) {
        currentCompletedLines++;
      }
    }

    // Check vertical lines
    for (let col = 0; col < gridSize; col++) {
      if (isLineComplete(col, col + 6, 3)) {
        currentCompletedLines++;
      }
    }

    // Check diagonals
    if (isLineComplete(0, 8, 4)) currentCompletedLines++;
    if (isLineComplete(2, 6, 2)) currentCompletedLines++;

    if (currentCompletedLines > previousCompletedLinesRef.current) {
      toast({
        title: "BINGO! 🎉",
        description: "You've completed a line of goals! Keep up the great work!",
      });
    }

    previousCompletedLinesRef.current = currentCompletedLines;
  };

  useEffect(() => {
    if (goals.length > 0) {
      checkForBingo();
    }
  }, [goals]);

  const isLineComplete = (start: number, end: number, step = 1) => {
    const lineGoals = goals.slice(start, end);
    return lineGoals.every((goal) => goal.status.toLowerCase() === 'completed');
  };

  const createBingoGrid = () => {
    const completedGoals = goals.filter(goal => goal.status.toLowerCase() === 'completed');
    const inProgressGoals = goals.filter(goal => goal.status.toLowerCase() === 'in progress');
    const notStartedGoals = goals.filter(goal => goal.status.toLowerCase() === 'not started');
    
    const allGoals = [...completedGoals, ...inProgressGoals, ...notStartedGoals];
    const paddedGoals = [...allGoals];
    
    while (paddedGoals.length < totalCells) {
      paddedGoals.push({ id: `empty-${paddedGoals.length}`, title: '', status: 'empty' });
    }

    const grid = [];
    for (let i = 0; i < gridSize; i++) {
      grid.push(paddedGoals.slice(i * gridSize, (i + 1) * gridSize));
    }

    return grid;
  };

  const getGoalIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Trophy className="h-6 w-6 text-[#9b87f5] animate-pulse" />;
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
        return 'bg-[#9b87f5]/20 border-2 border-[#9b87f5] shadow-lg shadow-[#9b87f5]/30 scale-105 transform transition-all duration-200';
      case 'in progress':
        return 'bg-yellow-50 border border-yellow-200';
      case 'not started':
        return 'bg-gray-50 border border-gray-200';
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
        <BingoGrid 
          grid={createBingoGrid()}
          getGoalColor={getGoalColor}
          getGoalIcon={getGoalIcon}
        />
      </CardContent>
    </Card>
  );
};