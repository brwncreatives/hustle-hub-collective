import { useState, useEffect } from "react";
import { TaskListProps } from "@/types/task";
import { useTaskManager } from "@/hooks/useTaskManager";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { WeekCard } from "./task/WeekCard";
import { getCurrentWeekInQuarter } from "@/utils/dateUtils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const TaskList = ({ goalId }: TaskListProps) => {
  const {
    tasks,
    editTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTaskManager(goalId);

  const [isOpen, setIsOpen] = useState(true);
  const [completedTasksVisibility, setCompletedTasksVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log("TaskList - All tasks:", tasks);
    console.log("TaskList - goalId:", goalId);
  }, [tasks, goalId]);

  // Group tasks by week
  const groupedTasks = tasks.reduce((acc, task) => {
    if (Object.keys(acc).length === 0) {
      for (let i = 1; i <= 12; i++) {
        acc[`week${i}`] = [];
      }
    }

    if (task.isRecurring) {
      const weeksToShow = task.completed ? [task.week || 1] : Array.from({ length: 12 }, (_, i) => i + 1);
      weeksToShow.forEach(week => {
        const weekKey = `week${week}`;
        acc[weekKey].push({ ...task, week });
      });
    } else {
      const weekKey = `week${task.week}`;
      if (weekKey) {
        acc[weekKey].push(task);
      }
    }
    return acc;
  }, {} as Record<string, any>);

  const currentWeek = getCurrentWeekInQuarter(new Date());

  const weeksToShow = isOpen
    ? Object.keys(groupedTasks)
        .sort((a, b) => {
          // Always put current week first
          if (parseInt(a.replace('week', '')) === currentWeek) return -1;
          if (parseInt(b.replace('week', '')) === currentWeek) return 1;
          // Then sort the rest normally
          const weekA = parseInt(a.replace('week', ''));
          const weekB = parseInt(b.replace('week', ''));
          return weekA - weekB;
        })
    : Object.keys(groupedTasks).filter(weekKey => {
        const weekNumber = parseInt(weekKey.replace('week', ''));
        return weekNumber === currentWeek;
      });

  const toggleCompletedForWeek = (weekKey: string) => {
    setCompletedTasksVisibility(prev => ({
      ...prev,
      [weekKey]: !prev[weekKey]
    }));
  };

  if (tasks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No tasks yet
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between pb-2 border-b">
          <Label className="text-sm text-muted-foreground">
            {isOpen ? 'All weeks' : 'Current week'}
          </Label>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              {isOpen ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Collapse weeks
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expand all weeks
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="grid gap-4 pt-4">
            {weeksToShow.map((weekKey) => {
              const weekNumber = parseInt(weekKey.replace('week', ''));
              const isCurrentWeek = weekNumber === currentWeek;
              
              return (
                <WeekCard
                  key={weekKey}
                  weekKey={weekKey}
                  weekNumber={weekNumber}
                  isCurrentWeek={isCurrentWeek}
                  tasksForWeek={groupedTasks[weekKey]}
                  showCompletedForWeek={completedTasksVisibility[weekKey]}
                  toggleCompletedForWeek={toggleCompletedForWeek}
                  toggleTaskCompletion={toggleTaskCompletion}
                  editTask={editTask}
                  deleteTask={deleteTask}
                  goalId={goalId}
                />
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};