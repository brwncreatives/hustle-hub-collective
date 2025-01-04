import { useState, useCallback, useEffect } from "react";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useTaskManager = (goalId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!goalId || !user) return;

      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('goal_id', goalId);

        if (error) throw error;

        console.log("useTaskManager - Fetched tasks:", data);
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch tasks. Please try again.",
        });
      }
    };

    fetchTasks();
  }, [goalId, user, toast]);

  const addTask = useCallback(async (newTaskTitle: string, isRecurring: boolean, selectedWeek: string) => {
    if (!newTaskTitle.trim() || !goalId || !user) return;

    try {
      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert({
          goal_id: goalId,
          title: newTaskTitle,
          completed: false,
          is_recurring: isRecurring,
          week: isRecurring ? null : parseInt(selectedWeek),
        })
        .select()
        .single();

      if (error) throw error;

      console.log("useTaskManager - Added new task:", newTask);
      setTasks(prevTasks => [...prevTasks, newTask]);

      toast({
        description: "Task added successfully",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add task. Please try again.",
      });
    }
  }, [goalId, user, toast]);

  const editTask = useCallback(async (taskId: string, newTitle: string, isRecurring: boolean, week?: number) => {
    if (!user) return;

    try {
      const { data: updatedTask, error } = await supabase
        .from('tasks')
        .update({
          title: newTitle,
          is_recurring: isRecurring,
          week: isRecurring ? null : week,
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
      
      toast({
        description: "Task updated successfully",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task. Please try again.",
      });
    }
  }, [user, toast]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      toast({
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task. Please try again.",
      });
    }
  }, [user, toast]);

  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    if (!user) return;

    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      const { data: updatedTask, error } = await supabase
        .from('tasks')
        .update({ completed: !taskToUpdate.completed })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status. Please try again.",
      });
    }
  }, [tasks, user, toast]);

  const getTasksForWeek = useCallback((weekNumber: number) => {
    console.log("useTaskManager - Getting tasks for week:", weekNumber, "from tasks:", tasks);
    return tasks.filter(
      (task) => task.is_recurring || task.week === weekNumber
    );
  }, [tasks]);

  return {
    tasks,
    addTask,
    editTask,
    deleteTask,
    toggleTaskCompletion,
    getTasksForWeek,
  };
};