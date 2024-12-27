export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isRecurring: boolean;
  week?: number;
}

export interface TaskListProps {
  goalId: string;
}