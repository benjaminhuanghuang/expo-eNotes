import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePromptItem,
  getPromptItems,
  initializeDefaultPromptItems,
  saveAllPromptItems,
  savePromptItem,
  type PromptItem,
} from "../services/promptService";

// Query keys
export const promptQueryKeys = {
  all: ["prompts"] as const,
  lists: () => [...promptQueryKeys.all, "list"] as const,
  list: (filters: string) => [...promptQueryKeys.lists(), { filters }] as const,
  details: () => [...promptQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...promptQueryKeys.details(), id] as const,
};

// Hook to get all prompt items
export const usePromptItems = () => {
  return useQuery({
    queryKey: promptQueryKeys.lists(),
    queryFn: async () => {
      const items = await getPromptItems();

      // If no items exist, initialize with defaults
      if (items.length === 0) {
        await initializeDefaultPromptItems();
        return await getPromptItems();
      }

      return items;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};

// Hook to save a prompt item
export const useSavePromptItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: PromptItem) => savePromptItem(item),
    onSuccess: () => {
      // Invalidate and refetch prompt items
      queryClient.invalidateQueries({ queryKey: promptQueryKeys.lists() });
    },
    onError: (error) => {
      console.error("Error saving prompt item:", error);
    },
  });
};

// Hook to delete a prompt item
export const useDeletePromptItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePromptItem(id),
    onSuccess: () => {
      // Invalidate and refetch prompt items
      queryClient.invalidateQueries({ queryKey: promptQueryKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deleting prompt item:", error);
    },
  });
};

// Hook to save all prompt items (for reordering)
export const useSaveAllPromptItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: PromptItem[]) => saveAllPromptItems(items),
    onSuccess: () => {
      // Invalidate and refetch prompt items
      queryClient.invalidateQueries({ queryKey: promptQueryKeys.lists() });
    },
    onError: (error) => {
      console.error("Error saving all prompt items:", error);
    },
  });
};

// Hook to manually refetch prompt items
export const useRefreshPromptItems = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: promptQueryKeys.lists() });
  };
};
