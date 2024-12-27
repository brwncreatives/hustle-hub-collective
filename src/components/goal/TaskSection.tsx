import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskList } from "../TaskList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "../TaskForm";
import { useState } from "react";

interface TaskSectionProps {
  goalId: string;
}

export const TaskSection = ({ goalId }: TaskSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [isRecurring, setIsRecurring] = useState(false);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setNewTask("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <TaskList goalId={goalId} />
      <div className="flex justify-end">
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