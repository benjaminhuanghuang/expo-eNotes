import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
  deletePromptItem,
  getPromptItems,
  initializeDefaultPromptItems,
  savePromptItem,
  type PromptItem,
} from "@/services/promptService";

export default function SettingsScreen() {
  const router = useRouter();
  const [promptItems, setPromptItems] = useState<PromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<PromptItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  // Load prompt items from Firebase
  const loadPromptItems = useCallback(async () => {
    try {
      setLoading(true);
      const items = await getPromptItems();

      if (items.length === 0) {
        // Initialize with default items if none exist
        await initializeDefaultPromptItems();
        const defaultItems = await getPromptItems();
        setPromptItems(defaultItems);
      } else {
        setPromptItems(items);
      }
    } catch (error) {
      console.error("Error loading prompt items:", error);
      Alert.alert("Error", "Failed to load prompt items");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load prompts when component mounts
  useEffect(() => {
    loadPromptItems();
  }, [loadPromptItems]);

  // Reload prompts when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPromptItems();
    }, [loadPromptItems])
  );

  const addItem = async () => {
    if (newLabel.trim() && newPrompt.trim()) {
      try {
        setSaving(true);
        const newItem: PromptItem = {
          id: Date.now().toString(),
          label: newLabel.trim(),
          prompt: newPrompt.trim(),
          color: "#007AFF", // Default color
          order: promptItems.length,
        };

        await savePromptItem(newItem);
        await loadPromptItems(); // Reload to get updated data

        setNewLabel("");
        setNewPrompt("");
        setShowAddForm(false);
      } catch (error) {
        console.error("Error adding prompt item:", error);
        Alert.alert("Error", "Failed to add prompt item");
      } finally {
        setSaving(false);
      }
    } else {
      Alert.alert("Error", "Please fill in both label and prompt");
    }
  };

  const updateItem = async () => {
    if (editingItem && newLabel.trim() && newPrompt.trim()) {
      try {
        setSaving(true);
        const updatedItem: PromptItem = {
          ...editingItem,
          label: newLabel.trim(),
          prompt: newPrompt.trim(),
        };

        await savePromptItem(updatedItem);
        await loadPromptItems(); // Reload to get updated data

        setEditingItem(null);
        setNewLabel("");
        setNewPrompt("");
      } catch (error) {
        console.error("Error updating prompt item:", error);
        Alert.alert("Error", "Failed to update prompt item");
      } finally {
        setSaving(false);
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
              await deletePromptItem(id);
              await loadPromptItems(); // Reload to get updated data
            } catch (error) {
              console.error("Error deleting prompt item:", error);
              Alert.alert("Error", "Failed to delete prompt item");
            }
          },
        },
      ]
    );
  };

  const editItem = (item: PromptItem) => {
    setEditingItem(item);
    setNewLabel(item.label);
    setNewPrompt(item.prompt);
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setNewLabel("");
    setNewPrompt("");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Loading prompts...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

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
            disabled={saving}
          >
            <IconSymbol size={24} name="plus" color="#4A90E2" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedText style={styles.description}>
          Manage your AI prompt buttons. These will appear on the home screen
          and send prompts to AI when clicked.
        </ThemedText>

        {(showAddForm || editingItem) && (
          <ThemedView style={styles.formContainer}>
            <ThemedText type="subtitle" style={styles.formTitle}>
              {editingItem ? "Edit Prompt" : "Add New Prompt"}
            </ThemedText>

            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Label:</ThemedText>
              <TextInput
                style={styles.input}
                value={newLabel}
                onChangeText={setNewLabel}
                placeholder="Enter button label (e.g., 'Summarize')"
                placeholderTextColor="#999"
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Prompt:</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newPrompt}
                onChangeText={setNewPrompt}
                placeholder="Enter the prompt to send to AI"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </ThemedView>

            <ThemedView style={styles.buttonContainer}>
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

        <ThemedView style={styles.itemsContainer}>
          <ThemedText type="subtitle" style={styles.itemsTitle}>
            Current Prompt Buttons
          </ThemedText>

          {promptItems.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                No prompt buttons configured. Add one to get started!
              </ThemedText>
            </ThemedView>
          ) : (
            promptItems.map((item, index) => (
              <ThemedView key={item.id} style={styles.itemCard}>
                <ThemedView style={styles.itemContent}>
                  <ThemedText style={styles.itemLabel}>{item.label}</ThemedText>
                  <ThemedText style={styles.itemPrompt} numberOfLines={2}>
                    {item.prompt}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.itemActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editActionButton]}
                    onPress={() => editItem(item)}
                    disabled={saving}
                  >
                    <IconSymbol size={18} name="pencil" color="#007AFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteActionButton]}
                    onPress={() => deleteItem(item.id)}
                    disabled={saving}
                  >
                    <IconSymbol size={18} name="trash" color="#FF3B30" />
                  </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  itemsContainer: {
    marginBottom: 32,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  itemPrompt: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  itemActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 6,
  },
  editActionButton: {
    backgroundColor: "#E3F2FD",
  },
  deleteActionButton: {
    backgroundColor: "#FFEBEE",
  },
});
