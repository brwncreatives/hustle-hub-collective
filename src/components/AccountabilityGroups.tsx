import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AccountabilityGroups = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-none bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-[#F97316]">
          <Users className="h-5 w-5" />
          Your Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-[#F97316]/80">
          Create an accountability group to stay motivated!
        </p>
        <Button 
          className="w-full border-2 border-[#F97316] bg-transparent hover:bg-[#F97316] text-[#F97316] hover:text-white transition-all" 
          variant="outline" 
          onClick={() => navigate("/create-group")}
        >
          Create a Group
        </Button>
      </CardContent>
    </Card>
  );
};