import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TaskList } from "../TaskList";
import { TaskSection } from "./TaskSection";
import { Badge } from "../ui/badge";
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
    <Card key={goal.id} className="w-full overflow-hidden bg-black/20 border-primary/10 hover:border-[#9b87f5]/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#9b87f5]" />
              <CardTitle className="text-lg text-white">{goal.title}</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/edit-goal/${goal.id}`)}
              className="h-8 border-primary/20 hover:bg-primary/10"
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
                  className="bg-[#9b87f5]/10 text-[#9b87f5] text-xs h-[22px] px-2 hover:bg-[#9b87f5]/20"
                >
                  {goal.quarter?.split('-')[0]}
                </Badge>
              )}
              {goal.categories?.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="text-xs h-[22px] px-2 bg-white/5 border-white/10 text-white/80"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <TaskSection goalId={goal.id} />
        <TaskList goalId={goal.id} />
      </CardContent>
    </Card>
  );
};