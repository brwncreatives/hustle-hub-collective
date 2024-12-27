import { Button } from "@/components/ui/button";
import { Pencil, Check } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  isRecurring: boolean;
  week?: number;
  onToggleComplete: (taskId: string) => void;
  onEditTask: (taskId: string, newTitle: string) => void;
}

export const TaskItem = ({
  id,
  title,
  completed,
  isRecurring,
  week,
  onToggleComplete,
  onEditTask,
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      onEditTask(id, editedTitle);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between space-x-2 bg-white/5 p-2 rounded-md">
      {isEditing ? (
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyPress}
          className="flex-1"
          autoFocus
        />
      ) : (
        <label
          htmlFor={id}
          className={`flex-1 ${
            completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {title}
        </label>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="h-8 px-3"
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant={completed ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onToggleComplete(id)}
          className="h-8 px-3"
        >
          <Check className="h-4 w-4 mr-1" />
          {completed ? "Done" : "Complete"}
        </Button>
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