import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from '@supabase/supabase-js';
import { User } from "@supabase/supabase-js";

const supabase = createClient(
  'https://zpbqzuazbmgyifhwphga.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYnF6dWF6Ym1neWlmaHdwaGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMjI0MTgsImV4cCI6MjA0OTY5ODQxOH0.HVvzkkFpq4m_AecBfYHyyVYHoZgJRIi8uxMxvBOBLmA'
);

interface AvatarUploadProps {
  user: User | null;
  avatarUrl: string;
  onAvatarChange: (url: string) => void;
  getInitials: () => string;
}

const AvatarUpload = ({ user, avatarUrl, onAvatarChange, getInitials }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

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

      const filePath = `${user?.id}/${Math.random()}.${fileExt}`;

      // First check if we can access the storage bucket
      try {
        const { data: bucketExists } = await supabase
          .storage
          .getBucket('avatars');

        if (!bucketExists) {
          throw new Error('Storage bucket not configured. Please contact support.');
        }
      } catch (error: any) {
        console.error('Storage bucket check error:', error);
        throw new Error('Unable to access storage. Please try again later.');
      }

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      if (!data?.path) {
        throw new Error('Upload failed. Please try again.');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      onAvatarChange(publicUrl);
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) {
        throw updateError;
      }

      toast({
        description: "Avatar updated successfully!",
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        variant: "destructive",
        description: error.message || "Error updating avatar. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={avatarUrl} alt="Profile" />
        <AvatarFallback>{getInitials()}</AvatarFallback>
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
          {uploading ? "Uploading..." : "Change Avatar"}
        </Button>
      </div>
    </div>
  );
};

export default AvatarUpload;