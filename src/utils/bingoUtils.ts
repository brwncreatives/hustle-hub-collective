export const checkForBingo = (goals: any[], gridSize: number) => {
  let currentCompletedLines = 0;

  // Check horizontal lines
  for (let row = 0; row < gridSize; row++) {
    if (isLineComplete(goals, row * gridSize, (row + 1) * gridSize)) {
      currentCompletedLines++;
    }
  }

  // Check vertical lines
  for (let col = 0; col < gridSize; col++) {
    if (isLineComplete(goals, col, col + 6, 3)) {
      currentCompletedLines++;
    }
  }

  // Check diagonals
  if (isLineComplete(goals, 0, 8, 4)) currentCompletedLines++;
  if (isLineComplete(goals, 2, 6, 2)) currentCompletedLines++;

  return currentCompletedLines;
};

export const isLineComplete = (goals: any[], start: number, end: number, step = 1) => {
  const lineGoals = goals.slice(start, end);
  return lineGoals.every((goal) => goal?.status?.toLowerCase() === 'completed');
};

export const createBingoGrid = (goals: any[], totalCells: number, gridSize: number) => {
  const completedGoals = goals.filter(goal => goal.status.toLowerCase() === 'completed');
  const inProgressGoals = goals.filter(goal => goal.status.toLowerCase() === 'in progress');
  const notStartedGoals = goals.filter(goal => goal.status.toLowerCase() === 'not started');
  
  const allGoals = [...completedGoals, ...inProgressGoals, ...notStartedGoals];
  const paddedGoals = [...allGoals];
  
  while (paddedGoals.length < totalCells) {
    paddedGoals.push({ id: `empty-${paddedGoals.length}`, title: '', status: 'empty' });
  }

  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    grid.push(paddedGoals.slice(i * gridSize, (i + 1) * gridSize));
  }

  return grid;
};

export const getGoalIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'trophy';
    case 'in progress':
      return 'star';
    case 'not started':
      return 'target';
    default:
      return null;
  }
};

export const getGoalColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-[#9b87f5]/20 border-2 border-[#9b87f5] shadow-lg shadow-[#9b87f5]/30 scale-105 transform transition-all duration-200';
    case 'in progress':
      return 'bg-yellow-50 border border-yellow-200';
    case 'not started':
      return 'bg-gray-50 border border-gray-200';
    default:
      return 'bg-gray-50/50 border-dashed border-gray-200';
  }
};