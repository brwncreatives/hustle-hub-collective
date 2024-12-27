import { useState } from "react";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";

export const useTaskManager = (goalId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const addTask = (newTaskTitle: string, isRecurring: boolean, selectedWeek: string) => {
    if (!newTaskTitle.trim()) return;

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      completed: false,
      isRecurring,
      week: parseInt(selectedWeek),
    };

    setTasks(prevTasks => [...prevTasks, task]);
    console.log("Task added:", { goalId, task });
    
    toast({
      description: "Task added successfully",
    });
  };

  const editTask = (taskId: string, newTitle: string) => {
    setTasks(prevTasks =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, title: newTitle } : task
      )
    );
    toast({
      description: "Task updated successfully",
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTasksForWeek = (weekNumber: number) => {
    return tasks.filter(
      (task) => task.isRecurring || task.week === weekNumber
    );
  };

  return {
    tasks,
    addTask,
    editTask,
    toggleTaskCompletion,
    getTasksForWeek,
  };
};