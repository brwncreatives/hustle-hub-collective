import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskList } from "../TaskList";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "../TaskForm";
import { useState, useEffect } from "react";
import { useTaskManager } from "@/hooks/useTaskManager";
import { TaskBingoCard } from "./TaskBingoCard";

interface TaskSectionProps {
  goalId: string;
}

export const TaskSection = ({ goalId }: TaskSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [isRecurring, setIsRecurring] = useState(false);
  const [useBingoView, setUseBingoView] = useState(() => {
    const stored = localStorage.getItem(`taskView-${goalId}`);
    return stored ? stored === 'bingo' : false;
  });
  
  const { addTask } = useTaskManager(goalId);

  useEffect(() => {
    localStorage.setItem(`taskView-${goalId}`, useBingoView ? 'bingo' : 'list');
  }, [useBingoView, goalId]);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    addTask(newTask, isRecurring, selectedWeek);
    setNewTask("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Tasks</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              newTask={newTask}
              setNewTask={setNewTask}
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
              isRecurring={isRecurring}
              setIsRecurring={setIsRecurring}
              onAddTask={handleAddTask}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 bg-card p-4 rounded-lg shadow-sm">
        <Switch
          id={`view-toggle-${goalId}`}
          checked={useBingoView}
          onCheckedChange={setUseBingoView}
        />
        <Label htmlFor={`view-toggle-${goalId}`}>
          {useBingoView ? "Using Bingo Card View" : "Using Weekly Task List"}
        </Label>
      </div>

      {useBingoView ? (
        <TaskBingoCard goalId={goalId} />
      ) : (
        <TaskList goalId={goalId} />
      )}
    </div>
  );
};