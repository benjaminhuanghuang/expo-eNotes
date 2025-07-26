import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
}

interface PromptItem {
  id: string;
  label: string;
  prompt: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [geminiResponse, setGeminiResponse] = useState<string>("");
  const [processingPrompt, setProcessingPrompt] = useState(false);

  // Mock prompt items - in a real app, this would be stored in AsyncStorage or a state management solution
  const [promptItems] = useState<PromptItem[]>([
    {
      id: "1",
      label: "News",
      prompt: "Please summarize the following news in one clear sentence",
    },
    {
      id: "2",
      label: "Tech",
      prompt:
        "Please explain this news story in simple terms for better understanding",
    },
    {
      id: "3",
      label: "Finance",
      prompt: "Please analyze the key implications and impact of this news",
    },
  ]);

  useEffect(() => {
    // Mock news data - in a real app, this would fetch from a news API
    const mockNews: NewsItem[] = [
      {
        id: "1",
        title: "AI Technology Breakthrough in Medical Diagnosis",
        summary:
          "Scientists develop new AI system that can detect diseases 95% more accurately than traditional methods.",
        url: "https://example.com/news1",
        publishedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        title: "Climate Change Summit Reaches Historic Agreement",
        summary:
          "World leaders agree on ambitious new targets to reduce carbon emissions by 50% within the next decade.",
        url: "https://example.com/news2",
        publishedAt: "2024-01-15T09:30:00Z",
      },
      {
        id: "3",
        title: "Space Mission Discovers Water on Mars",
        summary:
          "NASA's latest rover mission confirms the presence of liquid water beneath Mars' surface, raising hopes for life.",
        url: "https://example.com/news3",
        publishedAt: "2024-01-15T08:45:00Z",
      },
      {
        id: "4",
        title: "Electric Vehicle Adoption Surges Globally",
        summary:
          "Electric car sales increase by 300% year-over-year as charging infrastructure expands worldwide.",
        url: "https://example.com/news4",
        publishedAt: "2024-01-15T08:00:00Z",
      },
      {
        id: "5",
        title: "Quantum Computing Milestone Achieved",
        summary:
          "Tech giant announces breakthrough in quantum computing that could revolutionize data processing speeds.",
        url: "https://example.com/news5",
        publishedAt: "2024-01-15T07:30:00Z",
      },
      {
        id: "6",
        title: "Renewable Energy Costs Hit Record Low",
        summary:
          "Solar and wind energy costs drop to historic lows, making clean energy more accessible than ever.",
        url: "https://example.com/news6",
        publishedAt: "2024-01-15T07:00:00Z",
      },
      {
        id: "7",
        title: "Gene Therapy Shows Promise for Rare Diseases",
        summary:
          "Clinical trials demonstrate 80% success rate in treating previously incurable genetic conditions.",
        url: "https://example.com/news7",
        publishedAt: "2024-01-15T06:30:00Z",
      },
      {
        id: "8",
        title: "Ocean Cleanup Project Removes 100 Tons of Plastic",
        summary:
          "Revolutionary cleanup system successfully removes massive amounts of plastic waste from Pacific Ocean.",
        url: "https://example.com/news8",
        publishedAt: "2024-01-15T06:00:00Z",
      },
      {
        id: "9",
        title: "Breakthrough in Alzheimer's Research",
        summary:
          "New drug shows significant improvement in memory and cognitive function for early-stage patients.",
        url: "https://example.com/news9",
        publishedAt: "2024-01-15T05:30:00Z",
      },
      {
        id: "10",
        title: "Urban Farming Revolution Takes Off",
        summary:
          "Vertical farms in cities produce 30x more food per square meter while using 95% less water.",
        url: "https://example.com/news10",
        publishedAt: "2024-01-15T05:00:00Z",
      },
    ];

    // Simulate loading news
    const timer = setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePromptClick = async (promptItem: PromptItem) => {
    setProcessingPrompt(true);
    setGeminiResponse("");

    try {
      // Mock Gemini API response - in a real app, this would call the actual Gemini API
      // const newsContext = news.slice(0, 3).map(item => `${item.title}: ${item.summary}`).join('\n\n');
      // In a real implementation, this would be sent to Gemini API: `${promptItem.prompt}\n\nNews Context:\n${newsContext}`

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response based on the prompt type
      let response = "";
      switch (promptItem.label.toLowerCase()) {
        case "summarize":
          response =
            "Today's top stories focus on technological breakthroughs in AI and medical diagnosis, historic climate agreements, and space exploration discoveries on Mars.";
          break;
        case "explain":
          response =
            "The main news today covers scientific advances that could improve healthcare, environmental policies to combat climate change, and space discoveries that might help us understand life beyond Earth.";
          break;
        case "analyze":
          response =
            "These developments suggest a strong focus on sustainability and technology innovation. The convergence of AI, clean energy, and medical breakthroughs indicates significant societal shifts toward more efficient and healthier living.";
          break;
        case "key points":
          response =
            "• AI achieves 95% accuracy in medical diagnosis\n• Global climate agreement targets 50% emission reduction\n• Liquid water discovered on Mars\n• Electric vehicle sales surge 300%\n• Quantum computing breakthrough announced";
          break;
        default:
          response =
            "Based on today's news, there are significant developments in technology, climate action, and scientific discovery that could shape our future.";
      }

      setGeminiResponse(response);
    } catch {
      Alert.alert("Error", "Failed to get response from AI. Please try again.");
    } finally {
      setProcessingPrompt(false);
    }
  };

  const navigateToSettings = () => {
    router.push("/settings");
  };

  return (
    <SafeAreaView>
      {/* Prompt Buttons */}
      <ThemedView style={styles.promptSection}>
        <ThemedView style={styles.promptGrid}>
          {promptItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.promptButton,
                processingPrompt && styles.promptButtonDisabled,
              ]}
              onPress={() => handlePromptClick(item)}
              disabled={processingPrompt}
            >
              <ThemedText style={styles.promptButtonText}>
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={navigateToSettings}
            style={styles.settingsButton}
          >
            <IconSymbol size={24} name="gear" color="#007AFF" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      {/* Top 10 News Today */}
      <ThemedView style={styles.newsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Top 10 News Today
        </ThemedText>

        {loading ? (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <ThemedText style={styles.loadingText}>
              Loading latest news...
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.newsList}>
            {news.map((item, index) => (
              <ThemedView key={item.id} style={styles.newsItem}>
                <ThemedView style={styles.newsHeader}>
                  <ThemedText style={styles.newsNumber}>
                    #{index + 1}
                  </ThemedText>
                  <ThemedText style={styles.newsTime}>
                    {new Date(item.publishedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </ThemedText>
                </ThemedView>
                <ThemedText type="defaultSemiBold" style={styles.newsTitle}>
                  {item.title}
                </ThemedText>
                <ThemedText style={styles.newsDescription}>
                  {item.summary}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    alignSelf: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  promptSection: {
    marginBottom: 32,
  },
  promptGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  promptButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 2,
    minWidth: 80,
    alignItems: "center",
  },
  promptButtonDisabled: {
    backgroundColor: "#ccc",
  },
  promptButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  responseContainer: {
    backgroundColor: "rgba(0, 122, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  responseTitle: {
    marginBottom: 8,
    fontSize: 16,
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 8,
  },
  newsSection: {
    marginBottom: 32,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  newsList: {
    gap: 16,
  },
  newsItem: {
    backgroundColor: "rgba(128, 128, 128, 0.05)",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  newsNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#007AFF",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newsTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  newsTitle: {
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 22,
  },
  newsDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
});
