import { GoalForm } from "@/components/goal/GoalForm";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { GoalFormValues } from "@/components/goal/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const GoalCreation = () => {
  const { user, signOut } = useAuth();
  const [showCompleted, setShowCompleted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: GoalFormValues) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          title: data.title,
          description: data.description,
          quarter: data.quarter,
          status: data.status,
          categories: data.categories,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal created successfully!",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error('Error creating goal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create goal. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted text-foreground">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
        <Header user={user} signOut={signOut} />
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="show-completed"
            checked={showCompleted}
            onCheckedChange={setShowCompleted}
          />
          <Label htmlFor="show-completed">Show completed tasks</Label>
        </div>
        <GoalForm
          onSubmit={handleSubmit}
          title="Create New Goal"
        />
      </div>
    </div>
  );
};

export default GoalCreation;