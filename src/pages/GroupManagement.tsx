import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings } from "lucide-react";
import GroupInvite from "@/components/GroupInvite";
import { useAuth } from "@/contexts/AuthContext";

const GroupManagement = () => {
  const { user } = useAuth();
  const [groupName] = useState("My Group"); // This should be fetched from your database

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <CardTitle>{groupName}</CardTitle>
            </div>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Manage your group settings and members
          </p>
        </CardContent>
      </Card>

      <GroupInvite groupId="your-group-id" groupName={groupName} />
    </div>
  );
};

export default GroupManagement;