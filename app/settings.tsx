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
  useColorScheme,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import {
  useDeleteTopicItem,
  useSaveTopicItem,
  useTopicItems,
} from "@/hooks/useTopicQueries";
import type { Topic } from "@/services/topicService";

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
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
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.tint} />
          <ThemedText style={styles.loadingText}>
            Loading settings...
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <IconSymbol name="chevron.left" size={24} color={theme.tint} />
          </TouchableOpacity>
          {/* Add New Prompt Button */}
          {!showAddForm && !editingItem && (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.tint }]}
              onPress={() => setShowAddForm(true)}
            >
              <IconSymbol
                name="plus"
                size={20}
                color={colorScheme === "dark" ? theme.background : "#fff"}
              />
              <ThemedText
                style={[styles.addButtonText, { color: theme.background }]}
              >
                Add New Prompt
              </ThemedText>
            </TouchableOpacity>
          )}
          <ThemedView style={styles.placeholder} />
        </ThemedView>

        {/* Add/Edit Form */}
        {(showAddForm || editingItem) && (
          <ThemedView
            style={[
              styles.form,
              {
                backgroundColor: colorScheme === "dark" ? "#2c2c2e" : "#fff",
                shadowColor: colorScheme === "dark" ? "#000" : "#000",
                shadowOpacity: colorScheme === "dark" ? 0.3 : 0.1,
              },
            ]}
          >
            <ThemedText style={[styles.formTitle, { color: theme.text }]}>
              {editingItem ? "Edit Prompt" : "Add New Prompt"}
            </ThemedText>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Label</ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#2c2c2e" : "#fff",
                    color: theme.text,
                    borderColor: colorScheme === "dark" ? "#3c3c3e" : "#ddd",
                  },
                ]}
                value={newLabel}
                onChangeText={setNewLabel}
                placeholder="Enter button label"
                placeholderTextColor={theme.icon}
              />
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Prompt</ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  styles.textArea,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#2c2c2e" : "#fff",
                    color: theme.text,
                    borderColor: colorScheme === "dark" ? "#3c3c3e" : "#ddd",
                  },
                ]}
                value={newPrompt}
                onChangeText={setNewPrompt}
                placeholder="Enter AI prompt text"
                placeholderTextColor={theme.icon}
                multiline
                numberOfLines={4}
              />
            </ThemedView>

            <ThemedView style={styles.formButtons}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#3c3c3e" : "#f0f0f0",
                  },
                ]}
                onPress={cancelEdit}
                disabled={saving}
              >
                <ThemedText
                  style={[styles.cancelButtonText, { color: theme.text }]}
                >
                  Cancel
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.saveButton,
                  { backgroundColor: theme.tint },
                ]}
                onPress={editingItem ? updateItem : addItem}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={theme.text} />
                ) : (
                  <ThemedText
                    style={[
                      styles.saveButtonText,
                      {
                        color: colorScheme === "dark" ? theme.text : "#fff",
                      },
                    ]}
                  >
                    {editingItem ? "Update" : "Add"}
                  </ThemedText>
                )}
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        )}

        {/* Prompt Items List */}
        <ThemedView style={styles.listContainer}>
          <ThemedText style={[styles.listTitle, { color: theme.text }]}>
            Current Prompts
          </ThemedText>

          {topicItems.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText
                style={[styles.emptyStateText, { color: theme.icon }]}
              >
                No prompts available. Add your first prompt above.
              </ThemedText>
            </ThemedView>
          ) : (
            topicItems.map((item: Topic) => (
              <ThemedView
                key={item.id}
                style={[
                  styles.promptItem,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#2c2c2e" : "#fff",
                    shadowColor: colorScheme === "dark" ? "#000" : "#000",
                    shadowOpacity: colorScheme === "dark" ? 0.3 : 0.1,
                  },
                ]}
              >
                <ThemedView style={styles.promptInfo}>
                  <ThemedText
                    style={[styles.promptLabel, { color: theme.text }]}
                  >
                    {item.label}
                  </ThemedText>
                  <ThemedText
                    style={[styles.promptText, { color: theme.icon }]}
                    numberOfLines={2}
                  >
                    {item.prompt}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.promptActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => editItem(item)}
                    disabled={saving}
                  >
                    <IconSymbol name="pencil" size={16} color={theme.tint} />
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
  },
  placeholder: {
    width: 40,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    borderRadius: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  form: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    // Uses theme.tint in component
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
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
  },
  promptItem: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  promptText: {
    fontSize: 14,
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
    // Uses theme-based color in component
  },
  deleteButton: {
    // Uses theme-based color in component
  },
  bottomSpacing: {
    height: 50,
  },
});
