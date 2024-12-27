import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

// This would typically come from your backend
const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "Sarah Chen nudged you about your React Course goal!",
    timestamp: "2 minutes ago",
    isRead: false,
  },
  {
    id: "2",
    message: "Mike Johnson nudged you about your TypeScript goal!",
    timestamp: "1 hour ago",
    isRead: true,
  },
];

export const NotificationsPopover = () => {
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <h4 className="font-medium">Notifications</h4>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="divide-y">
            {mockNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                message={notification.message}
                timestamp={notification.timestamp}
                isRead={notification.isRead}
              />
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};