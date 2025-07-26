```js
/* AI Response Display */
{
  processingPrompt && (
    <ThemedView style={styles.responseContainer}>
      <ActivityIndicator size="small" color="#007AFF" />
      <ThemedText style={styles.loadingText}>Processing with AI...</ThemedText>
    </ThemedView>
  );
}

{
  geminiResponse && !processingPrompt && (
    <ThemedView style={styles.responseContainer}>
      <ThemedView>
        <ThemedText type="defaultSemiBold" style={styles.responseTitle}>
          AI Response:
        </ThemedText>
        <ThemedText style={styles.responseText}>{geminiResponse}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
```
