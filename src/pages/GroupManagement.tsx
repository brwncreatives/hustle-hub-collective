import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings, User } from "lucide-react";
import GroupInvite from "@/components/GroupInvite";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const GroupManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groupName, setGroupName] = useState("My Group"); // This should be fetched from your database
  const [isEditing, setIsEditing] = useState(false);

  // Temporary mock data - this should be fetched from your database
  const members = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Member" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "Member" },
  ];

  const handleSaveGroupName = () => {
    // Here you would typically save to the database
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Group name updated successfully",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="max-w-[200px]"
                  />
                  <Button size="sm" onClick={handleSaveGroupName}>Save</Button>
                </div>
              ) : (
                <CardTitle className="flex items-center gap-2">
                  {groupName}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </CardTitle>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-lg font-semibold">Members</Label>
            <div className="mt-4 space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <GroupInvite groupId="your-group-id" groupName={groupName} />
    </div>
  );
};

export default GroupManagement;