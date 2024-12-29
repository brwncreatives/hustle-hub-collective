import { Users, Target, TrendingUp, Trophy } from "lucide-react";

const features = [
  {
    title: "Build Community",
    description: "Invite like-minded individuals to join your group for support and accountability.",
    icon: Users,
    color: "#ea384c", // Red Line
  },
  {
    title: "Stay Consistent",
    description: "Weekly check-ins keep you on track and motivated to keep going.",
    icon: Target,
    color: "#0EA5E9", // Blue Line
  },
  {
    title: "Track Progress",
    description: "Monitor your journey and see how far you've come with clear metrics.",
    icon: TrendingUp,
    color: "#22c55e", // Green Line
  },
  {
    title: "Celebrate Wins",
    description: "Share your progress and milestones with people who truly get it.",
    icon: Trophy,
    color: "#F97316", // Orange Line
  },
];

export function FeaturesSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Why Hustle Saturday?
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <div 
            className="bg-black p-8 rounded-lg space-y-6"
            style={{ 
              fontFamily: "Helvetica Neue, Arial, sans-serif",
            }}
          >
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="flex items-center gap-4 group"
              >
                {/* Line number circle */}
                <div 
                  className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: feature.color }}
                >
                  {index + 1}
                </div>
                
                {/* Feature text */}
                <div className="flex-grow">
                  <h3 className="text-3xl font-bold text-white tracking-wide mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}