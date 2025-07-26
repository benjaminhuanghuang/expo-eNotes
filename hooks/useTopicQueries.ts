import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTopic,
  getTopics,
  saveAllTopics,
  saveTopic,
  type Topic,
} from "../services/topicService";

// Query keys
export const topicQueryKeys = {
  all: ["topics"] as const,
  lists: () => [...topicQueryKeys.all, "list"] as const,
  list: (filters: string) => [...topicQueryKeys.lists(), { filters }] as const,
  details: () => [...topicQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...topicQueryKeys.details(), id] as const,
};

// Hook to get all topic items
export const useTopicItems = () => {
  return useQuery({
    queryKey: topicQueryKeys.lists(),
    queryFn: async () => {
      const items = await getTopics();
      return items;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};

// Hook to save a topic item
export const useSaveTopicItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: Topic) => saveTopic(item),
    onSuccess: () => {
      // Invalidate and refetch topic items
      queryClient.invalidateQueries({ queryKey: topicQueryKeys.lists() });
    },
    onError: (error) => {
      console.error("Error saving topic item:", error);
    },
  });
};

// Hook to delete a topic item
export const useDeleteTopicItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTopic(id),
    onSuccess: () => {
      // Invalidate and refetch prompt items
      queryClient.invalidateQueries({ queryKey: topicQueryKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deleting prompt item:", error);
    },
  });
};

// Hook to save all topic items (for reordering)
export const useSaveAllTopicItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: Topic[]) => saveAllTopics(items),
    onSuccess: () => {
      // Invalidate and refetch topic items
      queryClient.invalidateQueries({ queryKey: topicQueryKeys.lists() });
    },
    onError: (error) => {
      console.error("Error saving all topic items:", error);
    },
  });
};

// Hook to manually refetch topic items
export const useRefreshTopicItems = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: topicQueryKeys.lists() });
  };
};
