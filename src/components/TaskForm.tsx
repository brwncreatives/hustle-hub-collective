import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFormProps {
  newTask: string;
  setNewTask: (task: string) => void;
  selectedWeek: string;
  setSelectedWeek: (week: string) => void;
  isRecurring: boolean;
  setIsRecurring: (isRecurring: boolean) => void;
  onAddTask: () => void;
}

export const TaskForm = ({
  newTask,
  setNewTask,
  selectedWeek,
  setSelectedWeek,
  isRecurring,
  setIsRecurring,
  onAddTask,
}: TaskFormProps) => {
  const weeks = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="task">Task Description</Label>
          <Input
            id="task"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
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

        {!isRecurring && (
          <div className="space-y-2">
            <Label htmlFor="week">Select Week</Label>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
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
      </div>

      <Button
        type="button"
        onClick={onAddTask}
        className="w-full"
      >
        Add Task
      </Button>
    </div>
  );
};