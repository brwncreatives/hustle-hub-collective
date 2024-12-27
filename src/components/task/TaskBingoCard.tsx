import { Card } from "@/components/ui/card";
import { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TaskBingoCardProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
}

export const TaskBingoCard = ({ tasks, onToggleComplete }: TaskBingoCardProps) => {
  const [bingoLines, setBingoLines] = useState<number[][]>([]);

  // Create a 3x4 grid of tasks (or empty cells if not enough tasks)
  const createTaskGrid = () => {
    const grid: (Task | null)[][] = Array(3).fill(null).map(() => Array(4).fill(null));
    let taskIndex = 0;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (taskIndex < tasks.length) {
          grid[row][col] = tasks[taskIndex];
          taskIndex++;
        }
      }
    }

    return grid;
  };

  // Check for completed lines (horizontal, vertical, diagonal)
  const checkBingoLines = () => {
    const grid = createTaskGrid();
    const lines: number[][] = [];

    // Check horizontal lines
    grid.forEach((row, rowIndex) => {
      if (row.every(task => task?.completed)) {
        lines.push(row.map((_, colIndex) => rowIndex * 4 + colIndex));
      }
    });

    // Check vertical lines
    for (let col = 0; col < 4; col++) {
      if (grid.every(row => row[col]?.completed)) {
        lines.push(grid.map((_, rowIndex) => rowIndex * 4 + col));
      }
    }

    // Check diagonal (top-left to bottom-right)
    if (grid[0][0]?.completed && grid[1][1]?.completed && grid[2][2]?.completed) {
      lines.push([0, 5, 10]);
    }

    // Check diagonal (top-right to bottom-left)
    if (grid[0][3]?.completed && grid[1][2]?.completed && grid[2][1]?.completed) {
      lines.push([3, 6, 9]);
    }

    return lines;
  };

  useEffect(() => {
    const newBingoLines = checkBingoLines();
    const newLines = newBingoLines.filter(
      line => !bingoLines.some(existing => 
        existing.length === line.length && 
        existing.every(num => line.includes(num))
      )
    );

    if (newLines.length > 0) {
      setBingoLines(prev => [...prev, ...newLines]);
      toast("BINGO! You've completed a line of tasks! 🎉");
    }
  }, [tasks]);

  const taskGrid = createTaskGrid();

  return (
    <Card className="p-4">
      <div className="grid grid-cols-4 gap-2">
        {taskGrid.flat().map((task, index) => (
          <div
            key={index}
            className={`
              aspect-square p-2 border rounded-lg
              ${task?.completed ? 'bg-primary/10 border-primary' : 'bg-card'}
              ${bingoLines.some(line => line.includes(index)) ? 'ring-2 ring-primary ring-offset-2' : ''}
              flex flex-col items-center justify-center text-center
              transition-all duration-200
            `}
          >
            {task ? (
              <>
                <div className="text-sm mb-2 line-clamp-2">{task.title}</div>
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleComplete(task.id)}
                  className={task.completed ? 'bg-primary border-primary' : ''}
                />
              </>
            ) : (
              <div className="text-muted-foreground text-sm">Empty</div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};