import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TaskList } from "../TaskList";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { GoalStatusBadge } from "./GoalStatusBadge";

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    status: string;
    quarter?: string;
    categories?: string[];
    progress?: number;
  };
  onStatusChange: (goalId: string, status: string) => Promise<void>;
}

export const GoalCard = ({ goal, onStatusChange }: GoalCardProps) => {
  const navigate = useNavigate();

  return (
    <Card key={goal.id} className="w-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{goal.title}</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/manage-goal/${goal.id}`)}
              className="h-8"
            >
              Manage Goal
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <GoalStatusBadge
                status={goal.status}
                goalId={goal.id}
                onStatusChange={onStatusChange}
              />
              {goal.quarter && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary text-xs h-[22px] px-2 hover:bg-primary/20"
                >
                  {goal.quarter?.split('-')[0]}
                </Badge>
              )}
              {goal.categories?.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="text-xs h-[22px] px-2 bg-accent/50 border-accent/20"
                >
                  {category}
                </Badge>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TaskList goalId={goal.id} />
      </CardContent>
    </Card>
  );
};