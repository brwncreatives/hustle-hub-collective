import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { TaskListProps } from "@/types/task";
import { useTaskManager } from "@/hooks/useTaskManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export const TaskList = ({ goalId }: TaskListProps) => {
  const [newTask, setNewTask] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string>("1");
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    addTask,
    editTask,
    toggleTaskCompletion,
    getTasksForWeek,
  } = useTaskManager(goalId);

  const getCurrentWeek = () => {
    return "1";
  };

  useEffect(() => {
    setSelectedWeek(getCurrentWeek());
  }, []);

  const handleAddTask = () => {
    addTask(newTask, isRecurring, selectedWeek);
    setNewTask("");
    setIsOpen(false);
  };

  const currentWeekTasks = getTasksForWeek(parseInt(selectedWeek));

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Task
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

      <div className="space-y-2">
        {currentWeekTasks.map((task) => (
          <TaskItem
            key={task.id}
            {...task}
            onToggleComplete={toggleTaskCompletion}
            onEditTask={editTask}
          />
        ))}
        {currentWeekTasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No tasks for this week
          </p>
        )}
      </div>
    </div>
  );
};