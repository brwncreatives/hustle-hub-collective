export interface Member {
  id: string;
  name: string;
  avatar?: string;
  goal: {
    title: string;
    progress: number;
    target: number;
  };
  weeklyRecap?: {
    content: string;
    timestamp: string;
    weekNumber: number;
    reactions?: {
      heart: string[]; // userId[]
    };
  };
}

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