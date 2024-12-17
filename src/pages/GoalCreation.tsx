import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Goal, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const goalFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500, "Description must be less than 500 characters"),
  quarter: z.string().min(1, "Quarter is required"),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

const getCurrentQuarter = () => {
  const currentMonth = new Date().getMonth();
  return `Q${Math.floor(currentMonth / 3) + 1}-${new Date().getFullYear()}`;
};

const getQuarterDateRange = (quarter: string) => {
  const [q, year] = quarter.split("-");
  const quarterNum = parseInt(q.slice(1)) - 1;
  const startMonth = quarterNum * 3;
  const endMonth = startMonth + 2;
  
  const startDate = new Date(parseInt(year), startMonth, 1);
  const endDate = new Date(parseInt(year), endMonth + 1, 0);
  
  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
};

const GoalCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const quarters = [
    `Q1-${currentYear}`,
    `Q2-${currentYear}`,
    `Q3-${currentYear}`,
    `Q4-${currentYear}`,
  ];

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      quarter: getCurrentQuarter(),
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
                    <FormDescription>
                      What do you want to achieve?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormDescription>
                      Add any additional details about your goal
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quarter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quarter</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
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