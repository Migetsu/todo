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

export type TaskStatus = 'active' | 'completed';
export type TaskPriority = 'normal' | 'important';
