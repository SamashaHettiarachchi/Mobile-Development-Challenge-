import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NewInvestmentData } from "../types";

interface NewInvestmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: NewInvestmentData) => Promise<void>;
}

/**
 * Modal form for creating a new investment
 * Includes validation and error handling
 */
export function NewInvestmentModal({
  visible,
  onClose,
  onSubmit,
}: NewInvestmentModalProps) {
  const [farmerName, setFarmerName] = useState("");
  const [amount, setAmount] = useState("");
  const [crop, setCrop] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFarmerName("");
    setAmount("");
    setCrop("");
  };

  const validateForm = (): string | null => {
    if (!farmerName.trim()) {
      return "Farmer name is required";
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      return "Amount must be a positive number";
    }

    if (!crop.trim()) {
      return "Crop type is required";
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        farmer_name: farmerName.trim(),
        amount: parseFloat(amount),
        crop: crop.trim(),
      });

      resetForm();
      onClose();
      Alert.alert("Success", "Investment created successfully!");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create investment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>New Investment</Text>
            <TouchableOpacity onPress={handleClose} disabled={loading}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Farmer Name</Text>
              <TextInput
                style={styles.input}
                value={farmerName}
                onChangeText={setFarmerName}
                placeholder="Enter farmer name"
                editable={!loading}
                testID="input-farmer-name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount ($)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                keyboardType="decimal-pad"
                editable={!loading}
                testID="input-amount"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Crop Type</Text>
              <TextInput
                style={styles.input}
                value={crop}
                onChangeText={setCrop}
                placeholder="Enter crop type"
                editable={!loading}
                testID="input-crop"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
              testID="submit-button"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Create Investment</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    minHeight: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeButton: {
    fontSize: 28,
    color: "#666",
    fontWeight: "300",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
