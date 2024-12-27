import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskList } from "@/components/TaskList";
import { GoalTitleField } from "@/components/goal/GoalTitleField";
import { GoalDescriptionField } from "@/components/goal/GoalDescriptionField";
import { GoalQuarterField } from "@/components/goal/GoalQuarterField";
import { GoalStatusField } from "@/components/goal/GoalStatusField";
import { goalFormSchema, GoalFormValues } from "@/components/goal/types";

const getCurrentQuarter = () => {
  const currentMonth = new Date().getMonth();
  return `Q${Math.floor(currentMonth / 3) + 1}-2025`;
};

const GoalCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      quarter: getCurrentQuarter(),
      status: "Not Started",
    },
  });

  const onSubmit = (data: GoalFormValues) => {
    console.log("Goal created:", data);
    toast({
      title: "Goal Created",
      description: "Your goal has been successfully created!",
    });
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            Create New Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <GoalTitleField form={form} />
              <GoalDescriptionField form={form} />
              <GoalQuarterField form={form} />
              <GoalStatusField form={form} />

              <div className="space-y-4">
                <FormLabel>Weekly Tasks</FormLabel>
                <FormDescription>
                  Add tasks to help you achieve this goal. Tasks can be one-time or recurring weekly.
                </FormDescription>
                <TaskList goalId="new-goal" />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Goal</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalCreation;