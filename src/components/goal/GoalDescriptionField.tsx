import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { GoalFormValues } from "./types";

interface GoalDescriptionFieldProps {
  form: UseFormReturn<GoalFormValues>;
}

export const GoalDescriptionField = ({ form }: GoalDescriptionFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Describe your goal in detail..."
              {...field}
            />
          </FormControl>
          <FormDescription>Add any additional details about your goal</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};