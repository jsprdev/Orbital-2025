export type Priority = "low" | "medium" | "high";

export interface Note {
  id?: string;
  userId: string;
  createdAt: string;
  description: string;
  place?: string;
  tags: string[];
  priority: Priority;
}
