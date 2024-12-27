import { Button } from "@/components/ui/button";
import { Pencil, Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  isRecurring: boolean;
  week?: number;
  onToggleComplete: (taskId: string) => void;
  onEditTask: (taskId: string, newTitle: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskItem = ({
  id,
  title,
  completed,
  isRecurring,
  week,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}: TaskItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      onEditTask(id, editedTitle);
      setIsOpen(false);
    }
  };

  const handleDelete = () => {
    onDeleteTask(id);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between space-x-2 bg-white/5 p-2 rounded-md">
      <div className="flex-1">
        <label
          htmlFor={id}
          className={`${completed ? "line-through text-muted-foreground" : ""}`}
        >
          {title}
        </label>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        {isRecurring ? (
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
            Weekly
          </span>
        ) : (
          <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
            Week {week}
          </span>
        )}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 bg-white/10 hover:bg-white/20"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full"
                />
              </div>
              <div className="flex justify-between gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </Button>
                <Button onClick={handleSaveEdit} className="w-full">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button
          variant={completed ? "default" : "outline"}
          size="sm"
          onClick={() => onToggleComplete(id)}
          className={`h-8 px-3 ${completed ? 'bg-[#9b87f5] hover:bg-[#9b87f5]/80' : 'bg-white/10 hover:bg-white/20'}`}
        >
          <Check className="h-4 w-4 mr-1" />
          {completed ? "Done" : "Complete"}
        </Button>
      </div>
    </div>
  );
};