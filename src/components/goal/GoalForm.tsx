import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskList } from "@/components/TaskList";
import { TaskSection } from "@/components/goal/TaskSection";
import { GoalTitleField } from "@/components/goal/GoalTitleField";
import { GoalDescriptionField } from "@/components/goal/GoalDescriptionField";
import { GoalQuarterField } from "@/components/goal/GoalQuarterField";
import { GoalStatusField } from "@/components/goal/GoalStatusField";
import { GoalCategoriesField } from "@/components/goal/GoalCategoriesField";
import { goalFormSchema, GoalFormValues } from "@/components/goal/types";
import { Separator } from "@/components/ui/separator";
import { Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface GoalFormProps {
  initialData?: GoalFormValues & { id?: string };
  onSubmit: (data: GoalFormValues) => void;
  title: string;
}

export const GoalForm = ({ initialData, onSubmit, title }: GoalFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      quarter: getCurrentQuarter(),
      status: "Not Started",
      categories: [],
    },
  });

  const handleSubmit = (data: GoalFormValues) => {
    onSubmit(data);
    toast({
      title: "Success",
      description: `Goal ${initialData ? "updated" : "created"} successfully!`,
    });
    navigate("/");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-6 w-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <GoalTitleField form={form} />
            <GoalDescriptionField form={form} />
            <GoalCategoriesField form={form} />
            <GoalQuarterField form={form} />
            <GoalStatusField form={form} />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update" : "Create"} Goal
              </Button>
            </div>
          </form>
        </Form>

        <Separator className="my-6" />
        
        {initialData?.id && (
          <div className="space-y-4">
            <TaskSection goalId={initialData.id} />
            <TaskList goalId={initialData.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const getCurrentQuarter = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const quarterNumber = Math.floor(currentMonth / 3) + 1;
  return `Q${quarterNumber}-${currentYear}`;
};