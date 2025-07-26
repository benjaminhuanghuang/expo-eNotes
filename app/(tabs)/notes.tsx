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

export default function NotesScreen() {
  const [article, setArticle] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedWord, setSelectedWord] = useState("");

  const handleWordPress = (word: string) => {
    setSelectedWord(word);
    // In a real app, you might show a dictionary definition or translation
    Alert.alert("Word Selected", `You selected: "${word}"`);
  };

  const saveNotes = () => {
    if (notes.trim()) {
      // In a real app, save to Firebase or local storage
      Alert.alert("Notes Saved", "Your notes have been saved successfully!");
    } else {
      Alert.alert("No Notes", "Please add some notes before saving.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Reading & Notes</ThemedText>
          <TouchableOpacity style={styles.saveButton} onPress={saveNotes}>
            <IconSymbol
              size={20}
              name="square.and.arrow.down"
              color="#FFFFFF"
            />
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Article Text
          </ThemedText>
          <TextInput
            style={styles.articleInput}
            multiline
            placeholder="Paste or type the English article you want to read here..."
            value={article}
            onChangeText={setArticle}
            textAlignVertical="top"
          />

          {article ? (
            <ThemedView style={styles.readingArea}>
              <ThemedText style={styles.readingText}>
                {article.split(" ").map((word, index) => (
                  <ThemedText
                    key={index}
                    style={[
                      styles.word,
                      selectedWord === word.replace(/[.,!?;:]/, "") &&
                        styles.selectedWord,
                    ]}
                    onPress={() =>
                      handleWordPress(word.replace(/[.,!?;:]/, ""))
                    }
                  >
                    {word}{" "}
                  </ThemedText>
                ))}
              </ThemedText>
            </ThemedView>
          ) : null}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Your Notes
          </ThemedText>
          <TextInput
            style={styles.notesInput}
            multiline
            placeholder="Write your notes, vocabulary, and observations here..."
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </ThemedView>

        <ThemedView style={styles.tips}>
          <ThemedText type="defaultSemiBold" style={styles.tipsTitle}>
            💡 Tips:
          </ThemedText>
          <ThemedText style={styles.tipText}>
            • Tap on any word in the article to select it
          </ThemedText>
          <ThemedText style={styles.tipText}>
            • Use the notes section to write down new vocabulary
          </ThemedText>
          <ThemedText style={styles.tipText}>
            • Save your work regularly using the Save button
          </ThemedText>
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
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  articleInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    fontSize: 16,
    lineHeight: 24,
  },
  readingArea: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(74, 144, 226, 0.05)",
    borderRadius: 8,
  },
  readingText: {
    fontSize: 16,
    lineHeight: 24,
  },
  word: {
    fontSize: 16,
    lineHeight: 24,
  },
  selectedWord: {
    backgroundColor: "#4A90E2",
    color: "#FFFFFF",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
    fontSize: 16,
    lineHeight: 24,
  },
  tips: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  tipsTitle: {
    marginBottom: 8,
    color: "#FF8F00",
  },
  tipText: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.8,
  },
});
