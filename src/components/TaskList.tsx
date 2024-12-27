import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  isRecurring: boolean;
  week?: number;
}

interface TaskListProps {
  goalId: string;
}

export const TaskList = ({ goalId }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string>("1");

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask,
      completed: false,
      isRecurring,
      week: parseInt(selectedWeek),
    };

    setTasks([...tasks, task]);
    setNewTask("");
    console.log("Task added:", { goalId, task });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const weeks = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1"
          />
          <Select
            value={selectedWeek}
            onValueChange={setSelectedWeek}
          >
            <SelectTrigger className="w-[120px]">
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
          <Button
            size="sm"
            onClick={handleAddTask}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
        <RadioGroup
          defaultValue="one-time"
          onValueChange={(value) => setIsRecurring(value === "recurring")}
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
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center space-x-2 bg-white/5 p-2 rounded-md"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTaskCompletion(task.id)}
              id={task.id}
            />
            <label
              htmlFor={task.id}
              className={`flex-1 ${
                task.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </label>
            <div className="flex items-center gap-2">
              {task.isRecurring ? (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  Weekly
                </span>
              ) : (
                <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                  Week {task.week}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};