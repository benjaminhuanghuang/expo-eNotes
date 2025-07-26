import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTopic,
  getTopics,
  initializeDefaultTopics,
  saveAllTopics,
  saveTopic,
  type Topic,
} from "../services/topicService";

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
      const items = await getTopics();

      // If no items exist, initialize with defaults
      if (items.length === 0) {
        await initializeDefaultTopics();
        return await getTopics();
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
    mutationFn: (item: Topic) => saveTopic(item),
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
    mutationFn: (id: string) => deleteTopic(id),
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
    mutationFn: (items: Topic[]) => saveAllTopics(items),
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
