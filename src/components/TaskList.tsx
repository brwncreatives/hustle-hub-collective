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
    // Always show recurring tasks
    if (task.isRecurring) {
      acc.recurring = acc.recurring || [];
      if (showCompleted || !task.completed) {
        acc.recurring.push(task);
      }
    } else {
      // Group non-recurring tasks by week
      const weekKey = `week${task.week}`;
      acc[weekKey] = acc[weekKey] || [];
      if (showCompleted || !task.completed) {
        acc[weekKey].push(task);
      }
    }
    return acc;
  }, {} as Record<string, any>);

  // Sort weeks numerically
  const sortedWeeks = Object.keys(groupedTasks)
    .filter(key => key !== 'recurring')
    .sort((a, b) => {
      const weekA = parseInt(a.replace('week', ''));
      const weekB = parseInt(b.replace('week', ''));
      return weekA - weekB;
    });

  if (Object.keys(groupedTasks).length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-2">
        {showCompleted ? "No tasks available" : "No active tasks"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Show recurring tasks first */}
      {groupedTasks.recurring && groupedTasks.recurring.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Recurring Tasks</h4>
          <div className="space-y-2">
            {groupedTasks.recurring.map((task: any) => (
              <TaskItem
                key={task.id}
                {...task}
                onToggleComplete={toggleTaskCompletion}
                onEditTask={editTask}
                onDeleteTask={deleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show weekly tasks */}
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
                  key={task.id}
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