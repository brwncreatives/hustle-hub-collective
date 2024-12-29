import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Reclaim Your Time",
    description: "Choose your goals for the quarter and make Saturdays your time to hustle for YOU.",
    color: "#ea384c", // Red Line
  },
  {
    title: "Create Your Community",
    description: "Start an online group with friends, colleagues, or others who inspire you.",
    color: "#0EA5E9", // Blue Line
  },
  {
    title: "Set Quarterly Goals Using the 12-Week Year Method",
    description: "Each person sets 2-3 quarterly goals, breaks them down into weekly tasks, and dedicates time every week to crush those tasks. The community will be alerted as tasks are completed, creating momentum and shared accountability.",
    color: "#22c55e", // Green Line
  },
  {
    title: "Play Group Goal Bingo",
    description: "Every member's quarterly goals are added to a group bingo card. As goals are achieved, they're marked off the card. Hit a bingo and celebrate wins as a group!",
    color: "#F97316", // Orange Line
  },
  {
    title: "Celebrate & Repeat",
    description: "Build momentum, track progress, and create a habit of showing up for yourself and your dreams.",
    color: "#9b87f5", // Purple Line
  },
];

export function HowItWorksSection() {
  return (
    <div className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            How It Works
          </h2>
        </div>
        <div className="mx-auto max-w-2xl lg:max-w-4xl relative">
          {/* Vertical line connecting all stops */}
          <div className="absolute left-4 top-8 bottom-8 w-1 bg-gradient-to-b from-[#ea384c] via-[#22c55e] to-[#9b87f5]" />
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.title} className={cn(
                "relative pl-14",
                index % 2 === 0 ? "lg:ml-0" : "lg:ml-8"
              )}>
                {/* Station stop circle */}
                <div 
                  className="absolute left-0 w-8 h-8 rounded-full border-4 border-background"
                  style={{ backgroundColor: step.color }}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                      <span 
                        className="flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground"
                        style={{ backgroundColor: step.color }}
                      >
                        {index + 1}
                      </span>
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}