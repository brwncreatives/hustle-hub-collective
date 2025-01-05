import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGroupData = (userId: string | undefined) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["groupMembers", userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data, error } = await supabase
          .from('group_members')
          .select(`
            group_id,
            role,
            groups (
              id,
              name
            )
          `)
          .eq('user_id', userId)
          .throwOnError();

        if (error) throw error;

        console.log("Group data fetched:", data);
        
        return (data || []).map((item) => ({
          group_id: item.group_id,
          role: item.role,
          groups: {
            id: item.groups?.id || '',
            name: item.groups?.name || ''
          }
        }));
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your groups. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!userId,
  });
};