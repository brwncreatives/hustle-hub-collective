import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const { toast } = useToast();
  const totalSteps = 4;

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      
      if (!fileExt || !allowedExtensions.includes(fileExt)) {
        throw new Error('File type not supported. Please upload an image (JPG, PNG, or GIF).');
      }

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('No user found');

      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatar')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatar')
        .getPublicUrl(data.path);

      setAvatarUrl(publicUrl);
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      toast({
        description: "Profile photo uploaded successfully!",
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        variant: "destructive",
        description: error.message || "Error uploading profile photo. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        description: "Welcome to Hustle Hub! Let's start achieving your goals.",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        variant: "destructive",
        description: "There was an error completing your onboarding. Please try again.",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <CardTitle>Welcome to Hustle Hub! 🎉</CardTitle>
            <CardDescription className="mt-4">
              We're excited to help you achieve your goals. Let's get started with a quick tour.
            </CardDescription>
          </>
        );
      case 2:
        return (
          <>
            <CardTitle>Add Your Profile Photo 📸</CardTitle>
            <CardDescription className="mt-4">
              Let's personalize your profile with a photo. This helps build trust and connection within the community.
            </CardDescription>
            <div className="flex flex-col items-center mt-6 space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Photo"}
                </Button>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <CardTitle>Set Your Goals 🎯</CardTitle>
            <CardDescription className="mt-4">
              Create weekly goals and break them down into manageable tasks. Track your progress and celebrate your wins!
            </CardDescription>
          </>
        );
      case 4:
        return (
          <>
            <CardTitle>Join the Community 🤝</CardTitle>
            <CardDescription className="mt-4">
              Connect with like-minded individuals, share your progress, and stay accountable to your goals.
            </CardDescription>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center justify-center space-x-2 mb-4">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index + 1 <= currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        {renderStep()}
      </CardHeader>
      <CardContent className="flex justify-between">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
        )}
        <div className="flex-1" />
        {currentStep < totalSteps ? (
          <Button onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}>
            Next
          </Button>
        ) : (
          <Button onClick={completeOnboarding}>Get Started</Button>
        )}
      </CardContent>
    </Card>
  );
}