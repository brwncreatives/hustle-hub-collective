import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthForms } from "@/components/AuthForms";
import { Shield, Users } from "lucide-react";

const GroupLanding = () => {
  const [accessCode, setAccessCode] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to join this group",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implement actual code verification logic with Supabase
      // For now, we'll simulate a check
      if (accessCode.length < 6) {
        toast({
          title: "Invalid Code",
          description: "Please check your access code and try again",
          variant: "destructive",
        });
        return;
      }

      // If verification is successful, navigate to the full group page
      // TODO: Replace with actual group ID from verification
      navigate(`/groups/${accessCode}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to verify access code. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <CardTitle>Join Private Group</CardTitle>
          </div>
          <CardDescription>
            Enter your access code to join this group
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-5 w-5" />
                <p>Please sign in to access this group</p>
              </div>
              <AuthForms />
            </div>
          ) : (
            <form onSubmit={handleSubmitCode} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Join Group
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupLanding;