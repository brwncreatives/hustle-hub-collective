export interface Member {
  id: string;
  name: string;
  avatar?: string;
  goal: {
    title: string;
    progress: number;
    target: number;
  };
}