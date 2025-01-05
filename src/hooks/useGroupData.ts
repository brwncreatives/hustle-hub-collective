import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GroupData {
  name: string | null;
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
          .maybeSingle();

        if (error) throw error;

        if (groupData?.groups) {
          setGroupName(groupData.groups.name || "");
        } else {
          setGroupName("");
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
        setGroupName("");
      }
    };

    fetchGroupData();
  }, [userId]);

  return { groupName };
};