import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="py-8 sm:py-12 mb-8 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How It Works
          </h2>
        </div>
        <div className="mx-auto max-w-2xl lg:max-w-4xl relative">
          {/* Vertical metro line connecting all stops */}
          <div 
            className="absolute left-8 top-0 bottom-0 w-1" 
            style={{ backgroundColor: '#666666' }} 
          />
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.title} className="relative pl-24">
                {/* Station stop circle with number */}
                <div 
                  className="absolute left-0 top-6 w-16 h-16 rounded-full border-4 border-[#1a1a1a] flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                  style={{ backgroundColor: step.color }}
                >
                  {index + 1}
                </div>
                
                <Card className="bg-[#1a1a1a] relative overflow-hidden group hover:translate-x-2 transition-all duration-300">
                  {/* Metro line accent at the top */}
                  <div 
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ backgroundColor: step.color }}
                  />
                  
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-white tracking-wide">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-px bg-white/20 mb-4" />
                    <p className="text-lg text-white/80">
                      {step.description}
                    </p>
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