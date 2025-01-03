import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

interface GroupGoal {
  id: string;
  memberId: string;
  memberName: string;
  title: string;
  progress: number;
  status: string;
}

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
          profiles!inner(
            first_name,
            last_name
          )
        `)
        .in('user_id', memberIds);

      if (goalsError) {
        console.error('Error fetching goals:', goalsError);
        return;
      }

      const formattedGoals: GroupGoal[] = goals.map(goal => ({
        id: goal.id,
        memberId: goal.user_id,
        memberName: `${goal.profiles.first_name} ${goal.profiles.last_name}`,
        title: goal.title,
        progress: goal.status === 'completed' ? 100 : goal.status === 'in progress' ? 50 : 0,
        status: goal.status
      }));

      console.log('Formatted group goals:', formattedGoals);
      setGroupGoals(formattedGoals);
    };

    fetchGroupGoals();

    // Set up real-time subscription
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
    // Only check for bingo if there are actual goals
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-primary/10 border-primary';
      case 'in progress':
        return 'bg-yellow-50/80 border-yellow-200';
      case 'not started':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50/50 border-dashed border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Trophy className="h-5 w-5 text-primary" />;
      case 'in progress':
        return <Star className="h-5 w-5 text-yellow-500" />;
      default:
        return <Target className="h-5 w-5 text-gray-400" />;
    }
  };

  useEffect(() => {
    // Only check for new lines if there are goals
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
          {Array.from({ length: 9 }).map((_, index) => {
            const goal = groupGoals[index];
            const isEmptyCell = !goal;
            
            return (
              <div
                key={goal?.id || `empty-${index}`}
                className={`
                  aspect-square p-4 border rounded-lg
                  flex flex-col items-center justify-center text-center
                  transition-all duration-200
                  ${goal ? getStatusColor(goal.status) : 'bg-gray-50/50 border-dashed border-gray-200'}
                  ${completedLines.some(line => line.includes(index)) ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}
              >
                {!isEmptyCell ? (
                  <>
                    {getStatusIcon(goal.status)}
                    <div className="text-sm font-medium mb-1 line-clamp-2">
                      {goal.title}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {goal.memberName}
                    </div>
                    <Progress value={goal.progress} className="h-2 w-full" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {goal.progress}%
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">Empty Goal Slot</span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
