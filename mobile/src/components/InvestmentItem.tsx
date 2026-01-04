import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Investment } from "../types";

interface InvestmentItemProps {
  investment: Investment;
}

/**
 * Individual investment item component
 * Displays farmer name, amount, crop, and creation date
 */
export function InvestmentItem({ investment }: InvestmentItemProps) {
  const formattedAmount = `Rs. ${new Intl.NumberFormat("en-LK").format(
    investment.amount
  )}`;

  const formattedDate = new Date(investment.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <View style={styles.container} testID="investment-item">
      <View style={styles.header}>
        <Text style={styles.farmerName}>{investment.farmer_name}</Text>
        <Text style={styles.amount}>{formattedAmount}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.crop}>🌾 {investment.crop}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2e7d32",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  crop: {
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
});
