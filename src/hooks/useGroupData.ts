import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GroupResponse {
  groups: {
    name: string;
  } | null;
}

export const useGroupData = (userId: string | undefined) => {
  const [groupName, setGroupName] = useState<string>("");

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!userId) {
        setGroupName("");
        return;
      }

      try {
        const { data: groupData, error } = await supabase
          .from('group_members')
          .select(`
            groups (
              name
            )
          `)
          .eq('user_id', userId)
          .maybeSingle<GroupResponse>();

        if (error) {
          console.error('Error fetching group data:', error);
          throw error;
        }

        setGroupName(groupData?.groups?.name || "");
      } catch (error) {
        console.error('Error fetching group data:', error);
        setGroupName("");
      }
    };

    fetchGroupData();
  }, [userId]);

  return { groupName };
};