import { z } from "zod";

export const goalCategories = [
  "Physical Health",
  "Financial",
  "Relationships",
  "Mental",
  "Spiritual",
  "Social",
  "Education",
  "Business"
] as const;

export const goalFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500, "Description must be less than 500 characters"),
  quarter: z.string().min(1, "Quarter is required"),
  status: z.string().min(1, "Status is required"),
  categories: z.array(z.enum(goalCategories)).min(1, "Select at least one category"),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;

export interface GoalFormProps {
  initialData?: GoalFormValues & { id?: string };
  onSubmit: (values: GoalFormValues) => void;
  title: string;
}