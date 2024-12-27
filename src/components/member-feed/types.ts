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
    reactions?: {
      [key: string]: string[]; // userId[]
    };
  };
}