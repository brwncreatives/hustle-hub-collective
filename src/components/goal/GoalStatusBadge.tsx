import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GoalStatusBadgeProps {
  status: string;
  goalId: string;
  onStatusChange: (goalId: string, status: string) => Promise<void>;
}

export const GoalStatusBadge = ({
  status,
  goalId,
  onStatusChange,
}: GoalStatusBadgeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'not started':
        return 'bg-gray-400 hover:bg-gray-500 text-white';
      case 'in progress':
        return 'bg-[#FEF7CD] hover:bg-[#FEF7CD]/80 text-yellow-800';
      case 'completed':
        return 'bg-[#9b87f5] hover:bg-[#9b87f5]/80 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const handleSave = async () => {
    await onStatusChange(goalId, selectedStatus);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Select
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={handleSave}>Save</Button>
        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
      </div>
    );
  }

  return (
    <Badge
      variant="default"
      className={`mb-2 cursor-pointer ${getStatusColor(status)}`}
      onClick={() => setIsEditing(true)}
    >
      {status}
    </Badge>
  );
};