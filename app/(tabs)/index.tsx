import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { useTopicItems } from "@/hooks/useTopicQueries";
import { Colors } from "@/constants/Colors";
import type { Topic } from "@/services/topicService";

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
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  // Use TanStack Query to fetch topic items
  const {
    data: topicItems = [],
    isLoading: loadingTopics,
    error: topicError,
    refetch: refetchTopics,
  } = useTopicItems();

  const handlePromptPress = async (prompt: Topic) => {
    try {
      setProcessingPrompt(true);
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
  if (topicError) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            Failed to load topics. Please check your internet connection or try
            again later.
          </ThemedText>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.tint }]}
            onPress={() => refetchTopics()}
          >
            <ThemedText
              style={[
                styles.retryButtonText,
                { color: colorScheme === "dark" ? theme.background : "#fff" },
              ]}
            >
              Retry
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // Handle loading state
  if (loadingTopics) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.tint} />
          <ThemedText style={styles.loadingText}>Loading topics...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }
  /*
  UI layout
  actionBar
    buttons for each topic,  settingsButton
  contentSection
  */
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Action Bar, contains buttons for each topic and settingsButton */}
        <ThemedView style={styles.actionBar}>
          {topicItems.length > 0 ? (
            <ThemedView style={styles.topicButtonsGrid}>
              {topicItems.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={[
                    styles.topicButton,
                    { backgroundColor: theme.tint },
                    processingPrompt && styles.topicButtonDisabled,
                  ]}
                  onPress={() => handlePromptPress(topic)}
                  disabled={processingPrompt}
                >
                  <ThemedText
                    style={[
                      styles.topicButtonText,
                      {
                        color: colorScheme === "dark" ? theme.text : "#fff",
                      },
                    ]}
                  >
                    {topic.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          ) : (
            <ThemedText style={[styles.emptyStateText, { color: theme.icon }]}>
              No prompt templates available
            </ThemedText>
          )}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={navigateToSettings}
          >
            <IconSymbol name="gear" size={24} color={theme.icon} />
          </TouchableOpacity>
        </ThemedView>

        {/* Content Section */}
        <ThemedView style={styles.contentSection}>
          {mockNews.slice(0, 5).map((news, index) => (
            <ThemedView
              key={index}
              style={[
                styles.newsItem,
                {
                  backgroundColor: colorScheme === "dark" ? "#2c2c2e" : "#fff",
                  shadowColor: colorScheme === "dark" ? "#000" : "#000",
                  shadowOpacity: colorScheme === "dark" ? 0.3 : 0.1,
                },
              ]}
            >
              <ThemedText style={[styles.newsText, { color: theme.text }]}>
                {news}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  settingsButton: {
    padding: 8,
  },
  contentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  newsItem: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  newsIndex: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 12,
    minWidth: 24,
  },
  newsText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  promptSection: {
    marginBottom: 32,
  },
  promptDescription: {
    fontSize: 16,
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
  },
  actionBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topicButtonsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    flex: 1,
  },
  topicButton: {
    alignItems: "center",
    borderRadius: 4,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    padding: 4,
  },
  topicButtonDisabled: {
    opacity: 0.6,
  },
  topicButtonText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  settingsLinkButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  settingsLinkText: {
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
