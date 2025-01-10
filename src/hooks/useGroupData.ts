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

      const { data: groupMembers, error } = await supabase
        .from('group_members')
        .select(`
          group_id,
          role,
          groups!inner (
            id,
            name
          )
        `)
        .eq('user_id', userId)
        .throwOnError();

      if (error) {
        console.error("Error fetching groups:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your groups. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      // Ensure the data matches the GroupData interface
      return (groupMembers || []).map((member): GroupData => ({
        group_id: member.group_id,
        role: member.role,
        groups: {
          id: member.groups.id,
          name: member.groups.name
        }
      }));
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};