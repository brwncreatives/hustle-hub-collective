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

      const { data, error } = await supabase
        .from('group_members')
        .select(`
          group_id,
          role,
          groups:group_id (
            id,
            name
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error("Error fetching groups:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your groups. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      // Transform the data to match the GroupData interface
      const transformedData = (data || []).map((item): GroupData => ({
        group_id: item.group_id,
        role: item.role,
        groups: item.groups[0] || { id: '', name: '' } // Access first element of the array
      }));

      return transformedData;
    },
    enabled: !!userId,
    retry: 1,
  });
};