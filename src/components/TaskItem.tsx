import { Checkbox } from "@/components/ui/checkbox";

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  isRecurring: boolean;
  week?: number;
  onToggleComplete: (taskId: string) => void;
}

export const TaskItem = ({
  id,
  title,
  completed,
  isRecurring,
  week,
  onToggleComplete,
}: TaskItemProps) => {
  return (
    <div className="flex items-center space-x-2 bg-white/5 p-2 rounded-md">
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggleComplete(id)}
        id={id}
      />
      <label
        htmlFor={id}
        className={`flex-1 ${
          completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {title}
      </label>
      <div className="flex items-center gap-2">
        {isRecurring ? (
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
            Weekly
          </span>
        ) : (
          <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
            Week {week}
          </span>
        )}
      </div>
    </div>
  );
};