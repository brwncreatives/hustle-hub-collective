import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  onEditTask: (taskId: string, newTitle: string, isRecurring: boolean, week?: number) => void;
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
  const [editedIsRecurring, setEditedIsRecurring] = useState(isRecurring);
  const [editedWeek, setEditedWeek] = useState(week?.toString() || "1");
  
  const weeks = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      onEditTask(
        id, 
        editedTitle, 
        editedIsRecurring, 
        editedIsRecurring ? undefined : parseInt(editedWeek)
      );
      setIsOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-between space-x-2 bg-white/5 p-2 rounded-md">
      <div>
        <div className="text-xs text-muted-foreground">
          {isRecurring ? "Recurring Weekly" : `Week ${week}`}
        </div>
        <div className={`${completed ? "line-through text-muted-foreground" : ""}`}>
          {title}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={completed}
          onCheckedChange={() => onToggleComplete(id)}
          className={completed ? 'bg-[#9b87f5] border-[#9b87f5]' : ''}
        />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="task">Task Description</Label>
                <Input
                  id="task"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full"
                />
              </div>

              <RadioGroup
                value={editedIsRecurring ? "recurring" : "one-time"}
                onValueChange={(value) => setEditedIsRecurring(value === "recurring")}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time">One-time task</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <Label htmlFor="recurring">Weekly recurring</Label>
                </div>
              </RadioGroup>

              {!editedIsRecurring && (
                <div className="space-y-2">
                  <Label htmlFor="week">Select Week</Label>
                  <Select value={editedWeek} onValueChange={setEditedWeek}>
                    <SelectTrigger id="week" className="w-full">
                      <SelectValue placeholder="Select week" />
                    </SelectTrigger>
                    <SelectContent>
                      {weeks.map((week) => (
                        <SelectItem key={week} value={week}>
                          Week {week}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={handleSaveEdit} className="flex-1">
                  Save Changes
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDeleteTask(id);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};