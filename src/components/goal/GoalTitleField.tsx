import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Goal } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { GoalFormValues } from "./types";

interface GoalTitleFieldProps {
  form: UseFormReturn<GoalFormValues>;
}

export const GoalTitleField = ({ form }: GoalTitleFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Goal Title</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Goal className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Enter your goal title" {...field} />
            </div>
          </FormControl>
          <FormDescription>What do you want to achieve?</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};