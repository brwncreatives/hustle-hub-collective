import { Users } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationsPopover } from "../notifications/NotificationsPopover";

interface FeedHeaderProps {
  groupName: string;
}

export const FeedHeader = ({ groupName }: FeedHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        {groupName || "Group"} Activity Feed
      </CardTitle>
      <NotificationsPopover />
    </CardHeader>
  );
};