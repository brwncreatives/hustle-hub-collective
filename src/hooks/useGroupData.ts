import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GroupData } from "@/types/activity";

export const useGroupData = (userId: string | undefined) => {
  const [groupName, setGroupName] = useState<string>("");

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!userId) return;

      try {
        const { data: groupData, error: groupError } = await supabase
          .from('group_members')
          .select(`
            groups (
              name
            )
          `)
          .eq('user_id', userId)
          .single();

        if (groupError) throw groupError;

        if (groupData?.groups) {
          setGroupName(groupData.groups.name || "");
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();
  }, [userId]);

  return { groupName };
};