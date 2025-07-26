# Index page

## UI

- The main view shows top 10 news today in one sentence
- Show some buttons, click button will send a prompt to gemini and response will be displayed in the main view
- The last button is "settings", click it will enter a settings page.
- The settings page shows a list of label and prompt. The label will be displayed in the button in index page, the prompt will be
  send to gemini when click button
- User can add, edit, delete, reorder the items in settings page.

## Firebase

The settings for the prompt buttons has content

```js
[
  {
    id: 1,
    label: "news",
    prompt: "Get top 10 news today",
  },
  {
    id: 2,
    label: "Tech",
    prompt: "Get top 10 tech news today",
  },
];
```

I want to save it in firebase, when app staring, the data will be fetched from firebase and displayed in index page.

When user modify the data in settings page, the new data will be saved into firebase and refreshed on the index page.
