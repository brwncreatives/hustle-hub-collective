import { Users } from "lucide-react";

export const EmptyFeed = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-center">
      <Users className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium">No activities yet</p>
      <p className="text-sm text-muted-foreground">
        Activities will appear here as members interact with the group
      </p>
    </div>
  );
};