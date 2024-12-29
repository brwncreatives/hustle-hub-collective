import { BingoCell as BingoCellType } from "./types/bingo";

interface BingoCellProps {
  cell: BingoCellType;
  getGoalColor: (status: string) => string;
  getGoalIcon: (status: string) => React.ReactNode;
}

export const BingoCell = ({ cell, getGoalColor, getGoalIcon }: BingoCellProps) => {
  return (
    <div
      className={`aspect-square p-2 border rounded-lg flex flex-col items-center justify-center text-center transition-all hover:scale-105 ${getGoalColor(cell.status)}`}
    >
      {cell.status !== 'empty' ? (
        <>
          {getGoalIcon(cell.status)}
          <span className="text-xs mt-1 line-clamp-2 font-medium">{cell.title}</span>
        </>
      ) : (
        <span className="text-xs text-gray-400">Empty</span>
      )}
    </div>
  );
};