import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AvatarUpload from "@/components/settings/AvatarUpload";
import ProfileForm from "@/components/settings/ProfileForm";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || "");
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || "");

  const getInitials = () => {
    return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || user?.email?.[0].toUpperCase() || "?";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted text-foreground">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <AvatarUpload
              user={user}
              avatarUrl={avatarUrl}
              onAvatarChange={setAvatarUrl}
              getInitials={getInitials}
            />
            <ProfileForm
              firstName={firstName}
              lastName={lastName}
              avatarUrl={avatarUrl}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;