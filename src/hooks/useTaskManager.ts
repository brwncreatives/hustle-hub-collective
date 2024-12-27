import { useState, useCallback } from "react";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";

export const useTaskManager = (goalId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const addTask = useCallback((newTaskTitle: string, isRecurring: boolean, selectedWeek: string) => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      completed: false,
      isRecurring,
      week: parseInt(selectedWeek),
    };

    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, newTask];
      console.log("Tasks after adding:", updatedTasks);
      return updatedTasks;
    });

    toast({
      description: "Task added successfully",
    });
  }, [toast]);

  const editTask = useCallback((taskId: string, newTitle: string) => {
    setTasks(prevTasks =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, title: newTitle } : task
      )
    );
    toast({
      description: "Task updated successfully",
    });
  }, [toast]);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const getTasksForWeek = useCallback((weekNumber: number) => {
    return tasks.filter(
      (task) => task.isRecurring || task.week === weekNumber
    );
  }, [tasks]);

  return {
    tasks,
    addTask,
    editTask,
    toggleTaskCompletion,
    getTasksForWeek,
  };
};