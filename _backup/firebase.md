# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create project and application

   - 1. In your Firebase project, go to Project Settings
   - 2. Scroll down to "Your apps" section
   - 3. Click "Add app" and select Web (</>)
   - 4. Register your app
   - 5. Copy the Firebase configuration object

3. Enable Firestore Database

4. Auth

   Build -> Authentication -> Get started -> Email password -> Enable

## Step 2: Setup project

Install dependencies

```sh
npm i firebase
```

create FirebaseConfig.ts file

1. In your Firebase project, go to Project Settings
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web (</>)
4. Register your app
5. Copy the Firebase configuration object

## 1. Mock Mode (Default)

The app currently runs in mock mode with placeholder Firebase credentials. All data is stored in memory and will be lost when the app restarts. This is perfect for development and testing.

## 2. Firebase Mode (Production)

To enable real Firebase integration:

### Step 3: Update Configuration

Replace the placeholder values in `config/firebase.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
};
```

### Step 4: Set Firestore Rules

In Firebase Console, go to Firestore Database > Rules and set:

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

### Step 5: Restart the App

After updating the configuration, restart your development server.

## Features

### AI News Dashboard

- Displays top 10 mock news stories
- Dynamic AI prompt buttons that can be customized
- Settings button to manage prompts

### Words Page

- Vocabulary learning interface
- Filter buttons with count badges
- Word management functionality

### Settings Page

- Add, edit, and delete AI prompt buttons
- Real-time synchronization with the dashboard
- Form validation and error handling

## Troubleshooting

### Mock Mode Issues

- If you see "Loading prompts..." indefinitely, check the console for errors
- The mock service automatically initializes with default prompt buttons

### Firebase Mode Issues

- Verify your Firebase configuration values are correct
- Check that Firestore is enabled in your Firebase project
- Ensure Firestore rules allow read/write access
- Check the browser/device console for Firebase errors

- Check that all required dependencies are installed
