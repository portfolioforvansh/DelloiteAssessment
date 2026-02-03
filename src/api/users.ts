import { apiClient } from "./client";

export const fetchUsers = async () => {
  // Reduce results and add a seed for consistent data
  const response = await apiClient(
    'https://randomuser.me/api/?results=1000&seed=assessment'
  );

  return Array.isArray(response.results) ? response.results : [];
};