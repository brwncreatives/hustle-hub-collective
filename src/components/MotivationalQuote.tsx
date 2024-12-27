import { Card, CardContent } from "@/components/ui/card";

const affirmations = [
  "I am capable of achieving my goals! 💫",
  "Every day I'm getting closer to my dreams! ✨",
  "I have the power to create positive change! 🌟",
  "I trust in my ability to succeed! 💪",
  "I am worthy of great achievements! ⭐",
  "My potential is limitless! 🚀",
];

export const MotivationalQuote = () => {
  const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <Card className="border-none bg-white/5 backdrop-blur-sm">
      <CardContent className="pt-6">
        <p className="text-center text-xl font-bold text-primary">
          {randomAffirmation}
        </p>
      </CardContent>
    </Card>
  );
};