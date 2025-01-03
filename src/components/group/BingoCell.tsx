import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Star } from "lucide-react";
import { GroupGoal } from "./types/bingo";

interface BingoCellProps {
  goal?: GroupGoal;
  index: number;
  isCompletedLine: boolean;
}

export const BingoCell = ({ goal, index, isCompletedLine }: BingoCellProps) => {
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

  return (
    <div
      key={goal?.id || `empty-${index}`}
      className={`
        aspect-square p-4 border rounded-lg
        flex flex-col items-center justify-center text-center
        transition-all duration-200
        ${goal ? getStatusColor(goal.status) : 'bg-gray-50/50 border-dashed border-gray-200'}
        ${isCompletedLine ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      {goal ? (
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
};