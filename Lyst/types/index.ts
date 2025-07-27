export type User = {
  id: string;
  email: string;
  name: string;
  partnerId?: string;
  profilePicture?: string;
};

export type Priority = "low" | "medium" | "high";

export interface Note {
  id: string;
  userId: string;
  createdAt: string;
  about: string;
  description: string;
  place?: string;
  place_id?: string;
  tags: string[];
  priority: "low" | "medium" | "high";
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

export type Gift = {
  id: string;
  userId: string;
  name: string;
  url: string;
  price: string;
  createdAt: string;
};

export type DatePlan = {
  id: string;
  userId: string;
  title: string;
  locations: Array<{
    name: string;
    address: string;
    place_id?: string;
    tags?: string[];
  }>;
  createdAt: string;
  completed?: boolean;
};
