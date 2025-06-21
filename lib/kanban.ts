export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
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
  return Math.random().toString(36).substr(2, 9);
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