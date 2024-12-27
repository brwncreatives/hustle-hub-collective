import { useState, useEffect } from "react";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { TaskListProps } from "@/types/task";
import { useTaskManager } from "@/hooks/useTaskManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const TaskList = ({ goalId }: TaskListProps) => {
  const [newTask, setNewTask] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string>("1");
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    tasks,
    addTask,
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

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask, isRecurring, selectedWeek);
      setNewTask("");
      setIsOpen(false);
    }
  };

  const currentWeekTasks = getTasksForWeek(parseInt(selectedWeek));
  console.log("Current week tasks:", currentWeekTasks); // Debug log

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