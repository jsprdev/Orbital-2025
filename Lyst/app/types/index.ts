export interface Todo {
  id: string;
  text: string;
  category?: string | null;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  userId: string;
}



export type Category = {
  id: string;
  name: string;
  color: string;
}; 