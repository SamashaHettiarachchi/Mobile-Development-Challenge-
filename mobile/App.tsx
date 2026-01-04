import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Investment, NewInvestmentData } from "./src/types";
import { fetchInvestments, createInvestment, ApiError } from "./src/api";
import { InvestmentItem } from "./src/components/InvestmentItem";
import { NewInvestmentModal } from "./src/components/NewInvestmentModal";

export default function App() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Load investments from API
   */
  const loadInvestments = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchInvestments();
      setInvestments(data);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to load investments";
      setError(errorMessage);
      console.error("Error loading investments:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Pull-to-refresh handler
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadInvestments();
  }, [loadInvestments]);

  /**
   * Handle creating a new investment with optimistic update
   */
  const handleCreateInvestment = async (data: NewInvestmentData) => {
    // Create optimistic item with temporary ID
    const optimisticItem: Investment = {
      id: Date.now(), // Temporary ID
      ...data,
      created_at: new Date().toISOString(),
    };

    // Optimistically add to list
    setInvestments((prev: Investment[]) => [optimisticItem, ...prev]);

    try {
      // Make API call
      const created = await createInvestment(data);

      // Replace optimistic item with real data
      setInvestments((prev: Investment[]) =>
        prev.map((item: Investment) =>
          item.id === optimisticItem.id ? created : item
        )
      );
    } catch (err) {
      // Rollback on error
      setInvestments((prev: Investment[]) =>
        prev.filter((item: Investment) => item.id !== optimisticItem.id)
      );

      // Re-throw to let modal handle the error
      throw err;
    }
  };

  // Load investments on mount
  useEffect(() => {
    loadInvestments();
  }, [loadInvestments]);

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Loading investments...</Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  /**
   * Render error state
   */
  if (error && investments.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>⚠️ Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadInvestments}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  /**
   * Render empty state
   */
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Investments Yet</Text>
      <Text style={styles.emptyText}>
        Create your first investment to get started!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FarmInvest Lite</Text>
        <Text style={styles.headerSubtitle}>
          {investments.length}{" "}
          {investments.length === 1 ? "Investment" : "Investments"}
        </Text>
      </View>

      <FlatList
        data={investments}
        renderItem={({ item }: { item: Investment }) => (
          <InvestmentItem investment={item} />
        )}
        keyExtractor={(item: Investment) => item.id.toString()}
        contentContainerStyle={
          investments.length === 0 ? styles.emptyList : styles.listContent
        }
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2e7d32"]}
            tintColor="#2e7d32"
          />
        }
        testID="investments-list"
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        testID="add-button"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <NewInvestmentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateInvestment}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    backgroundColor: "#2e7d32",
    padding: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#c8e6c9",
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#d32f2f",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2e7d32",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "300",
  },
});
