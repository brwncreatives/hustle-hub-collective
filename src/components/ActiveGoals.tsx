import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TaskSection } from "./goal/TaskSection";
import { WeeklyRecapSection } from "./goal/WeeklyRecapSection";

export const ActiveGoals = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => navigate("/create-goal")}
          size="sm"
          className="bg-primary hover:bg-primary/80 text-primary-foreground"
        >
          Add Goal
        </Button>
      </div>

      <Card className="border-none bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-primary">
            <Target className="h-5 w-5" />
            Active Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div>
              <Badge
                variant="default"
                className="mb-2 bg-green-500 hover:bg-green-600"
              >
                In Progress
              </Badge>
              <p className="font-medium text-foreground">Learn React Native</p>
            </div>

            <TaskSection goalId="learn-react-native" />

            <div className="flex justify-end gap-2 mt-4">
              <WeeklyRecapSection goalId="learn-react-native" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};