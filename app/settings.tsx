import { useRouter } from "expo-router";
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

interface PromptItem {
  id: string;
  label: string;
  prompt: string;
}

export default function SettingsScreen() {
  const router = useRouter();

  const [promptItems, setPromptItems] = useState<PromptItem[]>([
    {
      id: "1",
      label: "Summarize",
      prompt: "Please summarize the following news in one clear sentence",
    },
    {
      id: "2",
      label: "Explain",
      prompt:
        "Please explain this news story in simple terms for better understanding",
    },
    {
      id: "3",
      label: "Analyze",
      prompt: "Please analyze the key implications and impact of this news",
    },
    {
      id: "4",
      label: "Key Points",
      prompt: "Please extract the main key points from this news story",
    },
  ]);

  const [editingItem, setEditingItem] = useState<PromptItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  const handleAddItem = () => {
    if (newLabel.trim() && newPrompt.trim()) {
      const newItem: PromptItem = {
        id: Date.now().toString(),
        label: newLabel.trim(),
        prompt: newPrompt.trim(),
      };
      setPromptItems([...promptItems, newItem]);
      setNewLabel("");
      setNewPrompt("");
      setShowAddForm(false);
    } else {
      Alert.alert("Error", "Please fill in both label and prompt");
    }
  };

  const handleEditItem = (item: PromptItem) => {
    setEditingItem(item);
    setNewLabel(item.label);
    setNewPrompt(item.prompt);
  };

  const handleUpdateItem = () => {
    if (editingItem && newLabel.trim() && newPrompt.trim()) {
      setPromptItems(
        promptItems.map((item) =>
          item.id === editingItem.id
            ? { ...item, label: newLabel.trim(), prompt: newPrompt.trim() }
            : item
        )
      );
      setEditingItem(null);
      setNewLabel("");
      setNewPrompt("");
    } else {
      Alert.alert("Error", "Please fill in both label and prompt");
    }
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this prompt item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setPromptItems(promptItems.filter((item) => item.id !== id)),
        },
      ]
    );
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...promptItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setPromptItems(newItems);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setNewLabel("");
    setNewPrompt("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol size={24} name="chevron.left" color="#4A90E2" />
          </TouchableOpacity>
          <ThemedText type="title">Settings</ThemedText>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <IconSymbol size={24} name="plus" color="#4A90E2" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedText style={styles.description}>
          Manage your AI prompt buttons. These will appear on the home screen
          and send prompts to Gemini when clicked.
        </ThemedText>

        {(showAddForm || editingItem) && (
          <ThemedView style={styles.formContainer}>
            <ThemedText type="subtitle" style={styles.formTitle}>
              {editingItem ? "Edit Prompt" : "Add New Prompt"}
            </ThemedText>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Button Label:</ThemedText>
              <TextInput
                style={styles.textInput}
                value={newLabel}
                onChangeText={setNewLabel}
                placeholder="Enter button label (e.g., 'Summarize')"
              />
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>AI Prompt:</ThemedText>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newPrompt}
                onChangeText={setNewPrompt}
                placeholder="Enter the prompt to send to Gemini"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </ThemedView>

            <ThemedView style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelEdit}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={editingItem ? handleUpdateItem : handleAddItem}
              >
                <ThemedText style={styles.saveButtonText}>
                  {editingItem ? "Update" : "Add"}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        )}

        <ThemedView style={styles.listContainer}>
          <ThemedText type="subtitle" style={styles.listTitle}>
            Prompt Buttons
          </ThemedText>

          {promptItems.map((item, index) => (
            <ThemedView key={item.id} style={styles.promptItem}>
              <ThemedView style={styles.promptContent}>
                <ThemedText type="defaultSemiBold" style={styles.promptLabel}>
                  {item.label}
                </ThemedText>
                <ThemedText style={styles.promptText} numberOfLines={2}>
                  {item.prompt}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.itemActions}>
                {index > 0 && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => moveItem(index, index - 1)}
                  >
                    <IconSymbol size={18} name="chevron.up" color="#666" />
                  </TouchableOpacity>
                )}

                {index < promptItems.length - 1 && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => moveItem(index, index + 1)}
                  >
                    <IconSymbol size={18} name="chevron.down" color="#666" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditItem(item)}
                >
                  <IconSymbol size={18} name="pencil" color="#4A90E2" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteItem(item.id)}
                >
                  <IconSymbol size={18} name="trash" color="#FF6B6B" />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          ))}
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
  backButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 24,
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: "rgba(74, 144, 226, 0.05)",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  formTitle: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    minHeight: 100,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  cancelButtonText: {
    color: "#666666",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#4A90E2",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  listContainer: {
    marginBottom: 32,
  },
  listTitle: {
    marginBottom: 16,
  },
  promptItem: {
    flexDirection: "row",
    backgroundColor: "rgba(74, 144, 226, 0.02)",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  promptContent: {
    flex: 1,
    marginRight: 12,
  },
  promptLabel: {
    fontSize: 16,
    marginBottom: 4,
    color: "#4A90E2",
  },
  promptText: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 18,
  },
  itemActions: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
  },
});
