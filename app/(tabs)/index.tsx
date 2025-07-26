import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { usePromptItems } from "@/hooks/usePromptQueries";
import type { PromptItem } from "@/services/promptService";

const mockNews = [
  "OpenAI launches new GPT-4 model with improved reasoning",
  "Apple announces new AI features in iOS 18.2",
  "Google introduces advanced AI for Gmail and Docs",
  "Microsoft integrates AI into Windows 11 for better productivity",
  "Meta develops AI-powered virtual reality experiences",
  "Tesla advances autonomous driving with new AI algorithms",
  "Amazon deploys AI chatbots for customer service improvements",
  "Samsung introduces AI photography enhancements in Galaxy series",
  "Netflix uses AI to personalize content recommendations",
  "Adobe unveils AI-powered creative tools for designers",
];

export default function HomeScreen() {
  const router = useRouter();
  const [processingPrompt, setProcessingPrompt] = useState(false);

  // Use TanStack Query to fetch prompt items
  const {
    data: promptItems = [],
    isLoading: loadingPrompts,
    error: promptError,
    refetch: refetchPrompts,
  } = usePromptItems();

  const handlePromptPress = async (prompt: PromptItem) => {
    try {
      setProcessingPrompt(true);

      // Simulate AI processing with mock news
      const newsContext = mockNews.slice(0, 5).join("\n");
      const fullPrompt = `${prompt.prompt}\n\nNews Context:\n${newsContext}`;

      // In a real app, you would call your AI service here
      // For now, we'll just show a mock response
      setTimeout(() => {
        Alert.alert(
          "AI Response",
          `Processing "${prompt.label}" prompt with the latest news...\n\nThis would show the AI-generated response based on the selected prompt and current news.`,
          [{ text: "OK" }]
        );
        setProcessingPrompt(false);
      }, 2000);
    } catch (error) {
      console.error("Error processing prompt:", error);
      Alert.alert("Error", "Failed to process the prompt");
      setProcessingPrompt(false);
    }
  };

  const navigateToSettings = () => {
    router.push("/settings");
  };

  // Handle error state
  if (promptError) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            Failed to load prompts
          </ThemedText>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetchPrompts()}
          >
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // Handle loading state
  if (loadingPrompts) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Loading prompts...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            AI News Dashboard
          </ThemedText>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={navigateToSettings}
          >
            <IconSymbol name="gear" size={24} color="#007AFF" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.newsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Top 10 News Stories
          </ThemedText>
          {mockNews.map((news, index) => (
            <ThemedView key={index} style={styles.newsItem}>
              <ThemedText style={styles.newsIndex}>{index + 1}.</ThemedText>
              <ThemedText style={styles.newsText}>{news}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.promptSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            AI Prompts
          </ThemedText>
          <ThemedText style={styles.promptDescription}>
            Select a prompt to analyze the news with AI
          </ThemedText>

          {processingPrompt && (
            <ThemedView style={styles.processingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <ThemedText style={styles.processingText}>
                Processing...
              </ThemedText>
            </ThemedView>
          )}

          <ThemedView style={styles.promptGrid}>
            {promptItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.promptButton,
                  { backgroundColor: item.color || "#007AFF" },
                  processingPrompt && styles.promptButtonDisabled,
                ]}
                onPress={() => handlePromptPress(item)}
                disabled={processingPrompt}
              >
                <ThemedText style={styles.promptButtonText}>
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>

          {promptItems.length === 0 && !loadingPrompts && (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                No prompts available. Go to Settings to add some.
              </ThemedText>
              <TouchableOpacity
                style={styles.settingsLinkButton}
                onPress={navigateToSettings}
              >
                <ThemedText style={styles.settingsLinkText}>
                  Open Settings
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  settingsButton: {
    padding: 8,
  },
  newsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  newsItem: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsIndex: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginRight: 12,
    minWidth: 24,
  },
  newsText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    flex: 1,
  },
  promptSection: {
    marginBottom: 32,
  },
  promptDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  processingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  processingText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#007AFF",
  },
  promptGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  promptButton: {
    width: "48%",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  promptButtonDisabled: {
    opacity: 0.6,
  },
  promptButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  settingsLinkButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  settingsLinkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
