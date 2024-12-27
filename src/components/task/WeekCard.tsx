import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { TaskItem } from "../TaskItem";
import { Task } from "@/types/task";

interface WeekCardProps {
  weekKey: string;
  weekNumber: number;
  isCurrentWeek: boolean;
  quarter: string;
  tasksForWeek: Task[];
  showCompletedForWeek: boolean;
  toggleCompletedForWeek: (weekKey: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  editTask: (taskId: string, newTitle: string, isRecurring: boolean, week?: number) => void;
  deleteTask: (taskId: string) => void;
}

export const WeekCard = ({
  weekKey,
  weekNumber,
  isCurrentWeek,
  quarter,
  tasksForWeek,
  showCompletedForWeek,
  toggleCompletedForWeek,
  toggleTaskCompletion,
  editTask,
  deleteTask,
}: WeekCardProps) => {
  const hasCompletedTasks = tasksForWeek.some((task) => task.completed);
  const filteredTasks = showCompletedForWeek 
    ? tasksForWeek 
    : tasksForWeek.filter((task) => !task.completed);

  return (
    <Card 
      className={`bg-background/50 ${isCurrentWeek ? 'ring-2 ring-primary' : ''}`}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">
              Week {weekNumber}
              <span className="text-muted-foreground ml-1">
                ({quarter})
              </span>
            </h4>
            {isCurrentWeek && (
              <Badge variant="secondary" className="text-xs">
                Current Week
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            {hasCompletedTasks && (
              <div className="flex items-center space-x-2">
                <Switch
                  id={`show-completed-${weekKey}`}
                  checked={showCompletedForWeek}
                  onCheckedChange={() => toggleCompletedForWeek(weekKey)}
                />
                <Label htmlFor={`show-completed-${weekKey}`} className="text-xs">
                  Show completed
                </Label>
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={`${task.id}-${weekKey}`}
              {...task}
              onToggleComplete={toggleTaskCompletion}
              onEditTask={editTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};