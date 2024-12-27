import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { GoalFormValues, goalCategories } from "./types";
import { cn } from "@/lib/utils";

interface GoalCategoriesFieldProps {
  form: UseFormReturn<GoalFormValues>;
}

export const GoalCategoriesField = ({ form }: GoalCategoriesFieldProps) => {
  const selectedCategories = form.watch("categories") || [];

  const toggleCategory = (category: string) => {
    const current = form.getValues("categories") || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    form.setValue("categories", updated);
  };

  return (
    <FormField
      control={form.control}
      name="categories"
      render={() => (
        <FormItem>
          <FormLabel>Categories</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2">
              {goalCategories.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className={cn(
                    "cursor-pointer hover:bg-primary/20",
                    selectedCategories.includes(category) &&
                      "bg-primary/20 border-primary"
                  )}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </FormControl>
          <FormDescription>Select one or more categories for your goal</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};