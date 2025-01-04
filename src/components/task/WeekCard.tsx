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
  tasksForWeek: Task[];
  showCompletedForWeek: boolean;
  toggleCompletedForWeek: (weekKey: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  editTask: (taskId: string, newTitle: string, is_recurring: boolean, week?: number) => void;
  deleteTask: (taskId: string) => void;
  goalId: string;
}

export const WeekCard = ({
  weekKey,
  weekNumber,
  isCurrentWeek,
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
    <Card className={`bg-card border ${isCurrentWeek ? 'ring-1 ring-primary/20' : ''}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Week {weekNumber}</h4>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add a task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Task for Week {weekNumber}</DialogTitle>
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

          <div className="space-y-3">
            {hasCompletedTasks && (
              <div className="flex items-center space-x-2">
                <Switch
                  id={`show-completed-${weekKey}`}
                  checked={showCompletedForWeek}
                  onCheckedChange={() => toggleCompletedForWeek(weekKey)}
                  className="h-4 w-7"
                />
                <Label 
                  htmlFor={`show-completed-${weekKey}`} 
                  className="text-xs text-muted-foreground"
                >
                  Show completed tasks
                </Label>
              </div>
            )}
            
            <div className="space-y-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskItem
                    key={`${task.id}-${weekKey}`}
                    {...task}
                    onToggleComplete={toggleTaskCompletion}
                    onEditTask={editTask}
                    onDeleteTask={deleteTask}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No tasks for this week
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};