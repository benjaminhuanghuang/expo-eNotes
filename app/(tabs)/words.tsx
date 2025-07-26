import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface Word {
  id: string;
  spelling: string;
  definition: string;
  exampleSentence: string;
  date: string;
  isRemembered: boolean;
  isFavorite: boolean;
}

export default function WordsScreen() {
  // Mock data - in a real app, this would come from Firebase or local storage
  const [words, setWords] = useState<Word[]>([
    {
      id: "1",
      spelling: "Serendipity",
      definition:
        "The occurrence and development of events by chance in a happy or beneficial way",
      exampleSentence:
        "A fortunate stroke of serendipity brought the two old friends together after years apart.",
      date: "2024-01-15",
      isRemembered: false,
      isFavorite: true,
    },
    {
      id: "2",
      spelling: "Ephemeral",
      definition: "Lasting for a very short time; transitory",
      exampleSentence:
        "The beauty of cherry blossoms is ephemeral, lasting only a few weeks each spring.",
      date: "2024-01-14",
      isRemembered: true,
      isFavorite: false,
    },
    {
      id: "3",
      spelling: "Ubiquitous",
      definition: "Present, appearing, or found everywhere",
      exampleSentence: "Smartphones have become ubiquitous in modern society.",
      date: "2024-01-13",
      isRemembered: false,
      isFavorite: true,
    },
    {
      id: "4",
      spelling: "Eloquent",
      definition: "Fluent or persuasive in speaking or writing",
      exampleSentence:
        "Her eloquent speech moved the entire audience to tears.",
      date: "2024-01-12",
      isRemembered: true,
      isFavorite: false,
    },
  ]);

  const [filter, setFilter] = useState<"new" | "favorites" | "remembered">(
    "new"
  );

  const handlePronunciation = (word: Word) => {
    Alert.alert(
      "Pronunciation",
      `Playing pronunciation for "${word.spelling}"`
    );
    // In a real app, integrate with text-to-speech API
  };

  const handleMoreMeanings = (word: Word) => {
    Alert.alert(
      "More Meanings",
      `Fetching additional meanings for "${word.spelling}"`
    );
    // In a real app, integrate with dictionary API
  };

  const toggleRemembered = (wordId: string) => {
    setWords((prevWords) =>
      prevWords.map((word) =>
        word.id === wordId
          ? { ...word, isRemembered: !word.isRemembered }
          : word
      )
    );
  };

  const toggleFavorite = (wordId: string) => {
    setWords((prevWords) =>
      prevWords.map((word) =>
        word.id === wordId ? { ...word, isFavorite: !word.isFavorite } : word
      )
    );
  };

  const handleDeleteWord = (wordId: string) => {
    Alert.alert("Delete Word", "Are you sure you want to delete this word?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setWords((prevWords) =>
            prevWords.filter((word) => word.id !== wordId)
          ),
      },
    ]);
  };

  const filteredWords = words.filter((word) => {
    switch (filter) {
      case "new":
        return !word.isRemembered;
      case "favorites":
        return word.isFavorite;
      case "remembered":
        return word.isRemembered;
      default:
        return true;
    }
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "new" && styles.activeFilter,
            ]}
            onPress={() => setFilter("new")}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === "new" && styles.activeFilterText,
              ]}
            >
              New Words
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "favorites" && styles.activeFilter,
            ]}
            onPress={() => setFilter("favorites")}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === "favorites" && styles.activeFilterText,
              ]}
            >
              Favorites
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "remembered" && styles.activeFilter,
            ]}
            onPress={() => setFilter("remembered")}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === "remembered" && styles.activeFilterText,
              ]}
            >
              Remembered
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.statsRow}>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{words.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Words</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {words.filter((word) => word.isFavorite).length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Favorites</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {words.filter((word) => word.isRemembered).length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Remembered</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.notesSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {filter === "new"
              ? "New Words"
              : filter === "favorites"
              ? "Favorite Words"
              : "Remembered Words"}
          </ThemedText>

          {filteredWords.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <IconSymbol size={64} name="doc.text" color="#CCCCCC" />
              <ThemedText style={styles.emptyText}>No words found</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Start reading and learning words to build your vocabulary!
              </ThemedText>
            </ThemedView>
          ) : (
            filteredWords.map((word) => (
              <ThemedView key={word.id} style={styles.wordCard}>
                <ThemedView style={styles.wordHeader}>
                  <ThemedView style={styles.wordInfo}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.wordSpelling}
                    >
                      {word.spelling}
                    </ThemedText>
                    <ThemedText style={styles.wordDate}>{word.date}</ThemedText>
                  </ThemedView>

                  <ThemedView style={styles.wordActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handlePronunciation(word)}
                    >
                      <IconSymbol
                        size={20}
                        name="speaker.wave.2"
                        color="#4A90E2"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleMoreMeanings(word)}
                    >
                      <IconSymbol size={20} name="book" color="#4A90E2" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => toggleRemembered(word.id)}
                    >
                      <IconSymbol
                        size={20}
                        name={
                          word.isRemembered
                            ? "checkmark.circle.fill"
                            : "checkmark.circle"
                        }
                        color={word.isRemembered ? "#4CAF50" : "#CCCCCC"}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => toggleFavorite(word.id)}
                    >
                      <IconSymbol
                        size={20}
                        name={word.isFavorite ? "heart.fill" : "heart"}
                        color={word.isFavorite ? "#FF6B6B" : "#CCCCCC"}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteWord(word.id)}
                    >
                      <IconSymbol size={20} name="trash" color="#FF6B6B" />
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>

                <ThemedText style={styles.wordDefinition}>
                  {word.definition}
                </ThemedText>

                <ThemedView style={styles.exampleContainer}>
                  <ThemedText style={styles.exampleLabel}>Example:</ThemedText>
                  <ThemedText style={styles.exampleSentence}>
                    &ldquo;{word.exampleSentence}&rdquo;
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            ))
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  searchButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 24,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#4A90E2",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(74, 144, 226, 0.05)",
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  notesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    opacity: 0.6,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: "center",
    marginTop: 8,
  },
  noteCard: {
    padding: 16,
    backgroundColor: "rgba(74, 144, 226, 0.02)",
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  wordCard: {
    padding: 16,
    backgroundColor: "rgba(74, 144, 226, 0.02)",
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  wordInfo: {
    flex: 1,
  },
  wordSpelling: {
    fontSize: 18,
    color: "#4A90E2",
    marginBottom: 4,
  },
  wordDate: {
    fontSize: 12,
    opacity: 0.5,
  },
  wordActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 4,
  },
  wordDefinition: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.8,
  },
  exampleContainer: {
    backgroundColor: "rgba(74, 144, 226, 0.05)",
    padding: 12,
    borderRadius: 6,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A90E2",
    marginBottom: 4,
  },
  exampleSentence: {
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 18,
    opacity: 0.8,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    flex: 1,
  },
  noteContent: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 20,
  },
  noteMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noteDate: {
    fontSize: 12,
    opacity: 0.5,
  },
  noteWordCount: {
    fontSize: 12,
    opacity: 0.5,
    fontWeight: "500",
  },
});
