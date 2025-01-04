import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { BingoBoardCell } from "./board/BingoBoardCell";
import { useGroupBoardData } from "@/hooks/useGroupBoardData";
import { CompletedLine } from "./types/board";

export const GroupBingoBoardCard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [completedLines, setCompletedLines] = useState<CompletedLine[]>([]);
  const { groupGoals, groupId, loading } = useGroupBoardData(user?.id);

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
    return goals.length > 0 && goals.every((goal) => goal?.status === 'completed');
  };

  useEffect(() => {
    if (groupGoals.length > 0) {
      const newLines = checkForBingoLines().filter(
        line => !completedLines.some(existing => 
          existing.indices?.length === line.length && 
          existing.indices?.every(num => line.includes(num))
        )
      );

      if (newLines.length > 0) {
        setCompletedLines(prev => [...prev, ...newLines.map(indices => ({ indices }))]);
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
              <BingoBoardCell
                key={index}
                goal={groupGoals[index]}
                index={index}
                isCompletedLine={completedLines.some(line => line.indices.includes(index))}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};