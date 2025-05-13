export interface Todo {
  id: string;
  text: string;
  category?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export type Category = {
  id: string;
  name: string;
  color: string;
}; 