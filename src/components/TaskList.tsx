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

  const [isOpen, setIsOpen] = useState(false);
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

    if (task.is_recurring) {
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
  const currentWeekKey = `week${currentWeek}`;

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

  // Sort weeks, but ensure current week is not included in the collapsible section
  const otherWeeks = Object.keys(groupedTasks)
    .filter(weekKey => weekKey !== currentWeekKey)
    .sort((a, b) => {
      const weekA = parseInt(a.replace('week', ''));
      const weekB = parseInt(b.replace('week', ''));
      return weekA - weekB;
    });

  return (
    <div className="space-y-6">
      {/* Current Week Card - Always visible */}
      <WeekCard
        key={currentWeekKey}
        weekKey={currentWeekKey}
        weekNumber={currentWeek}
        isCurrentWeek={true}
        tasksForWeek={groupedTasks[currentWeekKey]}
        showCompletedForWeek={completedTasksVisibility[currentWeekKey]}
        toggleCompletedForWeek={toggleCompletedForWeek}
        toggleTaskCompletion={toggleTaskCompletion}
        editTask={editTask}
        deleteTask={deleteTask}
        goalId={goalId}
      />

      {/* Other Weeks - Collapsible */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 w-full justify-between">
            <span>Other weeks</span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4 pt-4">
            {otherWeeks.map((weekKey) => {
              const weekNumber = parseInt(weekKey.replace('week', ''));
              return (
                <WeekCard
                  key={weekKey}
                  weekKey={weekKey}
                  weekNumber={weekNumber}
                  isCurrentWeek={false}
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
