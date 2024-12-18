import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AccountabilityGroups = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-none bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Users className="h-5 w-5" />
          Your Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          Create an accountability group to stay motivated!
        </p>
        <Button 
          className="w-full border-2 border-primary bg-transparent hover:bg-primary text-primary hover:text-primary-foreground transition-all" 
          variant="outline" 
          onClick={() => navigate("/create-group")}
        >
          Create a Group
        </Button>
      </CardContent>
    </Card>
  );
};