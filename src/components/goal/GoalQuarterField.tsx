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
import { Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { GoalFormValues } from "./types";

interface GoalQuarterFieldProps {
  form: UseFormReturn<GoalFormValues>;
}

const quarters = ["Q1-2025", "Q2-2025", "Q3-2025", "Q4-2025"];

const getQuarterDateRange = (quarter: string) => {
  const [q, year] = quarter.split("-");
  const quarterNum = parseInt(q.slice(1)) - 1;
  const startMonth = quarterNum * 3;
  const endMonth = startMonth + 2;
  
  const startDate = new Date(parseInt(year), startMonth, 1);
  const endDate = new Date(parseInt(year), endMonth + 1, 0);
  
  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
};

export const GoalQuarterField = ({ form }: GoalQuarterFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="quarter"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Quarter</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a quarter" />
                </SelectTrigger>
                <SelectContent>
                  {quarters.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q} ({getQuarterDateRange(q)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          <FormDescription>
            Select which quarter this goal is for. It's recommended to have no more than 2-3 goals per quarter for better focus and achievement.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};