import { useState, useEffect } from "react";
import { TaskItem } from "./TaskItem";
import { TaskListProps } from "@/types/task";
import { useTaskManager } from "@/hooks/useTaskManager";

export const TaskList = ({ goalId }: TaskListProps) => {
  const [selectedWeek, setSelectedWeek] = useState<string>("1");
  
  const {
    tasks,
    editTask,
    toggleTaskCompletion,
    getTasksForWeek,
  } = useTaskManager(goalId);

  const getCurrentWeek = () => {
    return "1";
  };

  useEffect(() => {
    setSelectedWeek(getCurrentWeek());
  }, []);

  const currentWeekTasks = getTasksForWeek(parseInt(selectedWeek));
  console.log("Current week tasks:", currentWeekTasks);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {currentWeekTasks.map((task) => (
          <TaskItem
            key={task.id}
            {...task}
            onToggleComplete={toggleTaskCompletion}
            onEditTask={editTask}
          />
        ))}
        {currentWeekTasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No tasks for this week
          </p>
        )}
      </div>
    </div>
  );
};