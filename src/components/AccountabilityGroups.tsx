import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Group {
  id: string;
  name: string;
  role: 'admin' | 'member';
}

export const AccountabilityGroups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockGroups = [
      { id: '1', name: 'Tech Achievers', role: 'admin' as const },
      { id: '2', name: 'Fitness Goals', role: 'member' as const },
      { id: '3', name: 'Book Club Goals', role: 'member' as const },
    ];
    setGroups(mockGroups);
  }, []);
  
  return (
    <Card className="border-none bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Users className="h-5 w-5" />
          Your Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {groups.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Create an accountability group to stay motivated!
          </p>
        ) : (
          <div className="space-y-2">
            {groups.map((group) => (
              <Button
                key={group.id}
                className="w-full justify-between"
                variant="outline"
                onClick={() => navigate(`/manage-group/${group.id}`)}
              >
                <span>{group.name}</span>
                <span className="text-xs text-muted-foreground">
                  {group.role === 'admin' ? 'Admin' : 'Member'}
                </span>
              </Button>
            ))}
          </div>
        )}
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