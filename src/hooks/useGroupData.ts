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
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching groups:", error);
          toast({
            title: "Error",
            description: "Failed to fetch your groups. Please try again.",
            variant: "destructive",
          });
          throw error;
        }

        if (!data) return [];

        // Transform the data to match the GroupData interface
        const transformedData: GroupData[] = [{
          group_id: data.group_id,
          role: data.role,
          groups: {
            id: data.groups?.id || '',
            name: data.groups?.name || ''
          }
        }];

        return transformedData;
      } catch (error) {
        console.error("Error in useGroupData:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching groups.",
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