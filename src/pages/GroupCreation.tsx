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
import { Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GroupInvite from "@/components/GroupInvite";
import { useState } from "react";

const groupFormSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  description: z.string().max(500, "Description must be less than 500 characters"),
  maxMembers: z.number().min(2, "Group must allow at least 2 members").max(50, "Group cannot have more than 50 members"),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

const GroupCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      maxMembers: 10,
    },
  });

  const onSubmit = async (data: GroupFormValues) => {
    try {
      // Here we would normally save the group to the database
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCreatedGroupId("sample-group-id"); // Replace with actual group ID from database
      
      toast({
        title: "Success",
        description: "Your accountability group has been created!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create group. Please try again.",
      });
    }
  };

  if (createdGroupId) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <GroupInvite groupId={createdGroupId} groupName={form.getValues("name")} />
        <div className="mt-4 flex justify-end">
          <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Create New Accountability Group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Enter your group name" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Choose a meaningful name for your accountability group
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
                        placeholder="Describe the purpose and goals of your group..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What is the focus of your accountability group?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Members</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          min="2" 
                          max="50" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Set a limit for the number of members (2-50)
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
                <Button type="submit">Create Group</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupCreation;