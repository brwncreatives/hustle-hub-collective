import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const GoalEdit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { goalId } = useParams();
  const { user, signOut } = useAuth();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      quarter: getCurrentQuarter(),
      status: "Not Started",
    },
  });

  useEffect(() => {
    if (goalId) {
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      const goal = goals.find((g: any) => g.id === goalId);
      if (goal) {
        form.reset({
          title: goal.title,
          description: goal.description || "",
          quarter: goal.quarter || getCurrentQuarter(),
          status: goal.status,
        });
      } else {
        navigate('/');
      }
    }
  }, [goalId, form, navigate]);

  const onSubmit = (data: GoalFormValues) => {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const updatedGoals = goals.map((goal: any) =>
      goal.id === goalId ? { ...goal, ...data } : goal
    );
    
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    
    console.log("Goal updated:", data);
    toast({
      title: "Goal Updated",
      description: "Your goal has been successfully updated!",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted text-foreground">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
        <Header user={user} signOut={signOut} />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              Edit Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <GoalTitleField form={form} />
                <GoalDescriptionField form={form} />
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
                  <Button type="submit">Update Goal</Button>
                </div>
              </form>
            </Form>

            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Weekly Tasks</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You can add and manage tasks at any time. Tasks can be either one-time or recurring weekly.
                </p>
              </div>
              <TaskList goalId={goalId || ""} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const getCurrentQuarter = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const quarterNumber = Math.floor(currentMonth / 3) + 1;
  return `Q${quarterNumber}-${currentYear}`;
};

export default GoalEdit;