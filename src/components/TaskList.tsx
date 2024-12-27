import { useState } from "react";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { Task, TaskListProps } from "@/types/task";

export const TaskList = ({ goalId }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string>("1");

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask,
      completed: false,
      isRecurring,
      week: parseInt(selectedWeek),
    };

    setTasks([...tasks, task]);
    setNewTask("");
    console.log("Task added:", { goalId, task });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="space-y-4 mt-4">
      <TaskForm
        newTask={newTask}
        setNewTask={setNewTask}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        onAddTask={handleAddTask}
      />

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            {...task}
            onToggleComplete={toggleTaskCompletion}
          />
        ))}
      </div>
    </div>
  );
};