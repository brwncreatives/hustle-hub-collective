import { Profile } from "@/types/activity";

export const formatUserName = (profile: Profile | undefined) => {
  if (!profile) return 'Member';
  
  const firstName = profile.first_name?.trim();
  const lastName = profile.last_name?.trim();
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  return firstName || lastName || 'Member';
};