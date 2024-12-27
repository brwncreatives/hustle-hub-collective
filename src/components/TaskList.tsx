import { useState, useEffect } from "react";
import { TaskItem } from "./TaskItem";
import { TaskListProps } from "@/types/task";
import { useTaskManager } from "@/hooks/useTaskManager";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export const TaskList = ({ goalId, showCompleted = false }: TaskListProps) => {
  const {
    tasks,
    editTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTaskManager(goalId);

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const currentWeek = Math.ceil(diff / oneWeek);
    return (currentWeek % 12) || 12; // Returns 1-12, mapping week 13 back to 1, etc.
  };

  useEffect(() => {
    console.log("TaskList - All tasks:", tasks);
    console.log("TaskList - goalId:", goalId);
  }, [tasks, goalId]);

  // Group tasks by week
  const groupedTasks = tasks.reduce((acc, task) => {
    if (task.isRecurring) {
      if (!task.completed || (showCompleted && task.completed)) {
        const weeksToShow = task.completed ? [task.week || 1] : Array.from({ length: 12 }, (_, i) => i + 1);
        weeksToShow.forEach(week => {
          const weekKey = `week${week}`;
          acc[weekKey] = acc[weekKey] || [];
          acc[weekKey].push({ ...task, week });
        });
      }
    } else {
      if (!task.completed || (showCompleted && task.completed)) {
        const weekKey = `week${task.week}`;
        acc[weekKey] = acc[weekKey] || [];
        acc[weekKey].push(task);
      }
    }
    return acc;
  }, {} as Record<string, any>);

  // Sort weeks in reverse order (most recent first)
  const sortedWeeks = Object.keys(groupedTasks)
    .sort((a, b) => {
      const weekA = parseInt(a.replace('week', ''));
      const weekB = parseInt(b.replace('week', ''));
      return weekB - weekA; // Reverse order
    });

  const currentWeek = getCurrentWeek();

  if (sortedWeeks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-2">
        {showCompleted ? "No tasks available" : "No active tasks"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {sortedWeeks.map((weekKey) => {
        if (groupedTasks[weekKey].length === 0) return null;
        
        const weekNumber = parseInt(weekKey.replace('week', ''));
        const isCurrentWeek = weekNumber === currentWeek;
        
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
                <span className="text-xs text-muted-foreground">
                  {groupedTasks[weekKey].length} {groupedTasks[weekKey].length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
              <div className="space-y-2">
                {groupedTasks[weekKey].map((task: any) => (
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