import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InviteForm } from "@/components/group/InviteForm";

interface GroupInviteProps {
  groupId: string;
  groupName: string;
}

const GroupInvite = ({ groupId, groupName }: GroupInviteProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
        <CardDescription>
          Invite people to join {groupName} via email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Invitation</Label>
          <InviteForm groupId={groupId} />
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupInvite;