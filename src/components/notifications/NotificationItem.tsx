import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  message: string;
  timestamp: string;
  isRead?: boolean;
}

export const NotificationItem = ({
  message,
  timestamp,
  isRead = false,
}: NotificationItemProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors",
        !isRead && "bg-primary/5 hover:bg-primary/10",
        isRead && "hover:bg-muted"
      )}
    >
      <Bell className="h-5 w-5 text-primary mt-0.5" />
      <div className="space-y-1">
        <p className="text-sm text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground">{timestamp}</p>
      </div>
    </div>
  );
};