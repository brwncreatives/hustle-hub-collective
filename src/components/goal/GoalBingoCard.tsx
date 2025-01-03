import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Star } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BingoGrid } from "./BingoGrid";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { checkForBingo, createBingoGrid, getGoalColor, getGoalIcon } from "@/utils/bingoUtils";

export const GoalBingoCard = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const gridSize = 5;
  const totalCells = gridSize * gridSize;
  const previousCompletedLinesRef = useRef<number>(0);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('goals')
        .select('id, title, status')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching goals:', error);
        return;
      }

      if (data) {
        console.log('Fetched goals:', data);
        setGoals(data);
      }
    };

    fetchGoals();

    // Set up real-time subscription for goals
    const goalsSubscription = supabase
      .channel('goals_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goals',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchGoals();
        }
      )
      .subscribe();

    return () => {
      goalsSubscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (goals.length > 0) {
      const currentCompletedLines = checkForBingo(goals, gridSize);
      
      if (currentCompletedLines > previousCompletedLinesRef.current) {
        toast({
          title: "BINGO! 🎉",
          description: "You've completed a line of goals! Keep up the great work!",
        });
      }

      previousCompletedLinesRef.current = currentCompletedLines;
    }
  }, [goals, toast]);

  const getCompletedGoalsCount = () => {
    return goals.filter(goal => goal.status.toLowerCase() === 'completed').length;
  };

  const renderIcon = (iconName: string | null) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="h-6 w-6 text-[#9b87f5] animate-pulse" />;
      case 'star':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'target':
        return <Target className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>2025 Goal Bingo</span>
          <Badge variant="secondary">
            {getCompletedGoalsCount()} / {goals.length} Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BingoGrid 
          grid={createBingoGrid(goals, totalCells, gridSize)}
          getGoalColor={getGoalColor}
          getGoalIcon={(status) => renderIcon(getGoalIcon(status))}
        />
      </CardContent>
    </Card>
  );
};