// 

export type User = {
  id: string;
  email: string;
  name: string;
  partnerId?: string;
  profilePicture?: string;
};


// Types used for YourLyst component

export type Priority = "low" | "medium" | "high";

export interface Todo {
  id?: string;
  userId: string;
  createdAt: string;
  description: string;
  place?: string;
  tags: string[];
  priority: Priority;
}

export type Category = {
  id: string;
  name: string;
  color: string;
}; 

export type FilterState = {
  query: string;
  selectedTags: string[];
  priority: "low" | "medium" | "high" | null;
};
