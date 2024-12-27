import { useState, useCallback, useEffect } from "react";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";

export const useTaskManager = (goalId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  // Load tasks from localStorage when the component mounts
  useEffect(() => {
    const storedTasks = localStorage.getItem(`tasks-${goalId}`);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
      console.log("Loaded tasks for goal:", goalId, JSON.parse(storedTasks));
    }
  }, [goalId]);

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
      // Save to localStorage
      localStorage.setItem(`tasks-${goalId}`, JSON.stringify(updatedTasks));
      console.log("Tasks after adding:", updatedTasks);
      return updatedTasks;
    });

    toast({
      description: "Task added successfully",
    });
  }, [goalId, toast]);

  const editTask = useCallback((taskId: string, newTitle: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, title: newTitle } : task
      );
      localStorage.setItem(`tasks-${goalId}`, JSON.stringify(updatedTasks));
      return updatedTasks;
    });
    
    toast({
      description: "Task updated successfully",
    });
  }, [goalId, toast]);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      localStorage.setItem(`tasks-${goalId}`, JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, [goalId]);

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