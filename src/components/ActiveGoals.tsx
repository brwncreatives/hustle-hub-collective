import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalList } from "@/components/goal/GoalList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useGoals } from "@/hooks/useGoals";

export function ActiveGoals() {
  const { goals, updateGoalStatus } = useGoals();
  const activeGoals = goals?.filter(goal => goal.status !== 'Completed') || [];

  return (
    <Card className="border-none bg-white/5 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Active Goals</CardTitle>
        <Button 
          asChild
          className="bg-[#9b87f5] hover:bg-[#9b87f5]/80 transition-colors"
        >
          <Link to="/goals/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Goal
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <GoalList goals={activeGoals} onStatusChange={updateGoalStatus} />
      </CardContent>
    </Card>
  );
}