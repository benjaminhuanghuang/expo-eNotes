# Index page

## UI

- The main view shows top 10 news today in one sentence
- Show some buttons, click button will send a prompt to gemini and response will be displayed in the main view
- The last button is "settings", click it will enter a settings page.
- The settings page shows a list of label and prompt. The label will be displayed in the button in index page, the prompt will be
  send to gemini when click button
- User can add, edit, delete, reorder the items in settings page.

## Prompt data

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

when app staring, the data will be fetched from firebase and displayed as the prompt buttons in index page.

When user click the settings button, it will enter a settings page, the data will be fetched from firebase and displayed in a list

Since the data is loaded from firebase, and displayed in index page, displayed and edited in settings page,
Is it necessary to use redux to manage the state between the two pages.

## Settings page

where user can add, edit, delete, reorder the items.

When user add a new item, it will be added to firebase and displayed in the settings page.

When user edit an item, it will be updated in firebase and displayed in the settings page.

When user delete an item, it will be removed from firebase and settings page.

When user reorder the items, it will be updated in firebase and displayed in the settings page.

When user modify the data in settings page, the new data will be saved into firebase and refreshed on the index page.

## Prompt button

When user click the button, the prompt will be sent to gemini and response will be displayed in the main view. The label will be displayed in the button.
