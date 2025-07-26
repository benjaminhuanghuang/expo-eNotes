import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#4A90E2", dark: "#2C5AA0" }}
      headerImage={
        <IconSymbol
          size={200}
          color="#FFFFFF"
          name="book.pages"
          style={styles.headerIcon}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">eNotes</ThemedText>
        <ThemedText style={styles.subtitle}>
          Read English & Take Notes
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.quickActions}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Quick Actions
        </ThemedText>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/notes")}
        >
          <IconSymbol size={32} name="plus.circle.fill" color="#4A90E2" />
          <ThemedView style={styles.actionContent}>
            <ThemedText type="defaultSemiBold">Start Reading</ThemedText>
            <ThemedText style={styles.actionDescription}>
              Begin a new reading session
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/words")}
        >
          <IconSymbol size={32} name="folder.fill" color="#4A90E2" />
          <ThemedView style={styles.actionContent}>
            <ThemedText type="defaultSemiBold">My Words</ThemedText>
            <ThemedText style={styles.actionDescription}>
              View saved words and vocabulary
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.statsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Your Progress
        </ThemedText>

        <ThemedView style={styles.statsGrid}>
          <ThemedView style={styles.statItem}>
            <ThemedText type="title" style={styles.statNumber}>
              0
            </ThemedText>
            <ThemedText style={styles.statLabel}>Articles Read</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statItem}>
            <ThemedText type="title" style={styles.statNumber}>
              0
            </ThemedText>
            <ThemedText style={styles.statLabel}>Notes Taken</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statItem}>
            <ThemedText type="title" style={styles.statNumber}>
              0
            </ThemedText>
            <ThemedText style={styles.statLabel}>Words Learned</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    alignSelf: "center",
    marginTop: 50,
  },
  titleContainer: {
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: "center",
  },
  sectionTitle: {
    marginBottom: 16,
  },
  quickActions: {
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    gap: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(74, 144, 226, 0.05)",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 4,
  },
});
