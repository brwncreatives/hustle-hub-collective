export interface GroupGoal {
  id: string;
  memberId: string;
  memberName: string;
  title: string;
  progress: number;
  status: string;
}

export interface GoalWithProfile {
  id: string;
  title: string;
  status: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}