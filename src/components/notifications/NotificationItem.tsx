import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  onRead: (id: string) => void;
}

export const NotificationItem = ({
  id,
  message,
  timestamp,
  isRead = false,
  onRead,
}: NotificationItemProps) => {
  return (
    <div
      onClick={() => !isRead && onRead(id)}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
        !isRead && "bg-[#F0EAFE] hover:bg-[#E9E3FD]",
        isRead && "hover:bg-muted"
      )}
    >
      <Bell className={cn(
        "h-5 w-5 mt-0.5",
        !isRead ? "text-[#8B5CF6]" : "text-muted-foreground"
      )} />
      <div className="space-y-1">
        <p className={cn(
          "text-sm",
          !isRead && "font-medium text-[#8B5CF6]"
        )}>{message}</p>
        <p className="text-xs text-muted-foreground">{timestamp}</p>
      </div>
    </div>
  );
};