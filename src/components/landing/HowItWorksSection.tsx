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
          <div className="absolute left-8 top-0 bottom-0 w-1" style={{ backgroundColor: '#403E43' }} />
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.title} className="relative pl-24">
                {/* Station stop circle with number - positioned to align with card header */}
                <div 
                  className="absolute left-0 top-6 w-16 h-16 rounded-full border-4 border-background flex items-center justify-center text-white font-bold text-3xl"
                  style={{ backgroundColor: step.color }}
                >
                  {index + 1}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{step.title}</CardTitle>
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