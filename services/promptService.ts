import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { mockFirebaseService } from "./mockFirebaseService";

export interface PromptItem {
  id: string;
  label: string;
  prompt: string;
  color?: string;
  order: number;
}

const COLLECTION_NAME = "promptButtons";

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  try {
    // Check if we have real Firebase config (not placeholder values)
    const config = db.app.options;
    return (
      config.projectId &&
      config.projectId !== "your-project-id" &&
      config.apiKey !== "your-api-key"
    );
  } catch {
    return false;
  }
};

// Get all prompt items from Firebase or mock service
export const getPromptItems = async (): Promise<PromptItem[]> => {
  if (!isFirebaseConfigured()) {
    return mockFirebaseService.getPromptItems();
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("order"));
    const querySnapshot = await getDocs(q);
    const items: PromptItem[] = [];

    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as PromptItem);
    });

    return items;
  } catch (error) {
    console.error("Error fetching prompt items:", error);
    return getDefaultPromptItems();
  }
};

// Save a single prompt item to Firebase or mock service
export const savePromptItem = async (item: PromptItem): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockFirebaseService.savePromptItem(item);
  }

  try {
    await setDoc(doc(db, COLLECTION_NAME, item.id), {
      label: item.label,
      prompt: item.prompt,
      color: item.color || "#007AFF",
      order: item.order,
    });
  } catch (error) {
    console.error("Error saving prompt item:", error);
    throw error;
  }
};

// Delete a prompt item from Firebase or mock service
export const deletePromptItem = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockFirebaseService.deletePromptItem(id);
  }

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting prompt item:", error);
    throw error;
  }
};

// Save all prompt items to Firebase or mock service (for reordering)
export const saveAllPromptItems = async (
  items: PromptItem[]
): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockFirebaseService.saveAllPromptItems(items);
  }

  try {
    const batch = writeBatch(db);

    items.forEach((item, index) => {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      batch.set(docRef, {
        label: item.label,
        prompt: item.prompt,
        color: item.color || "#007AFF",
        order: index,
      });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error saving all prompt items:", error);
    throw error;
  }
};

// Initialize Firebase or mock service with default prompt items if none exist
export const initializeDefaultPromptItems = async (): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockFirebaseService.initializeDefaultPromptItems();
  }

  try {
    const existingItems = await getPromptItems();

    if (existingItems.length === 0) {
      const defaultItems = getDefaultPromptItems();
      await saveAllPromptItems(defaultItems);
    }
  } catch (error) {
    console.error("Error initializing default prompt items:", error);
  }
};

// Get default prompt items
export const getDefaultPromptItems = (): PromptItem[] => {
  return [
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
      prompt: "Please analyze the key implications and impact of this news",
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
};
