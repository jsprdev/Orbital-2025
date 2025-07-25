import axiosInstance from "./index";

export interface ExpenseItemType {
  name: string;
  amount: string;
}

export interface SectionType {
  id?: string;
  title: string;
  items: ExpenseItemType[];
  createdAt?: string;
}

// Fetch all expense sections for the current user (token must be set in axiosInstance)
export const getExpenseSections = async (token: string): Promise<SectionType[]> => {
  const response = await axiosInstance.get("/api/expenses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.expenses;
};

// Create a new expense section
export const createExpenseSection = async (section: SectionType, token: string) => {
  const response = await axiosInstance.post("/api/expenses", section, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.expense;
};

// Update an existing expense section
export const updateExpenseSection = async (sectionId: string, section: SectionType, token: string) => {
  await axiosInstance.put(`/api/expenses/${sectionId}`, section, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Delete an expense section
export const deleteExpenseSection = async (sectionId: string, token: string) => {
  await axiosInstance.delete(`/api/expenses/${sectionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}; 