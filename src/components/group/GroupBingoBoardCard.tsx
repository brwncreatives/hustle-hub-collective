import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { BingoCell } from "./BingoCell";
import { GroupGoal, GoalWithProfile } from "./types/bingo";

export const GroupBingoBoardCard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { groupId } = useParams();
  const [groupGoals, setGroupGoals] = useState<GroupGoal[]>([]);
  const [completedLines, setCompletedLines] = useState<number[][]>([]);

  useEffect(() => {
    const fetchGroupGoals = async () => {
      if (!user || !groupId) return;

      const { data: groupMembers, error: membersError } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId);

      if (membersError) {
        console.error('Error fetching group members:', membersError);
        return;
      }

      const memberIds = groupMembers.map(member => member.user_id);

      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select(`
          id,
          title,
          status,
          user_id,
          profiles!inner (
            first_name,
            last_name
          )
        `)
        .in('user_id', memberIds)
        .returns<GoalWithProfile[]>();

      if (goalsError) {
        console.error('Error fetching goals:', goalsError);
        return;
      }

      console.log('Fetched goals:', goals);

      const formattedGoals: GroupGoal[] = goals.map(goal => ({
        id: goal.id,
        memberId: goal.user_id,
        memberName: `${goal.profiles.first_name} ${goal.profiles.last_name}`,
        title: goal.title,
        progress: goal.status === 'completed' ? 100 : goal.status.toLowerCase() === 'in progress' ? 50 : 0,
        status: goal.status
      }));

      console.log('Formatted group goals:', formattedGoals);
      setGroupGoals(formattedGoals);
    };

    fetchGroupGoals();

    const goalsSubscription = supabase
      .channel('group_goals_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goals',
        },
        () => {
          fetchGroupGoals();
        }
      )
      .subscribe();

    return () => {
      goalsSubscription.unsubscribe();
    };
  }, [user, groupId]);

  const checkForBingoLines = () => {
    if (groupGoals.length === 0) return [];
    
    const lines: number[][] = [];
    const gridSize = 3;

    // Check horizontal lines
    for (let row = 0; row < gridSize; row++) {
      if (isLineComplete(row * gridSize, (row + 1) * gridSize)) {
        lines.push(Array.from({ length: gridSize }, (_, i) => row * gridSize + i));
      }
    }

    // Check vertical lines
    for (let col = 0; col < gridSize; col++) {
      if (isLineComplete(col, col + 6, 3)) {
        lines.push(Array.from({ length: gridSize }, (_, i) => col + i * gridSize));
      }
    }

    // Check diagonal (top-left to bottom-right)
    if (isLineComplete(0, 8, 4)) {
      lines.push([0, 4, 8]);
    }

    // Check diagonal (top-right to bottom-left)
    if (isLineComplete(2, 6, 2)) {
      lines.push([2, 4, 6]);
    }

    return lines;
  };

  const isLineComplete = (start: number, end: number, step = 1) => {
    const goals = groupGoals.slice(start, end);
    return goals.length > 0 && goals.every((goal) => goal?.progress >= 100);
  };

  useEffect(() => {
    if (groupGoals.length > 0) {
      const newLines = checkForBingoLines().filter(
        line => !completedLines.some(existing => 
          existing.length === line.length && 
          existing.every(num => line.includes(num))
        )
      );

      if (newLines.length > 0) {
        setCompletedLines(prev => [...prev, ...newLines]);
        toast({
          title: "BINGO! 🎉",
          description: "A team line of goals has been completed! Great teamwork!",
        });
      }
    }
  }, [groupGoals]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Q1 2024 Bingo Card
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Track your group's Q1 progress together! Each member can set up to three goals for the quarter. Once a goal is marked as complete, it automatically fills the corresponding square on the shared Bingo board. Complete three squares in a row—horizontally, vertically, or diagonally—for a BINGO! Celebrate each milestone and keep the momentum going.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <BingoCell
              key={index}
              goal={groupGoals[index]}
              index={index}
              isCompletedLine={completedLines.some(line => line.includes(index))}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};