export type ActivityType = 
  | 'join_group'
  | 'add_goal'
  | 'complete_task'
  | 'complete_goal'
  | 'weekly_reflection';

export interface FeedActivity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: string;
  data: {
    goalTitle?: string;
    taskTitle?: string;
    reflection?: string;
    weekNumber?: number;
    isPublic?: boolean;
  };
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

export interface GroupData {
  groups: {
    name: string;
  };
}