import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CreateGroupCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <Button
        onClick={() => navigate("/create-group")}
        className="w-full sm:w-auto"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Create New Group
      </Button>
    </div>
  );
};