import { Card, CardContent } from "@/components/ui/card";

const motivationalQuotes = [
  "Hustle hard, dream bigger! 🗽",
  "Every Saturday is your chance to level up! 💪",
  "Make your mark on these streets! 🌟",
];

export const MotivationalQuote = () => {
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <Card className="border-none bg-[#F97316]/5 backdrop-blur-sm">
      <CardContent className="pt-6">
        <p className="text-center text-xl font-bold bg-gradient-to-r from-[#F97316] to-[#D946EF] text-transparent bg-clip-text">
          {randomQuote}
        </p>
      </CardContent>
    </Card>
  );
};