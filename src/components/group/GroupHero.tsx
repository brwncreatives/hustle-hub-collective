import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export const GroupHero = () => {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Users className="h-6 w-6" />
          Join an Accountability Group
        </CardTitle>
        <CardDescription>
          Connect with others who share your goals and help each other stay on track
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Join an existing group using an invite code or create your own group to get started
        </p>
      </CardContent>
    </Card>
  );
};