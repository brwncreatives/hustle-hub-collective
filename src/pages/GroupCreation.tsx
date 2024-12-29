import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GroupCreationForm } from "@/components/group/GroupCreationForm";
import GroupInvite from "@/components/GroupInvite";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const GroupCreation = () => {
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/auth/login");
    return null;
  }

  if (createdGroupId) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <GroupInvite groupId={createdGroupId} groupName="" />
        <div className="mt-4 flex justify-end">
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Create New Accountability Group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GroupCreationForm 
            userId={user.id} 
            onSuccess={(groupId) => setCreatedGroupId(groupId)} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupCreation;