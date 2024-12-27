import { useState, useEffect } from "react";
import { TaskItem } from "./TaskItem";
import { TaskListProps } from "@/types/task";
import { useTaskManager } from "@/hooks/useTaskManager";

export const TaskList = ({ goalId }: TaskListProps) => {
  const [selectedWeek, setSelectedWeek] = useState<string>("1");
  
  const {
    tasks,
    editTask,
    deleteTask,
    toggleTaskCompletion,
    getTasksForWeek,
  } = useTaskManager(goalId);

  useEffect(() => {
    console.log("TaskList - All tasks:", tasks);
    console.log("TaskList - goalId:", goalId);
  }, [tasks, goalId]);

  const getCurrentWeek = () => {
    return "1";
  };

  useEffect(() => {
    setSelectedWeek(getCurrentWeek());
  }, []);

  const currentWeekTasks = getTasksForWeek(parseInt(selectedWeek));
  console.log("TaskList - Current week tasks:", currentWeekTasks, "for week:", selectedWeek);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {Array.isArray(currentWeekTasks) && currentWeekTasks.length > 0 ? (
          currentWeekTasks.map((task) => (
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
            No tasks for this week
          </p>
        )}
      </div>
    </div>
  );
};