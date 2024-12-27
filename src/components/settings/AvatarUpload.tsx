import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

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
      console.log('Starting avatar upload process...');
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      console.log('File selected:', { name: file.name, type: file.type, size: file.size });

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      
      if (!fileExt || !allowedExtensions.includes(fileExt)) {
        throw new Error('File type not supported. Please upload an image (JPG, PNG, or GIF).');
      }

      if (!user) {
        console.error('No user found');
        throw new Error('No user found');
      }

      console.log('User ID:', user.id);
      const timestamp = new Date().getTime();
      const filePath = `${user.id}/${timestamp}.${fileExt}`;
      console.log('Generated file path:', filePath);

      const { error: uploadError, data } = await supabase.storage
        .from('avatar')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Error uploading file. Please try again.');
      }

      console.log('File uploaded successfully:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('avatar')
        .getPublicUrl(data.path);

      console.log('Generated public URL:', publicUrl);
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) {
        console.error('Update user error:', updateError);
        throw new Error('Error updating profile. Please try again.');
      }

      console.log('User profile updated with new avatar URL');
      onAvatarChange(publicUrl);

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
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt="Profile" />
        ) : (
          <AvatarFallback className="bg-muted">
            <UserCircle className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        )}
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
          {uploading ? "Uploading..." : avatarUrl ? "Change Avatar" : "Upload Avatar"}
        </Button>
      </div>
    </div>
  );
};

export default AvatarUpload;