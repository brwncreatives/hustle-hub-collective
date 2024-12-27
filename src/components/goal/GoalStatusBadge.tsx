import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface GoalStatusBadgeProps {
  status: string;
  isEditing: boolean;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onStartEditing: () => void;
}

export const GoalStatusBadge = ({
  status,
  isEditing,
  selectedStatus,
  onStatusChange,
  onSave,
  onCancel,
  onStartEditing,
}: GoalStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'not started':
        return 'bg-gray-400 hover:bg-gray-500 text-white';
      case 'in progress':
        return 'bg-[#7E69AB] hover:bg-[#7E69AB]/80 text-white';
      case 'completed':
        return 'bg-[#9b87f5] hover:bg-[#9b87f5]/80 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Select
          value={selectedStatus}
          onValueChange={onStatusChange}
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
        <Button size="sm" onClick={onSave}>Save</Button>
        <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    );
  }

  return (
    <Badge
      variant="default"
      className={`mb-2 cursor-pointer ${getStatusColor(status)}`}
      onClick={onStartEditing}
    >
      {status}
    </Badge>
  );
};