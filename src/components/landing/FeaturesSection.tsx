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
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#221F26] sm:text-4xl mb-6">
            Why Hustle Saturday?
          </h2>
          <p className="text-lg leading-8 text-[#403E43]">
            We spend so much of our time working for others—our jobs, our families, our responsibilities—but what about our dreams? 
            Hustle Saturday is about reclaiming your time to pour into yourself and your goals. It's a day dedicated to side hustles, 
            personal growth, and turning aspirations into action—all with the support of your own online community.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl lg:mt-16 lg:max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="bg-[#221F26] p-8 rounded-lg relative overflow-hidden"
                style={{ 
                  fontFamily: "Helvetica Neue, Arial, sans-serif",
                }}
              >
                {/* Metro line accent */}
                <div 
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: feature.color }}
                />
                
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                    style={{ backgroundColor: feature.color }}
                  >
                    {index + 1}
                  </div>
                </div>
                
                <div className="h-px bg-white/20 mb-4" />
                
                <div>
                  <h3 className="text-3xl font-bold text-white tracking-wide mb-3">
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