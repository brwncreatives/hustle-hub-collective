export interface GroupBoardGoal {
  id: string;
  title: string;
  status: string;
  user_id: string;
  user: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export interface CompletedLine {
  indices: number[];
}