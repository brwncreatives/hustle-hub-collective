import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1"
        />
        {!isRecurring && (
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
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
        )}
        <Button
          size="sm"
          onClick={onAddTask}
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
  );
};