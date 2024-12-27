import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTaskManager } from "@/hooks/useTaskManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "../TaskForm";

interface TaskSectionProps {
  goalId: string;
}

export const TaskSection = ({ goalId }: TaskSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [isRecurring, setIsRecurring] = useState(false);
  
  const { addTask } = useTaskManager(goalId);

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
    </div>
  );
};