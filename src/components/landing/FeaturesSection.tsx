import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Target, Trophy } from "lucide-react";

const features = [
  {
    title: "Invest in Yourself",
    description: "Make time to focus on your goals, your passions, and your vision.",
    icon: Clock,
  },
  {
    title: "Build Community",
    description: "Invite like-minded individuals to join your group for support and accountability.",
    icon: Users,
  },
  {
    title: "Stay Consistent",
    description: "Weekly check-ins keep you on track and motivated to keep going.",
    icon: Target,
  },
  {
    title: "Celebrate Your Wins",
    description: "Share your progress and milestones with people who truly get it.",
    icon: Trophy,
  },
];

export function FeaturesSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Why Hustle Saturday?
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="mt-4 text-primary">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}