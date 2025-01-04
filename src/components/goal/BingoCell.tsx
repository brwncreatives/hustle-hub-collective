import { BingoCell as BingoCellType } from "./types/bingo";
import { Task } from "@/types/task";

interface BingoCellProps {
  cell?: BingoCellType;
  getGoalColor?: (status: string) => string;
  getGoalIcon?: (status: string) => React.ReactNode;
  tasks?: Task[];
  onTaskClick?: (taskId: string) => void;
}

export const BingoCell = ({ cell, getGoalColor, getGoalIcon, tasks, onTaskClick }: BingoCellProps) => {
  if (tasks && onTaskClick) {
    return (
      <div className="aspect-square p-2 border rounded-lg flex flex-col items-center justify-center text-center">
        {tasks.length > 0 ? (
          <>
            <div className="text-xs font-medium">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task.id)}
                  className="cursor-pointer hover:text-primary"
                >
                  {task.title}
                </div>
              ))}
            </div>
          </>
        ) : (
          <span className="text-xs text-gray-400">No tasks</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`aspect-square p-2 border rounded-lg flex flex-col items-center justify-center text-center transition-all hover:scale-105 ${getGoalColor?.(cell?.status || '')}`}
    >
      {cell?.status !== 'empty' ? (
        <>
          {getGoalIcon?.(cell?.status || '')}
          <span className="text-xs mt-1 line-clamp-2 font-medium">{cell?.title}</span>
        </>
      ) : (
        <span className="text-xs text-gray-400">Empty</span>
      )}
    </div>
  );
};