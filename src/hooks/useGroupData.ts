import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GroupMemberData {
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
        const { data: groupData, error: groupError } = await supabase
          .from('group_members')
          .select(`
            groups (
              name
            )
          `)
          .eq('user_id', userId)
          .maybeSingle() as { data: GroupMemberData | null, error: any };

        if (groupError) throw groupError;

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