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

export interface Topic {
  id: string;
  label: string;
  prompt: string;
  color?: string;
  order: number;
}

const COLLECTION_NAME = "topics";

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

// Get all topics from Firebase or mock service
export const getTopics = async (): Promise<Topic[]> => {
  if (!isFirebaseConfigured()) {
    return mockFirebaseService.getTopics();
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("order"));
    const querySnapshot = await getDocs(q);
    const items: Topic[] = [];

    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as Topic);
    });

    return items;
  } catch (error) {
    console.error("Error fetching topics:", error);
    return getDefaultTopics();
  }
};

// Save a single topic to Firebase or mock service
export const saveTopic = async (item: Topic): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockFirebaseService.saveTopic(item);
  }

  try {
    await setDoc(doc(db, COLLECTION_NAME, item.id), {
      label: item.label,
      prompt: item.prompt,
      order: item.order,
    });
  } catch (error) {
    console.error("Error saving topic:", error);
    throw error;
  }
};

// Delete a topic from Firebase or mock service
export const deleteTopic = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockFirebaseService.deleteTopic(id);
  }

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting topic:", error);
    throw error;
  }
};

// Save all topics to Firebase or mock service (for reordering)
export const saveAllTopics = async (items: Topic[]): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockFirebaseService.saveAllTopics(items);
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
    console.error("Error saving all topics:", error);
    throw error;
  }
};

// Initialize Firebase or mock service with default topics if none exist
export const initializeDefaultTopics = async (): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockFirebaseService.initializeDefaultTopics();
  }

  try {
    const existingItems = await getTopics();

    if (existingItems.length === 0) {
      const defaultItems = getDefaultTopics();
      await saveAllTopics(defaultItems);
    }
  } catch (error) {
    console.error("Error initializing default topics:", error);
  }
};

// Get default topics
export const getDefaultTopics = (): Topic[] => {
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
