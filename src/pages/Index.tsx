import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Users, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForms } from "@/components/AuthForms";

const Index = () => {
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();

  const motivationalQuotes = [
    "Every Saturday is a fresh start to achieve your goals!",
    "Small progress is still progress.",
    "Your future self will thank you for starting today.",
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const handleCreateGroup = () => {
    toast({
      title: "Coming Soon!",
      description: "Group creation will be available in the next update.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen flex items-center justify-center">
        <AuthForms />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-md md:max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.user_metadata.avatar_url || "https://github.com/shadcn.png"} />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">Welcome back!</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={() => signOut()}>
          <Trophy className="h-4 w-4" />
        </Button>
      </div>

      {/* Motivational Quote */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground italic">{randomQuote}</p>
        </CardContent>
      </Card>

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Active Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Learn React Native</p>
                <p className="text-sm text-muted-foreground">Complete 3 tutorials this week</p>
              </div>
              <Badge>In Progress</Badge>
            </div>
            <Progress value={33} className="h-2" />
          </div>
          <Button className="w-full" onClick={() => toast({ description: "Add goal feature coming soon!" })}>
            Add New Goal
          </Button>
        </CardContent>
      </Card>

      {/* Accountability Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Groups
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Create an accountability group to stay motivated!
          </p>
          <Button className="w-full" variant="outline" onClick={handleCreateGroup}>
            Create a Group
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;