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