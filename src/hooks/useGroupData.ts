import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GroupData {
  group_id: string;
  role: string;
  groups: {
    id: string;
    name: string;
  };
}

export const useGroupData = (userId: string | undefined) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["groupMembers", userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data: memberships, error } = await supabase
          .from('group_members')
          .select(`
            group_id,
            role,
            groups:groups(id, name)
          `)
          .eq('user_id', userId);

        if (error) {
          console.error("Error fetching group memberships:", error);
          throw error;
        }

        // Transform the data to match the GroupData interface
        const groupData: GroupData[] = memberships?.map(membership => ({
          group_id: membership.group_id,
          role: membership.role,
          groups: {
            id: membership.groups?.id || membership.group_id,
            name: membership.groups?.name || 'Unknown Group'
          }
        })) || [];

        return groupData;
      } catch (error: any) {
        console.error("Error in useGroupData:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your groups. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};