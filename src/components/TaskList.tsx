import { useState, useEffect } from "react";
import { TaskItem } from "./TaskItem";
import { TaskListProps } from "@/types/task";
import { useTaskManager } from "@/hooks/useTaskManager";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export const TaskList = ({ goalId, showCompleted = false }: TaskListProps) => {
  const {
    tasks,
    editTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTaskManager(goalId);

  const [showAllWeeks, setShowAllWeeks] = useState(false);
  const [completedTasksVisibility, setCompletedTasksVisibility] = useState<Record<string, boolean>>({});

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const currentWeek = Math.ceil(diff / oneWeek);
    return (currentWeek % 12) || 12;
  };

  useEffect(() => {
    console.log("TaskList - All tasks:", tasks);
    console.log("TaskList - goalId:", goalId);
  }, [tasks, goalId]);

  // Group tasks by week
  const groupedTasks = tasks.reduce((acc, task) => {
    if (Object.keys(acc).length === 0) {
      for (let i = 1; i <= 12; i++) {
        acc[`week${i}`] = [];
      }
    }

    if (task.isRecurring) {
      const weeksToShow = task.completed ? [task.week || 1] : Array.from({ length: 12 }, (_, i) => i + 1);
      weeksToShow.forEach(week => {
        const weekKey = `week${week}`;
        acc[weekKey].push({ ...task, week });
      });
    } else {
      const weekKey = `week${task.week}`;
      if (weekKey) {
        acc[weekKey].push(task);
      }
    }
    return acc;
  }, {} as Record<string, any>);

  const currentWeek = getCurrentWeek();
  
  // Sort weeks in chronological order, but put current week first
  const sortedWeeks = Object.keys(groupedTasks)
    .sort((a, b) => {
      if (parseInt(a.replace('week', '')) === currentWeek) return -1;
      if (parseInt(b.replace('week', '')) === currentWeek) return 1;
      return parseInt(a.replace('week', '')) - parseInt(b.replace('week', ''));
    });

  if (tasks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-2">
        {showCompleted ? "No tasks available" : "No active tasks"}
      </p>
    );
  }

  const toggleCompletedForWeek = (weekKey: string) => {
    setCompletedTasksVisibility(prev => ({
      ...prev,
      [weekKey]: !prev[weekKey]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="show-all-weeks"
          checked={showAllWeeks}
          onCheckedChange={setShowAllWeeks}
        />
        <Label htmlFor="show-all-weeks">Show all weeks</Label>
      </div>

      {sortedWeeks.map((weekKey) => {
        const weekNumber = parseInt(weekKey.replace('week', ''));
        const isCurrentWeek = weekNumber === currentWeek;
        const tasksForWeek = groupedTasks[weekKey];
        const showCompletedForWeek = completedTasksVisibility[weekKey];
        
        // Only show weeks that have tasks or are the current week
        if (tasksForWeek.length === 0 && !isCurrentWeek) return null;
        
        // Hide non-current weeks if showAllWeeks is false
        if (!showAllWeeks && !isCurrentWeek) return null;

        const filteredTasks = showCompletedForWeek 
          ? tasksForWeek 
          : tasksForWeek.filter((task: any) => !task.completed);
        
        return (
          <Card 
            key={weekKey} 
            className={`bg-background/50 ${isCurrentWeek ? 'ring-2 ring-primary' : ''}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">Week {weekNumber}</h4>
                  {isCurrentWeek && (
                    <Badge variant="secondary" className="text-xs">
                      Current Week
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`show-completed-${weekKey}`}
                      checked={showCompletedForWeek}
                      onCheckedChange={() => toggleCompletedForWeek(weekKey)}
                    />
                    <Label htmlFor={`show-completed-${weekKey}`} className="text-xs">
                      Show completed
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {filteredTasks.map((task: any) => (
                  <TaskItem
                    key={`${task.id}-${weekKey}`}
                    {...task}
                    onToggleComplete={toggleTaskCompletion}
                    onEditTask={editTask}
                    onDeleteTask={deleteTask}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};