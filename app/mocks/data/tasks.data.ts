export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  priority: 'normal' | 'important';
  createdBy: number;
  createdAt: string;
}

export let tasks: Task[] = [
  {
    id: 1,
    title: 'Настроить MSW в проекте',
    description: 'Перевести логику с Nitro на локальный Mock Service Worker.',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    isCompleted: false,
    priority: 'important',
    createdBy: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Починить авторизацию',
    description: 'Исправить баг с зависанием на странице логина после перезагрузки.',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    isCompleted: false,
    priority: 'important',
    createdBy: 1,
    createdAt: new Date().toISOString()
  }
];

export const getNextTaskId = () => {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map(t => t.id)) + 1;
};
