import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, Star } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTaskManager } from "@/hooks/useTaskManager";

interface TaskBingoCardProps {
  goalId: string;
}

export const TaskBingoCard = ({ goalId }: TaskBingoCardProps) => {
  const { tasks, toggleTaskCompletion } = useTaskManager(goalId);
  const { toast } = useToast();
  const gridSize = 5;
  const totalCells = gridSize * gridSize;

  const checkForBingo = () => {
    const completedTasks = tasks.filter(task => task.completed);
    if (completedTasks.length >= 5) {
      toast({
        title: "BINGO! 🎉",
        description: "You've completed a line of tasks! Keep up the great work!",
      });
    }
  };

  useEffect(() => {
    checkForBingo();
  }, [tasks]);

  // Create a 5x5 grid with tasks and empty cells
  const createBingoGrid = () => {
    const grid = [];
    const completedTasks = tasks.filter(task => task.completed);
    const inProgressTasks = tasks.filter(task => !task.completed);
    
    // Combine all tasks and pad with empty cells if needed
    const allTasks = [...completedTasks, ...inProgressTasks];
    const paddedTasks = [...allTasks];
    
    while (paddedTasks.length < totalCells) {
      paddedTasks.push({ id: `empty-${paddedTasks.length}`, title: '', completed: false, isRecurring: false });
    }

    // Create the grid rows
    for (let i = 0; i < gridSize; i++) {
      const row = paddedTasks.slice(i * gridSize, (i + 1) * gridSize);
      grid.push(row);
    }

    return grid;
  };

  const getTaskIcon = (completed: boolean) => {
    if (completed) {
      return <Trophy className="h-5 w-5 text-[#9b87f5]" />;
    }
    return <Target className="h-5 w-5 text-gray-400" />;
  };

  const getTaskColor = (completed: boolean, isEmpty: boolean) => {
    if (isEmpty) return 'bg-gray-50/50 border-dashed border-gray-200';
    if (completed) return 'bg-[#9b87f5]/10 border-[#9b87f5]';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {createBingoGrid().map((row, rowIndex) => (
        row.map((task, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`aspect-square p-2 border rounded-lg flex flex-col items-center justify-center text-center transition-all cursor-pointer ${getTaskColor(task.completed, task.title === '')}`}
            onClick={() => task.title && toggleTaskCompletion(task.id)}
          >
            {task.title ? (
              <>
                {getTaskIcon(task.completed)}
                <span className="text-xs mt-1 line-clamp-2">{task.title}</span>
              </>
            ) : (
              <span className="text-xs text-gray-400">Empty</span>
            )}
          </div>
        ))
      ))}
    </div>
  );
};