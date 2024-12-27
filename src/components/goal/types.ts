import { z } from "zod";

export const goalFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500, "Description must be less than 500 characters"),
  quarter: z.string().min(1, "Quarter is required"),
  status: z.string().min(1, "Status is required"),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;