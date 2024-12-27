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
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const GoalCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const onSubmit = (data: GoalFormValues) => {
    const newGoal = {
      id: crypto.randomUUID(),
      ...data,
    };

    // Save to localStorage
    const existingGoals = JSON.parse(localStorage.getItem('goals') || '[]');
    localStorage.setItem('goals', JSON.stringify([...existingGoals, newGoal]));
    
    console.log("Goal created:", newGoal);
    toast({
      title: "Goal Created",
      description: "Your goal has been successfully created!",
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
              Create New Goal
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
                  <Button type="submit">Create Goal</Button>
                </div>
              </form>
            </Form>

            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Weekly Tasks</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You can add and manage tasks at any time, even after creating your goal. Tasks can be either one-time or recurring weekly.
                </p>
              </div>
              <TaskList goalId="new-goal" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const getCurrentQuarter = () => {
  const currentMonth = new Date().getMonth();
  return `Q${Math.floor(currentMonth / 3) + 1}-2025`;
};

export default GoalCreation;