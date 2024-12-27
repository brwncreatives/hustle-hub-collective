import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import { GoalCard } from "./GoalCard";

interface Goal {
  id: string;
  title: string;
  status: string;
  quarter?: string;
  categories?: string[];
  progress?: number;
}

interface GoalListProps {
  goals: Goal[];
  onStatusChange: (goalId: string, status: string) => Promise<void>;
}

export const GoalList = ({ goals, onStatusChange }: GoalListProps) => {
  if (goals.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No goals yet</p>
            <p className="text-sm text-muted-foreground">
              Click 'New Goal' to start tracking your progress
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
};