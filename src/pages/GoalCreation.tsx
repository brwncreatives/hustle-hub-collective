import { GoalForm } from "@/components/goal/GoalForm";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const GoalCreation = () => {
  const { user, signOut } = useAuth();
  const [showCompleted, setShowCompleted] = useState(false);

  const handleSubmit = (data: GoalFormValues) => {
    const newGoal = {
      id: crypto.randomUUID(),
      ...data,
    };

    const existingGoals = JSON.parse(localStorage.getItem('goals') || '[]');
    localStorage.setItem('goals', JSON.stringify([...existingGoals, newGoal]));
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
          showCompleted={showCompleted}
        />
      </div>
    </div>
  );
};

export default GoalCreation;