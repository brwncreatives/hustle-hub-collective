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
        // First, get the user's group memberships
        const { data: memberships, error: membershipError } = await supabase
          .from('group_members')
          .select('group_id, role')
          .eq('user_id', userId);

        if (membershipError) throw membershipError;

        if (!memberships?.length) return [];

        // Then, get the group details for those memberships
        const groupIds = memberships.map(m => m.group_id);
        const { data: groups, error: groupsError } = await supabase
          .from('groups')
          .select('id, name')
          .in('id', groupIds);

        if (groupsError) throw groupsError;

        // Combine the data to match the GroupData interface
        const groupData: GroupData[] = memberships.map(membership => {
          const group = groups?.find(g => g.id === membership.group_id);
          return {
            group_id: membership.group_id,
            role: membership.role,
            groups: {
              id: group?.id || membership.group_id,
              name: group?.name || 'Unknown Group'
            }
          };
        });

        return groupData;
      } catch (error: any) {
        console.error("Error fetching groups:", error);
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