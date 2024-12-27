import { Card, CardContent } from "../ui/card";
import { Trophy, Target, Star } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTaskManager } from "@/hooks/useTaskManager";

interface TaskBingoCardProps {
  goalId: string;
}

export const TaskBingoCard = ({ goalId }: TaskBingoCardProps) => {
  const { tasks, toggleTaskCompletion } = useTaskManager(goalId);
  const { toast } = useToast();
  const gridRows = 3;
  const gridCols = 4;
  const totalCells = gridRows * gridCols;

  const checkForWeekCompletion = () => {
    // Group tasks by week
    const tasksByWeek = tasks.reduce((acc, task) => {
      const weekKey = task.week?.toString() || '1';
      if (!acc[weekKey]) {
        acc[weekKey] = [];
      }
      acc[weekKey].push(task);
      return acc;
    }, {} as Record<string, any[]>);

    // Check each week's completion status
    Object.entries(tasksByWeek).forEach(([week, weekTasks]) => {
      const hasIncompleteTasks = weekTasks.some(task => !task.completed);
      const hasCompletedTasks = weekTasks.some(task => task.completed);
      
      // Only show toast if ALL tasks for the week are completed
      // and at least one task exists
      if (weekTasks.length > 0 && !hasIncompleteTasks && hasCompletedTasks) {
        toast({
          title: "Week Complete! 🎉",
          description: `You've completed all tasks for Week ${week}!`,
        });
      }
    });
  };

  useEffect(() => {
    checkForWeekCompletion();
  }, [tasks]);

  // Create a 3x4 grid with tasks organized by week
  const createWeeklyGrid = () => {
    const grid = [];
    const weeklyTasks = new Array(12).fill(null).map((_, index) => {
      const weekNumber = index + 1;
      const tasksForWeek = tasks.filter(task => 
        task.isRecurring || task.week === weekNumber
      );
      return {
        weekNumber,
        tasks: tasksForWeek,
        completed: tasksForWeek.length > 0 && tasksForWeek.every(task => task.completed)
      };
    });

    // Create the grid rows
    for (let i = 0; i < gridRows; i++) {
      const row = weeklyTasks.slice(i * gridCols, (i + 1) * gridCols);
      grid.push(row);
    }

    return grid;
  };

  const getWeekIcon = (weekData: { completed: boolean; tasks: any[] }) => {
    if (weekData.completed) {
      return <Trophy className="h-5 w-5 text-[#9b87f5]" />;
    }
    if (weekData.tasks.some(task => task.completed)) {
      return <Star className="h-5 w-5 text-yellow-500" />;
    }
    return <Target className="h-5 w-5 text-gray-400" />;
  };

  const getWeekColor = (weekData: { completed: boolean; tasks: any[] }) => {
    if (weekData.completed) {
      return 'bg-[#9b87f5]/10 border-[#9b87f5]';
    }
    if (weekData.tasks.some(task => task.completed)) {
      return 'bg-yellow-50 border-yellow-200';
    }
    return weekData.tasks.length > 0 
      ? 'bg-gray-50 border-gray-200'
      : 'bg-gray-50/50 border-dashed border-gray-200';
  };

  const getCompletedWeeksCount = () => {
    return createWeeklyGrid().flat().filter(week => week.completed).length;
  };

  return (
    <Card className="w-full mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">12-Week Progress</h3>
          <Badge variant="secondary">
            {getCompletedWeeksCount()} / 12 Weeks Complete
          </Badge>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {createWeeklyGrid().map((row, rowIndex) => (
            row.map((weekData, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square p-2 border rounded-lg flex flex-col items-center justify-center text-center transition-all ${getWeekColor(weekData)}`}
              >
                {getWeekIcon(weekData)}
                <span className="text-xs mt-1 font-medium">Week {weekData.weekNumber}</span>
                <span className="text-xs text-muted-foreground">
                  {weekData.tasks.length} {weekData.tasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            ))
          ))}
        </div>
      </CardContent>
    </Card>
  );
};