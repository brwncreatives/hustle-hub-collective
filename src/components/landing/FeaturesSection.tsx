import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Smile } from "lucide-react";

const features = [
  {
    title: "Community Support",
    description: "Connect with like-minded individuals who share your drive for success.",
    icon: Users,
  },
  {
    title: "Goal Tracking",
    description: "Track your progress with our intuitive bingo-style goal tracking system.",
    icon: Globe,
  },
  {
    title: "Stay Motivated",
    description: "Celebrate achievements and stay motivated with regular progress updates.",
    icon: Smile,
  },
];

export function FeaturesSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Everything you need to achieve your goals
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col">
                <CardHeader>
                  <feature.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
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