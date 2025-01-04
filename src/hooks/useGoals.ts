import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Goal {
  id: string;
  title: string;
  status: string;
  quarter?: string;
  categories?: string[];
  progress?: number;
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[] | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
        toast.error('Failed to fetch goals');
        return;
      }

      setGoals(data);
    } catch (error) {
      console.error('Error in fetchGoals:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const updateGoalStatus = async (goalId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ status })
        .eq('id', goalId);

      if (error) {
        console.error('Error updating goal status:', error);
        toast.error('Failed to update goal status');
        return;
      }

      // Optimistically update the local state
      setGoals(prevGoals => 
        prevGoals?.map(goal => 
          goal.id === goalId ? { ...goal, status } : goal
        ) || null
      );

      toast.success('Goal status updated successfully');
    } catch (error) {
      console.error('Error in updateGoalStatus:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return {
    goals,
    updateGoalStatus,
  };
}