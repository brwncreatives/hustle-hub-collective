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

  const filteredTasks = showCompleted 
    ? tasks
    : tasks.filter(task => !task.completed);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              {...task}
              onToggleComplete={toggleTaskCompletion}
              onEditTask={editTask}
              onDeleteTask={deleteTask}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-2">
            {showCompleted ? "No tasks available" : "No active tasks"}
          </p>
        )}
      </div>
    </div>
  );
};