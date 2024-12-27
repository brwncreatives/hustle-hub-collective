import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoalForm } from "@/components/goal/GoalForm";
import { GoalFormValues } from "@/components/goal/types";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const GoalEdit = () => {
  const { goalId } = useParams();
  const [goal, setGoal] = useState<GoalFormValues & { id: string }>();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const foundGoal = goals.find((g: any) => g.id === goalId);
    if (foundGoal) {
      setGoal(foundGoal);
    }
  }, [goalId]);

  const handleSubmit = (data: GoalFormValues) => {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const updatedGoals = goals.map((g: any) =>
      g.id === goalId ? { ...g, ...data } : g
    );
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted text-foreground">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
        <Header user={user} signOut={signOut} />
        {goal && (
          <GoalForm
            initialData={goal}
            onSubmit={handleSubmit}
            title="Edit Goal"
          />
        )}
      </div>
    </div>
  );
};

export default GoalEdit;