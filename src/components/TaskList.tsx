import { useState, useEffect } from "react";
import { TaskItem } from "./TaskItem";
import { TaskListProps } from "@/types/task";
import { useTaskManager } from "@/hooks/useTaskManager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const TaskList = ({ goalId }: TaskListProps) => {
  const [selectedWeek, setSelectedWeek] = useState<string>("1");
  const [showCompleted, setShowCompleted] = useState(false);
  
  const {
    tasks,
    editTask,
    deleteTask,
    toggleTaskCompletion,
    getTasksForWeek,
  } = useTaskManager(goalId);

  useEffect(() => {
    console.log("TaskList - All tasks:", tasks);
    console.log("TaskList - goalId:", goalId);
  }, [tasks, goalId]);

  const getCurrentWeek = () => {
    return "1";
  };

  useEffect(() => {
    setSelectedWeek(getCurrentWeek());
  }, []);

  const weeks = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const currentWeekTasks = getTasksForWeek(parseInt(selectedWeek));
  const recurringTasks = tasks.filter(task => task.isRecurring);
  
  const filteredTasks = showCompleted 
    ? currentWeekTasks
    : currentWeekTasks.filter(task => !task.completed);

  console.log("TaskList - Current week tasks:", currentWeekTasks, "for week:", selectedWeek);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="week-select">Select Week</Label>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger id="week-select" className="w-[180px]">
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
          <div className="flex items-center space-x-2">
            <Switch
              id="show-completed"
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
            />
            <Label htmlFor="show-completed">Show completed tasks</Label>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {recurringTasks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Weekly Recurring Tasks</h3>
            <div className="space-y-2">
              {recurringTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  {...task}
                  onToggleComplete={toggleTaskCompletion}
                  onEditTask={editTask}
                  onDeleteTask={deleteTask}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Week {selectedWeek} Tasks</h3>
          {filteredTasks.filter(task => !task.isRecurring).length > 0 ? (
            <div className="space-y-2">
              {filteredTasks
                .filter(task => !task.isRecurring)
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    {...task}
                    onToggleComplete={toggleTaskCompletion}
                    onEditTask={editTask}
                    onDeleteTask={deleteTask}
                  />
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              No tasks for this week
            </p>
          )}
        </div>
      </div>
    </div>
  );
};