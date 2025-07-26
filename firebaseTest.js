import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION_NAME = "topics";

async function testFirebaseConnection() {
  try {
    const q = query(collection(db, COLLECTION_NAME));

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firebase timeout")), 10000)
    );

    const querySnapshot = await Promise.race([getDocs(q), timeoutPromise]);
    console.log(querySnapshot);

    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });

    console.log(items);
  } catch (err) {
    console.error("❌ Firebase query failed:", err.message);
  }
}

await testFirebaseConnection();
process.exit(0);
