import { BingoCell } from "./BingoCell";
import { BingoGridProps } from "./types/bingo";

export const BingoGrid = ({ grid, getGoalColor, getGoalIcon }: BingoGridProps) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {grid.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <BingoCell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            getGoalColor={getGoalColor}
            getGoalIcon={getGoalIcon}
          />
        ))
      ))}
    </div>
  );
};