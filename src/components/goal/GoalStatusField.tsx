import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { GoalFormValues } from "./types";

interface GoalStatusFieldProps {
  form: UseFormReturn<GoalFormValues>;
}

const statuses = ["Not Started", "In Progress", "Completed"];

export const GoalStatusField = ({ form }: GoalStatusFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          <FormDescription>
            Current status of your goal
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};