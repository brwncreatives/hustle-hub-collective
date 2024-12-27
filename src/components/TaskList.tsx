import { useState, useEffect } from "react";
import { TaskItem } from "./TaskItem";
import { TaskListProps } from "@/types/task";
import { useTaskManager } from "@/hooks/useTaskManager";

export const TaskList = ({ goalId, showCompleted = false }: TaskListProps) => {
  const {
    tasks,
    editTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTaskManager(goalId);

  useEffect(() => {
    console.log("TaskList - All tasks:", tasks);
    console.log("TaskList - goalId:", goalId);
  }, [tasks, goalId]);

  // Group tasks by week
  const groupedTasks = tasks.reduce((acc, task) => {
    if (showCompleted || !task.completed) {
      if (task.isRecurring) {
        // Add recurring tasks to all weeks
        for (let week = 1; week <= 12; week++) {
          const weekKey = `week${week}`;
          acc[weekKey] = acc[weekKey] || [];
          acc[weekKey].push({ ...task, week });
        }
      } else {
        // Add non-recurring tasks to their specific week
        const weekKey = `week${task.week}`;
        acc[weekKey] = acc[weekKey] || [];
        acc[weekKey].push(task);
      }
    }
    return acc;
  }, {} as Record<string, any>);

  // Sort weeks numerically
  const sortedWeeks = Object.keys(groupedTasks)
    .sort((a, b) => {
      const weekA = parseInt(a.replace('week', ''));
      const weekB = parseInt(b.replace('week', ''));
      return weekA - weekB;
    });

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
        
        return (
          <div key={weekKey} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Week {weekKey.replace('week', '')}
            </h4>
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
          </div>
        );
      })}
    </div>
  );
};