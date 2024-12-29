import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    title: "Reclaim Your Time",
    description: "Choose your goals for the quarter and make Saturdays your time to hustle for YOU.",
  },
  {
    title: "Create Your Community",
    description: "Start an online group with friends, colleagues, or others who inspire you.",
  },
  {
    title: "Set Quarterly Goals Using the 12-Week Year Method",
    description: "Each person sets 2-3 quarterly goals, breaks them down into weekly tasks, and dedicates time every week to crush those tasks. The community will be alerted as tasks are completed, creating momentum and shared accountability.",
  },
  {
    title: "Play Group Goal Bingo",
    description: "Every member's quarterly goals are added to a group bingo card. As goals are achieved, they're marked off the card. Hit a bingo and celebrate wins as a group!",
  },
  {
    title: "Celebrate & Repeat",
    description: "Build momentum, track progress, and create a habit of showing up for yourself and your dreams.",
  },
];

export function HowItWorksSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            How It Works
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl lg:max-w-4xl">
          <div className="grid gap-8">
            {steps.map((step, index) => (
              <Card key={step.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {index + 1}
                    </span>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}