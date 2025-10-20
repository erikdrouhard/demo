export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
  tags?: string[];
}

export type Column = {
  id: string;
  title: string;
  status: Task['status'];
};

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', status: 'todo' },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
  { id: 'done', title: 'Done', status: 'done' },
];

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }
}

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  
  const saved = localStorage.getItem('kanban-tasks');
  if (!saved) return [];
  
  try {
    const tasks = JSON.parse(saved);
    return tasks.map((task: Task) => ({
      ...task,
      priority: task.priority || 'medium', // Default priority for existing tasks
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }));
  } catch {
    return [];
  }
}

export function getPriorityColor(priority: Task['priority']): string {
  switch (priority) {
    case 'high':
      return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20';
    case 'medium':
      return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20';
    case 'low':
      return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20';
    default:
      return 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900';
  }
}

export function getPriorityBadgeColor(priority: Task['priority']): string {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  }
}

export function getTasksByStatus(tasks: Task[], status: Task['status']): Task[] {
  return tasks.filter(task => task.status === status);
}

export function getAllTasksFlattened(tasks: Task[]): Task[] {
  return [
    ...getTasksByStatus(tasks, 'todo'),
    ...getTasksByStatus(tasks, 'in-progress'),
    ...getTasksByStatus(tasks, 'done'),
  ];
}

export function getNextTaskId(tasks: Task[], currentId: string): string | null {
  const flatTasks = getAllTasksFlattened(tasks);
  const currentIndex = flatTasks.findIndex(task => task.id === currentId);
  
  if (currentIndex === -1 || currentIndex === flatTasks.length - 1) {
    return null;
  }
  
  return flatTasks[currentIndex + 1].id;
}

export function getPreviousTaskId(tasks: Task[], currentId: string): string | null {
  const flatTasks = getAllTasksFlattened(tasks);
  const currentIndex = flatTasks.findIndex(task => task.id === currentId);
  
  if (currentIndex === -1 || currentIndex === 0) {
    return null;
  }
  
  return flatTasks[currentIndex - 1].id;
}

export function getFirstTaskId(tasks: Task[]): string | null {
  const flatTasks = getAllTasksFlattened(tasks);
  return flatTasks.length > 0 ? flatTasks[0].id : null;
}

export function getLastTaskId(tasks: Task[]): string | null {
  const flatTasks = getAllTasksFlattened(tasks);
  return flatTasks.length > 0 ? flatTasks[flatTasks.length - 1].id : null;
}

export function moveTasksToStatus(tasks: Task[], taskIds: string[], newStatus: Task['status']): Task[] {
  return tasks.map(task => 
    taskIds.includes(task.id) 
      ? { ...task, status: newStatus }
      : task
  );
}

export function deleteTasksById(tasks: Task[], taskIds: string[]): Task[] {
  return tasks.filter(task => !taskIds.includes(task.id));
}

export function searchTasks(tasks: Task[], query: string): Task[] {
  if (!query.trim()) return tasks;
  
  const lowerQuery = query.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(lowerQuery) ||
    task.description?.toLowerCase().includes(lowerQuery) ||
    task.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < new Date();
}

export function isDueSoon(task: Task, daysAhead: number = 3): boolean {
  if (!task.dueDate) return false;
  const dueDate = new Date(task.dueDate);
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + daysAhead);
  return dueDate <= threeDaysFromNow && dueDate >= new Date();
}

export function getDueDateColor(task: Task): string {
  if (isOverdue(task)) {
    return 'text-red-600 dark:text-red-400';
  }
  if (isDueSoon(task, 3)) {
    return 'text-orange-600 dark:text-orange-400';
  }
  return 'text-slate-600 dark:text-slate-400';
}

export function getDueDateBadgeColor(task: Task): string {
  if (isOverdue(task)) {
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800';
  }
  if (isDueSoon(task, 3)) {
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 border-orange-200 dark:border-orange-800';
  }
  return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
}

export function formatDueDate(date: Date): string {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays === -1) {
    return 'Yesterday';
  } else if (diffDays > 1 && diffDays <= 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < -1 && diffDays >= -7) {
    return `${Math.abs(diffDays)} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}