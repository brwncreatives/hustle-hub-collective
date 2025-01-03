import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BingoCell } from "./BingoCell";
import { GroupGoal, GoalWithProfile } from "./types/bingo";

export const GroupBingoBoardCard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [groupGoals, setGroupGoals] = useState<GroupGoal[]>([]);
  const [completedLines, setCompletedLines] = useState<number[][]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGroup = async () => {
      if (!user) return;

      try {
        const { data: groupMember, error: groupError } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (groupError) {
          console.error('Error fetching user group:', groupError);
          toast({
            title: "Error",
            description: "Could not fetch your group information. Please try again later.",
            variant: "destructive"
          });
          return;
        }

        if (groupMember) {
          console.log('Found group ID:', groupMember.group_id);
          setGroupId(groupMember.group_id);
        } else {
          console.log('No group found for user');
          toast({
            title: "No Group Found",
            description: "You are not currently a member of any group. Join or create a group to see the bingo board.",
          });
        }
      } catch (error) {
        console.error('Error in fetchUserGroup:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroup();
  }, [user, toast]);

  useEffect(() => {
    const fetchGroupGoals = async () => {
      if (!user || !groupId) return;

      console.log('Fetching goals for group:', groupId);

      try {
        // First get group members
        const { data: groupMembers, error: membersError } = await supabase
          .from('group_members')
          .select('user_id')
          .eq('group_id', groupId);

        if (membersError) {
          console.error('Error fetching group members:', membersError);
          return;
        }

        const memberIds = groupMembers.map(member => member.user_id);
        console.log('Group member IDs:', memberIds);

        // Then get goals
        const { data: goals, error: goalsError } = await supabase
          .from('goals')
          .select('id, title, status, user_id')
          .in('user_id', memberIds);

        if (goalsError) {
          console.error('Error fetching goals:', goalsError);
          return;
        }

        // Finally get profiles separately
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', memberIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return;
        }

        // Combine the data
        const formattedGoals: GroupGoal[] = goals.map(goal => {
          const profile = profiles.find(p => p.id === goal.user_id);
          return {
            id: goal.id,
            memberId: goal.user_id,
            memberName: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown Member',
            title: goal.title,
            progress: goal.status === 'completed' ? 100 : goal.status.toLowerCase() === 'in progress' ? 50 : 0,
            status: goal.status
          };
        });

        console.log('Formatted group goals:', formattedGoals);
        setGroupGoals(formattedGoals);
      } catch (error) {
        console.error('Error in fetchGroupGoals:', error);
        toast({
          title: "Error",
          description: "Failed to fetch group goals. Please try again later.",
          variant: "destructive"
        });
      }
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
  }, [user, groupId, toast]);

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
        {!loading && !groupId && (
          <p className="text-sm text-muted-foreground mt-2">
            You are not currently a member of any group. Join or create a group to participate in group bingo!
          </p>
        )}
        {groupId && (
          <p className="text-sm text-muted-foreground mt-2">
            Track your group's Q1 progress together! Each member can set up to three goals for the quarter. Once a goal is marked as complete, it automatically fills the corresponding square on the shared Bingo board. Complete three squares in a row—horizontally, vertically, or diagonally—for a BINGO! Celebrate each milestone and keep the momentum going.
          </p>
        )}
      </CardHeader>
      {groupId && (
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
      )}
    </Card>
  );
};