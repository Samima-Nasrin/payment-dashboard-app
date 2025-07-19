import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { getToken } from "../utils/storage";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@/constants/constant";

const AddPaymentScreen = () => {
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [method, setMethod] = useState("upi");
  const [status, setStatus] = useState("success");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleAdd = async () => {
    if (!amount || !receiver) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken("token");
      await axios.post(
        `${API_BASE_URL}/payments`,
        {
          amount: parseFloat(amount),
          receiver,
          method,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Payment added!");
      navigation.reset({
        index: 0,
        routes: [{ name: "Transactions" }],
      });
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Failed to add");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Payment</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Amount (e.g. 1200)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Receiver name"
          value={receiver}
          onChangeText={setReceiver}
          style={styles.input}
        />

        <Text style={styles.label}>Method</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={method}
            onValueChange={(itemValue) => setMethod(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="UPI" value="upi" />
            <Picker.Item label="Card" value="card" />
            <Picker.Item label="Net Banking" value="netbanking" />
          </Picker>
        </View>

        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Success" value="success" />
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Failed" value="failed" />
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>Submit Payment</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AddPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    color: "#444",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: Platform.OS === "ios" ? 150 : 50,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
