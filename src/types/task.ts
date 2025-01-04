export interface Task {
  id: string;
  title: string;
  completed: boolean;
  is_recurring: boolean; // Changed from isRecurring to match database column
  week?: number;
}

export interface TaskListProps {
  goalId: string;
  showCompleted?: boolean;
}