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
```
