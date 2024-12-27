import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { TaskItem } from "../TaskItem";
import { Task } from "@/types/task";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { TaskForm } from "../TaskForm";
import { useState } from "react";
import { useTaskManager } from "@/hooks/useTaskManager";

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
  goalId: string;
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
  goalId,
}: WeekCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(weekNumber.toString());
  const [isRecurring, setIsRecurring] = useState(false);
  
  const { addTask } = useTaskManager(goalId);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    addTask(newTask, isRecurring, selectedWeek);
    setNewTask("");
    setIsOpen(false);
  };

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
          <div className="flex flex-col gap-2">
            {isCurrentWeek && (
              <Badge variant="secondary" className="text-xs w-fit">
                Current Week
              </Badge>
            )}
            <h4 className="text-sm font-semibold">
              Week {weekNumber}
              <span className="text-muted-foreground ml-1">
                ({quarter})
              </span>
            </h4>
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
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
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