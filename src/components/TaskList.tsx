import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { TaskListProps } from "@/types/task";
import { useTaskManager } from "@/hooks/useTaskManager";

export const TaskList = ({ goalId }: TaskListProps) => {
  const [newTask, setNewTask] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string>("1");
  const [showForm, setShowForm] = useState(false);
  
  const {
    addTask,
    editTask,
    toggleTaskCompletion,
    getTasksForWeek,
  } = useTaskManager(goalId);

  const getCurrentWeek = () => {
    return "1";
  };

  useEffect(() => {
    setSelectedWeek(getCurrentWeek());
  }, []);

  const handleAddTask = () => {
    addTask(newTask, isRecurring, selectedWeek);
    setNewTask("");
  };

  const currentWeekTasks = getTasksForWeek(parseInt(selectedWeek));

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowForm(!showForm)}
        className="w-full"
      >
        {showForm ? "Hide Task Form" : "Add New Task"}
      </Button>

      {showForm && (
        <TaskForm
          newTask={newTask}
          setNewTask={setNewTask}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          isRecurring={isRecurring}
          setIsRecurring={setIsRecurring}
          onAddTask={handleAddTask}
        />
      )}

      <div className="space-y-2">
        {currentWeekTasks.map((task) => (
          <TaskItem
            key={task.id}
            {...task}
            onToggleComplete={toggleTaskCompletion}
            onEditTask={editTask}
          />
        ))}
        {currentWeekTasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No tasks for this week
          </p>
        )}
      </div>
    </div>
  );
};