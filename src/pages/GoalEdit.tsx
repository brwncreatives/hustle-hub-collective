import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GoalForm, GoalFormValues } from "@/components/goal/GoalForm";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { WeeklyRecapSection } from "@/components/goal/WeeklyRecapSection";

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

  const handleSubmit = (values: GoalFormValues) => {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const updatedGoals = goals.map((g: any) =>
      g.id === goalId ? { ...g, ...values } : g
    );
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setGoal({ ...values, id: goalId! });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Header user={user} signOut={signOut} />
        {goal && (
          <>
            <GoalForm
              defaultValues={goal}
              onSubmit={handleSubmit}
              title="Manage Goal"
            />
            <WeeklyRecapSection goalId={goal.id} showPastRecaps={true} />
          </>
        )}
      </div>
    </div>
  );
};

export default GoalEdit;