import { type PromptItem } from "./promptService";

// Mock storage key for AsyncStorage alternative
const STORAGE_KEY = "promptItems";

// Mock Firestore implementation using localStorage/AsyncStorage
class MockFirestore {
  private storage: { [key: string]: any } = {};

  // Initialize with some default data
  constructor() {
    this.storage[STORAGE_KEY] = [];
  }

  async get(key: string): Promise<any[]> {
    return this.storage[key] || [];
  }

  async set(key: string, data: any[]): Promise<void> {
    this.storage[key] = data;
    // In a real app, you'd use AsyncStorage here
    // await AsyncStorage.setItem(key, JSON.stringify(data));
  }

  async add(key: string, item: any): Promise<void> {
    const items = await this.get(key);
    const existingIndex = items.findIndex(
      (existing) => existing.id === item.id
    );

    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.push(item);
    }

    await this.set(key, items);
  }

  async delete(key: string, id: string): Promise<void> {
    const items = await this.get(key);
    const filteredItems = items.filter((item) => item.id !== id);
    await this.set(key, filteredItems);
  }
}

// Create a singleton instance
const mockDb = new MockFirestore();

// Mock Firebase functions
export const mockFirebaseService = {
  // Mock getPromptItems
  async getPromptItems(): Promise<PromptItem[]> {
    try {
      const items = await mockDb.get(STORAGE_KEY);
      return items.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error("Mock Firebase: Error getting items", error);
      return [];
    }
  },

  // Mock savePromptItem
  async savePromptItem(item: PromptItem): Promise<void> {
    try {
      await mockDb.add(STORAGE_KEY, item);
    } catch (error) {
      console.error("Mock Firebase: Error saving item", error);
      throw error;
    }
  },

  // Mock deletePromptItem
  async deletePromptItem(id: string): Promise<void> {
    try {
      await mockDb.delete(STORAGE_KEY, id);
    } catch (error) {
      console.error("Mock Firebase: Error deleting item", error);
      throw error;
    }
  },

  // Mock saveAllPromptItems
  async saveAllPromptItems(items: PromptItem[]): Promise<void> {
    try {
      await mockDb.set(STORAGE_KEY, items);
    } catch (error) {
      console.error("Mock Firebase: Error saving all items", error);
      throw error;
    }
  },

  // Mock initializeDefaultPromptItems
  async initializeDefaultPromptItems(): Promise<void> {
    try {
      const existingItems = await this.getPromptItems();

      if (existingItems.length === 0) {
        const defaultItems: PromptItem[] = [
          {
            id: "1",
            label: "Summarize",
            prompt: "Please summarize the following news in one clear sentence",
            color: "#007AFF",
            order: 0,
          },
          {
            id: "2",
            label: "Explain",
            prompt:
              "Please explain this news story in simple terms for better understanding",
            color: "#34C759",
            order: 1,
          },
          {
            id: "3",
            label: "Analyze",
            prompt:
              "Please analyze the key implications and impact of this news",
            color: "#FF9500",
            order: 2,
          },
          {
            id: "4",
            label: "Key Points",
            prompt: "Please extract the main key points from this news story",
            color: "#AF52DE",
            order: 3,
          },
        ];

        await this.saveAllPromptItems(defaultItems);
      }
    } catch (error) {
      console.error("Mock Firebase: Error initializing default items", error);
    }
  },
};
