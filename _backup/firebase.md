# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create project and application

   - 1. In your Firebase project, go to Project Settings
   - 2. Scroll down to "Your apps" section
   - 3. Click "Add app" and select Web (</>)
   - 4. Register your app
   - 5. Copy the Firebase configuration object to `config/firebase.ts`

3. Create database
   Firestore Database -> Create database

   Change rule: In Firebase Console, go to Firestore Database > Rules

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /promptButtons/{document} {
         allow read, write: if true; // Change this for production security
       }
     }
   }
   ```

4. Auth

   Build -> Authentication -> Get started -> Email password -> Enable

## Step 2: Setup project

Install dependencies

```sh
npm i firebase
```

## Mock data

```js
// If no items exist, initialize with defaults
if (items.length === 0) {
  await initializeDefaultTopics();
  return await getTopics();
}

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  try {
    // Check if we have real Firebase config (not placeholder values)
    const config = db.app.options;
    const hasValidConfig =
      config.projectId &&
      config.projectId !== "your-project-id" &&
      config.apiKey &&
      config.apiKey !== "your-api-key" &&
      config.projectId.length > 0 &&
      config.apiKey.length > 0;

    console.log("Firebase config check:", {
      projectId: config.projectId,
      hasApiKey: !!config.apiKey,
      isValid: hasValidConfig,
    });

    return hasValidConfig;
  } catch (error) {
    console.log("Firebase config error:", error);
    return false;
  }
};

if (!isFirebaseConfigured()) {
  console.log("Using mock service for getTopics");
  return mockFirebaseService.getTopics();
}
```

```js
// Get default topics
export const getDefaultTopics = (): Topic[] => {
  return [
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
  ];
};
```

## Query

Order

```js
const q = query(collection(db, COLLECTION_NAME), orderBy("order"));
const querySnapshot = await getDocs(q);
const items: Topic[] = [];

querySnapshot.forEach((doc) => {
  items.push({ id: doc.id, ...doc.data() } as Topic);
});

return items;
```

```js
const items = await mockDb.get(STORAGE_KEY);
return items.sort((a, b) => a.order - b.order);
```
