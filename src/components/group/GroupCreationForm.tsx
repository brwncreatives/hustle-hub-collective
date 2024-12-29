import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Users, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const groupFormSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  description: z.string().max(500, "Description must be less than 500 characters"),
  maxMembers: z.number().min(2, "Group must allow at least 2 members").max(50, "Group cannot have more than 50 members"),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

interface GroupCreationFormProps {
  userId: string;
  onSuccess: (groupId: string) => void;
}

export const GroupCreationForm = ({ userId, onSuccess }: GroupCreationFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
      const { data: group, error } = await supabase
        .from('groups')
        .insert([
          {
            name: data.name,
            description: data.description,
            max_members: data.maxMembers,
            owner_id: userId,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      onSuccess(group.id);
      
      toast({
        title: "Success",
        description: "Your accountability group has been created!",
      });
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create group. Please try again.",
      });
    }
  };

  return (
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
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit">Create Group</Button>
        </div>
      </form>
    </Form>
  );
};