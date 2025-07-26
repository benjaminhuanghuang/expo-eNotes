import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
import {
  useDeleteTopicItem,
  useSaveTopicItem,
  useTopicItems,
} from "@/hooks/useTopicQueries";
import type { Topic } from "@/services/topicService";

export default function SettingsScreen() {
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<Topic | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  // Use TanStack Query hooks
  const {
    data: topicItems = [],
    isLoading: loading,
    error: topicError,
    refetch: refetchTopics,
  } = useTopicItems();

  const saveTopicMutation = useSaveTopicItem();
  const deleteTopicMutation = useDeleteTopicItem();

  const saving = saveTopicMutation.isPending || deleteTopicMutation.isPending;

  const addItem = async () => {
    if (newLabel.trim() && newPrompt.trim()) {
      try {
        const newItem: Topic = {
          id: Date.now().toString(),
          label: newLabel.trim(),
          prompt: newPrompt.trim(),
        };

        await saveTopicMutation.mutateAsync(newItem);

        setNewLabel("");
        setNewPrompt("");
        setShowAddForm(false);
      } catch (error) {
        console.error("Error adding prompt item:", error);
        Alert.alert("Error", "Failed to add prompt item");
      }
    } else {
      Alert.alert("Error", "Please fill in both label and prompt");
    }
  };

  const updateItem = async () => {
    if (editingItem && newLabel.trim() && newPrompt.trim()) {
      try {
        const updatedItem: Topic = {
          ...editingItem,
          label: newLabel.trim(),
          prompt: newPrompt.trim(),
        };

        await saveTopicMutation.mutateAsync(updatedItem);

        setEditingItem(null);
        setNewLabel("");
        setNewPrompt("");
      } catch (error) {
        console.error("Error updating prompt item:", error);
        Alert.alert("Error", "Failed to update prompt item");
      }
    } else {
      Alert.alert("Error", "Please fill in both label and prompt");
    }
  };

  const deleteItem = async (id: string) => {
    Alert.alert(
      "Delete Prompt",
      "Are you sure you want to delete this prompt?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTopicMutation.mutateAsync(id);
            } catch (error) {
              console.error("Error deleting prompt item:", error);
              Alert.alert("Error", "Failed to delete prompt item");
            }
          },
        },
      ]
    );
  };

  const editItem = (item: Topic) => {
    setEditingItem(item);
    setNewLabel(item.label);
    setNewPrompt(item.prompt);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setNewLabel("");
    setNewPrompt("");
    setShowAddForm(false);
  };

  const goBack = () => {
    router.back();
  };

  // Handle error state
  if (topicError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            Failed to load settings
          </ThemedText>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetchTopics()}
          >
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>
            Loading settings...
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <IconSymbol name="chevron.left" size={24} color="#007AFF" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>
            Prompt Settings
          </ThemedText>
          <ThemedView style={styles.placeholder} />
        </ThemedView>

        {/* Add New Prompt Button */}
        {!showAddForm && !editingItem && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <IconSymbol name="plus" size={20} color="#fff" />
            <ThemedText style={styles.addButtonText}>Add New Prompt</ThemedText>
          </TouchableOpacity>
        )}

        {/* Add/Edit Form */}
        {(showAddForm || editingItem) && (
          <ThemedView style={styles.form}>
            <ThemedText style={styles.formTitle}>
              {editingItem ? "Edit Prompt" : "Add New Prompt"}
            </ThemedText>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Label</ThemedText>
              <TextInput
                style={styles.textInput}
                value={newLabel}
                onChangeText={setNewLabel}
                placeholder="Enter button label"
                placeholderTextColor="#999"
              />
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Prompt</ThemedText>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newPrompt}
                onChangeText={setNewPrompt}
                placeholder="Enter AI prompt text"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </ThemedView>

            <ThemedView style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={cancelEdit}
                disabled={saving}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={editingItem ? updateItem : addItem}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <ThemedText style={styles.saveButtonText}>
                    {editingItem ? "Update" : "Add"}
                  </ThemedText>
                )}
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        )}

        {/* Prompt Items List */}
        <ThemedView style={styles.listContainer}>
          <ThemedText style={styles.listTitle}>Current Prompts</ThemedText>

          {topicItems.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                No prompts available. Add your first prompt above.
              </ThemedText>
            </ThemedView>
          ) : (
            topicItems.map((item: Topic) => (
              <ThemedView key={item.id} style={styles.promptItem}>
                <ThemedView style={styles.promptInfo}>
                  <ThemedText style={styles.promptLabel}>
                    {item.label}
                  </ThemedText>
                  <ThemedText style={styles.promptText} numberOfLines={2}>
                    {item.prompt}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.promptActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => editItem(item)}
                    disabled={saving}
                  >
                    <IconSymbol name="pencil" size={16} color="#007AFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => deleteItem(item.id)}
                    disabled={saving}
                  >
                    <IconSymbol name="trash" size={16} color="#ff3b30" />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            ))
          )}
        </ThemedView>

        {/* Bottom Spacing */}
        <ThemedView style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  placeholder: {
    width: 40,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    marginBottom: 24,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  promptItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promptInfo: {
    flex: 1,
    marginRight: 12,
  },
  promptLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#1a1a1a",
  },
  promptText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  promptActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#e3f2fd",
  },
  deleteButton: {
    backgroundColor: "#ffebee",
  },
  bottomSpacing: {
    height: 50,
  },
});
