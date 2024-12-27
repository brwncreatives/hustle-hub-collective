import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Group {
  id: string;
  name: string;
  role: 'member';
}

export const AccountabilityGroups = () => {
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockGroup = { id: '1', name: 'Tech Achievers', role: 'member' as const };
    setGroup(mockGroup);
  }, []);
  
  return (
    <Card className="border-none bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Users className="h-5 w-5" />
          Your Group
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!group ? (
          <div className="text-center space-y-4 py-6">
            <p className="text-muted-foreground">
              Join an accountability group to stay motivated and track progress together.
            </p>
            <Button
              className="w-full sm:w-auto"
              onClick={() => navigate('/join-group')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Join a Group
            </Button>
          </div>
        ) : (
          <Button
            className="w-full justify-between"
            variant="outline"
            onClick={() => navigate(`/manage-group/${group.id}`)}
          >
            <span>{group.name}</span>
            <span className="text-xs text-muted-foreground">Member</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};