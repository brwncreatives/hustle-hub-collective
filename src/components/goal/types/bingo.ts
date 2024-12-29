export interface Goal {
  id: string;
  title: string;
  status: string;
  quarter?: string;
}

export interface BingoCell {
  id: string;
  title: string;
  status: string;
}

export interface BingoGridProps {
  grid: BingoCell[][];
  getGoalColor: (status: string) => string;
  getGoalIcon: (status: string) => React.ReactNode;
}