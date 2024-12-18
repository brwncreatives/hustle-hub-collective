import { Card, CardContent } from "@/components/ui/card";

const motivationalQuotes = [
  "Dream bigger, work harder! ✨",
  "Every Saturday is a new opportunity! 💫",
  "Make your mark! 🌟",
];

export const MotivationalQuote = () => {
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <Card className="border-none bg-white/5 backdrop-blur-sm">
      <CardContent className="pt-6">
        <p className="text-center text-xl font-bold text-primary">
          {randomQuote}
        </p>
      </CardContent>
    </Card>
  );
};