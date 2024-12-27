import { GoalForm } from "@/components/goal/GoalForm";
import { GoalFormValues } from "@/components/goal/types";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const GoalCreation = () => {
  const { user, signOut } = useAuth();

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
        <GoalForm
          onSubmit={handleSubmit}
          title="Create New Goal"
        />
      </div>
    </div>
  );
};

export default GoalCreation;