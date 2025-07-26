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

interface SavedNote {
  id: string;
  title: string;
  content: string;
  date: string;
  wordCount: number;
}

export default function WordsScreen() {
  // Mock data - in a real app, this would come from Firebase or local storage
  const [savedNotes] = useState<SavedNote[]>([
    {
      id: "1",
      title: "Introduction to React Native",
      content:
        "React Native is a framework for building mobile applications using React...",
      date: "2024-01-15",
      wordCount: 156,
    },
    {
      id: "2",
      title: "Understanding TypeScript",
      content:
        "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript...",
      date: "2024-01-14",
      wordCount: 203,
    },
    {
      id: "3",
      title: "Firebase Integration Guide",
      content:
        "Firebase provides a comprehensive platform for mobile and web applications...",
      date: "2024-01-13",
      wordCount: 178,
    },
  ]);

  const [filter, setFilter] = useState<"all" | "recent" | "favorites">("all");

  const handleNotePress = (note: SavedNote) => {
    Alert.alert(
      note.title,
      `Created: ${note.date}\nWords: ${
        note.wordCount
      }\n\n${note.content.substring(0, 100)}...`,
      [
        { text: "Edit", onPress: () => console.log("Edit note:", note.id) },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteNote(note.id),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => console.log("Deleted:", noteId),
      },
    ]);
  };

  const filteredNotes = savedNotes.filter((note) => {
    if (filter === "recent") {
      const noteDate = new Date(note.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return noteDate >= weekAgo;
    }
    return true; // For 'all' and 'favorites' (favorites not implemented in mock)
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">My Words</ThemedText>
          <TouchableOpacity style={styles.searchButton}>
            <IconSymbol size={24} name="magnifyingglass" color="#4A90E2" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "all" && styles.activeFilter,
            ]}
            onPress={() => setFilter("all")}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === "all" && styles.activeFilterText,
              ]}
            >
              All Words
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "recent" && styles.activeFilter,
            ]}
            onPress={() => setFilter("recent")}
          >
            <ThemedText
              style={[
                styles.filterText,
                filter === "recent" && styles.activeFilterText,
              ]}
            >
              Recent
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
        </ThemedView>

        <ThemedView style={styles.statsRow}>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {savedNotes.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Total Words</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {savedNotes.reduce((sum, note) => sum + note.wordCount, 0)}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Words Learned</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statNumber}>7</ThemedText>
            <ThemedText style={styles.statLabel}>Days Streak</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.notesSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {filter === "all"
              ? "All Words"
              : filter === "recent"
              ? "Recent Words"
              : "Favorite Words"}
          </ThemedText>

          {filteredNotes.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <IconSymbol size={64} name="doc.text" color="#CCCCCC" />
              <ThemedText style={styles.emptyText}>No words found</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Start reading and learning words to build your vocabulary!
              </ThemedText>
            </ThemedView>
          ) : (
            filteredNotes.map((note) => (
              <TouchableOpacity
                key={note.id}
                style={styles.noteCard}
                onPress={() => handleNotePress(note)}
              >
                <ThemedView style={styles.noteHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.noteTitle}>
                    {note.title}
                  </ThemedText>
                  <IconSymbol size={16} name="chevron.right" color="#CCCCCC" />
                </ThemedView>

                <ThemedText style={styles.noteContent} numberOfLines={2}>
                  {note.content}
                </ThemedText>

                <ThemedView style={styles.noteMeta}>
                  <ThemedText style={styles.noteDate}>{note.date}</ThemedText>
                  <ThemedText style={styles.noteWordCount}>
                    {note.wordCount} words
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
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
