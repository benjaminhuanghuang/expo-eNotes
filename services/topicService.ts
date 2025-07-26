import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Topic {
  id: string;
  label: string;
  prompt: string;
}

const COLLECTION_NAME = "topics";

// Get all topics from Firebase or mock service
export const getTopics = async (): Promise<Topic[]> => {
  try {
    console.log("Attempting to fetch from Firebase...");
    const q = query(collection(db, COLLECTION_NAME));

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Firebase timeout")), 10000);
    });

    const querySnapshot = await Promise.race([getDocs(q), timeoutPromise]);

    const items: Topic[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as Topic);
    });

    console.log(`Successfully fetched ${items.length} topics from Firebase`);
    return items;
  } catch (error) {
    console.error("Error fetching topics from Firebase:", error);
    return []; // Return empty array on error
  }
};

// Save a single topic to Firebase or mock service
export const saveTopic = async (item: Topic): Promise<void> => {
  try {
    console.log("Attempting to save to Firebase...", item.label);

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Firebase save timeout")), 10000);
    });

    await Promise.race([
      setDoc(doc(db, COLLECTION_NAME, item.id), {
        label: item.label,
        prompt: item.prompt,
      }),
      timeoutPromise,
    ]);
  } catch (error) {
    console.error("Error saving topic to Firebase:", error);
  }
};

// Delete a topic from Firebase or mock service
export const deleteTopic = async (id: string): Promise<void> => {
  try {
    console.log("Attempting to delete from Firebase...", id);

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Firebase delete timeout")), 10000);
    });

    await Promise.race([
      deleteDoc(doc(db, COLLECTION_NAME, id)),
      timeoutPromise,
    ]);
  } catch (error) {
    console.error("Error deleting topic from Firebase:", error);
  }
};

// Save all topics to Firebase or mock service (for reordering)
export const saveAllTopics = async (items: Topic[]): Promise<void> => {
  try {
    const batch = writeBatch(db);

    items.forEach((item) => {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      batch.set(docRef, {
        label: item.label,
        prompt: item.prompt,
      });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error saving all topics:", error);
  }
};
