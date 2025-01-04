import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { TaskItem } from "../TaskItem";
import { Task } from "@/types/task";
import { useTaskManager } from "@/hooks/useTaskManager";

interface WeekCardProps {
  weekKey: string;
  weekNumber: number;
  isCurrentWeek: boolean;
  tasksForWeek: Task[];
  showCompletedForWeek: boolean;
  toggleCompletedForWeek: (weekKey: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  editTask: (taskId: string, newTitle: string, is_recurring: boolean, week?: number) => void;
  deleteTask: (taskId: string) => void;
  goalId: string;
}

export const WeekCard = ({
  weekKey,
  weekNumber,
  isCurrentWeek,
  tasksForWeek,
  showCompletedForWeek,
  toggleCompletedForWeek,
  toggleTaskCompletion,
  editTask,
  deleteTask,
  goalId,
}: WeekCardProps) => {
  const hasCompletedTasks = tasksForWeek.some((task) => task.completed);
  const filteredTasks = showCompletedForWeek 
    ? tasksForWeek 
    : tasksForWeek.filter((task) => !task.completed);

  return (
    <Card className={`bg-card border ${isCurrentWeek ? 'ring-1 ring-primary/20' : ''}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Week {weekNumber}</h4>
              {isCurrentWeek && (
                <Badge variant="secondary" className="text-xs">
                  Current Week
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {hasCompletedTasks && (
              <div className="flex items-center space-x-2">
                <Switch
                  id={`show-completed-${weekKey}`}
                  checked={showCompletedForWeek}
                  onCheckedChange={() => toggleCompletedForWeek(weekKey)}
                  className="h-4 w-7"
                />
                <Label 
                  htmlFor={`show-completed-${weekKey}`} 
                  className="text-xs text-muted-foreground"
                >
                  Show completed tasks
                </Label>
              </div>
            )}
            
            <div className="space-y-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskItem
                    key={`${task.id}-${weekKey}`}
                    {...task}
                    onToggleComplete={toggleTaskCompletion}
                    onEditTask={editTask}
                    onDeleteTask={deleteTask}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No tasks for this week
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};