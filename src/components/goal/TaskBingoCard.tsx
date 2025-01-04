import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";
import { BingoCell } from "./BingoCell";

interface TaskBingoCardProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

export const TaskBingoCard = ({ tasks, onTaskClick }: TaskBingoCardProps) => {
  const getTasksForCell = (cellIndex: number) => {
    return tasks.filter((task) => {
      if (task.is_recurring) {
        // For recurring tasks, show in all weeks
        return true;
      } else {
        // For non-recurring tasks, show only in their specific week
        const taskWeek = task.week || 1;
        return taskWeek === cellIndex + 1;
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }, (_, i) => (
            <BingoCell
              key={i}
              tasks={getTasksForCell(i)}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};