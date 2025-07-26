import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface SavedNote {
  id: string;
  content: string;
  date: string;
  tags: string[];
  isFavorite: boolean;
}

export default function NotesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  // Mock data - in a real app, this would come from Firebase or local storage
  const [savedNotes] = useState<SavedNote[]>([
    {
      id: "1",
      content:
        "Learned about React Native navigation and how Expo Router simplifies the process of creating tab-based navigation...",
      date: "2024-01-15",
      tags: ["React Native", "Navigation", "Expo"],
      isFavorite: true,
    },
    {
      id: "2",
      content:
        "TypeScript provides better type safety for React Native apps. Key concepts: interfaces, types, generics...",
      date: "2024-01-14",
      tags: ["TypeScript", "Types", "Development"],
      isFavorite: false,
    },
    {
      id: "3",
      content:
        "Firebase integration for authentication and database. Setup process involves configuration and SDK installation...",
      date: "2024-01-13",
      tags: ["Firebase", "Authentication", "Database"],
      isFavorite: true,
    },
    {
      id: "4",
      content:
        "English vocabulary: Serendipity - the occurrence of events by chance in a happy way. Used in literature contexts...",
      date: "2024-01-12",
      tags: ["Vocabulary", "English", "Literature"],
      isFavorite: false,
    },
  ]);

  const handleNotePress = (note: SavedNote) => {
    Alert.alert(
      "Note Details",
      `Date: ${note.date}\nTags: ${note.tags.join(", ")}\n\n${note.content}`,
      [
        { text: "Edit", onPress: () => console.log("Edit note:", note.id) },
        {
          text: "Toggle Favorite",
          onPress: () => handleToggleFavorite(note.id),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteNote(note.id),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleToggleFavorite = (noteId: string) => {
    console.log("Toggle favorite for note:", noteId);
    // In a real app, update the note's favorite status
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
    const matchesSearch =
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFilter =
      filter === "all" || (filter === "favorites" && note.isFavorite);
    return matchesSearch && matchesFilter;
  });

  const addNewNote = () => {
    Alert.alert("Add Note", "Navigate to reading mode to create a new note", [
      { text: "OK" },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">My Notes</ThemedText>
          <TouchableOpacity style={styles.addButton} onPress={addNewNote}>
            <IconSymbol size={24} name="plus" color="#4A90E2" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.searchContainer}>
          <IconSymbol size={20} name="magnifyingglass" color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes or tags..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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
              All Notes
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

        <ThemedView style={styles.notesSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {filter === "all" ? "All Notes" : "Favorite Notes"}
          </ThemedText>

          {filteredNotes.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <IconSymbol size={64} name="doc.text" color="#CCCCCC" />
              <ThemedText style={styles.emptyText}>No notes found</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                {searchQuery
                  ? "Try a different search term"
                  : "Start taking notes to build your collection!"}
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
                  <ThemedView style={styles.noteInfo}>
                    <ThemedText style={styles.noteDate}>{note.date}</ThemedText>
                    {note.isFavorite && (
                      <IconSymbol size={16} name="heart.fill" color="#FF6B6B" />
                    )}
                  </ThemedView>
                  <IconSymbol size={16} name="chevron.right" color="#CCCCCC" />
                </ThemedView>

                <ThemedText style={styles.noteContent} numberOfLines={3}>
                  {note.content}
                </ThemedText>

                <ThemedView style={styles.tagsContainer}>
                  {note.tags.map((tag, index) => (
                    <ThemedView key={index} style={styles.tagPill}>
                      <ThemedText style={styles.tagText}>{tag}</ThemedText>
                    </ThemedView>
                  ))}
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
  addButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(74, 144, 226, 0.05)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
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
  noteInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  noteDate: {
    fontSize: 12,
    opacity: 0.5,
  },
  noteContent: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagPill: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#4A90E2",
    fontWeight: "500",
  },
});
