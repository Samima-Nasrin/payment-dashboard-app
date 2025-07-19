import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  Platform,
} from "react-native";
import axios from "axios";
import { getToken } from "../utils/storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { API_BASE_URL } from "@/constants/constant";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

type Transaction = {
  _id: string;
  amount: number;
  receiver: string;
  method: string;
  status: string;
  createdAt: string;
};

const TransactionsListScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const fetchTransactions = async (reset = false) => {
    if (!reset && page > totalPages) return;

    try {
      if (reset) {
        setLoading(true);
        setPage(1);
        setTransactions([]);
      }

      const token = await getToken("token");
      const query: any = {
        page: reset ? 1 : page,
        limit: 10,
      };

      if (status) query.status = status;
      if (method) query.method = method;
      if (startDate) query.startDate = startDate.toISOString();
      if (endDate) query.endDate = endDate.toISOString();

      const res = await axios.get(`${API_BASE_URL}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: query,
      });

      if (reset || page === 1) {
        setTransactions(res.data.data);
      } else {
        setTransactions((prev) => [...prev, ...res.data.data]);
      }

      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions(true);
    }, [status, method, startDate, endDate])
  );

  useEffect(() => {
    if (page !== 1) {
      fetchTransactions();
    }
  }, [page]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "success":
        return styles.status_success;
      case "pending":
        return styles.status_pending;
      case "failed":
        return styles.status_failed;
      default:
        return {};
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TransactionDetails", { transaction: item })
      }
      style={styles.card}
    >
      <Text style={styles.receiver}>{item.receiver}</Text>
      <Text style={styles.amount}>₹{item.amount.toLocaleString("en-IN")}</Text>
      <Text style={[styles.status, getStatusStyle(item.status)]}>
        {item.method.toUpperCase()} • {item.status}
      </Text>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      {/* Filters */}
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(value) => setStatus(value)}
          style={styles.picker}
        >
          <Picker.Item label="All Status" value="" />
          <Picker.Item label="Success" value="success" />
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="Failed" value="failed" />
        </Picker>

        <Picker
          selectedValue={method}
          onValueChange={(value) => setMethod(value)}
          style={styles.picker}
        >
          <Picker.Item label="All Methods" value="" />
          <Picker.Item label="UPI" value="upi" />
          <Picker.Item label="Card" value="card" />
          <Picker.Item label="Net Banking" value="netbanking" />
        </Picker>

        <View style={styles.dateRow}>
          <Button
            title={startDate ? startDate.toDateString() : "Start Date"}
            onPress={() => {
              if (Platform.OS === "web") {
                const input = document.createElement("input");
                input.type = "date";
                input.onchange = (e: any) => {
                  const val = e.target.value;
                  if (val) setStartDate(new Date(val));
                };
                input.click();
              } else {
                setShowStartPicker(true);
              }
            }}
          />
          <Button
            title={endDate ? endDate.toDateString() : "End Date"}
            onPress={() => {
              if (Platform.OS === "web") {
                const input = document.createElement("input");
                input.type = "date";
                input.onchange = (e: any) => {
                  const val = e.target.value;
                  if (val) setEndDate(new Date(val));
                };
                input.click();
              } else {
                setShowEndPicker(true);
              }
            }}
          />
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
      </View>

      {/* Transactions */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
          />
          {page < totalPages && (
            <View style={styles.loadMoreBtn}>
              <Button title="Load More" onPress={() => setPage((prev) => prev + 1)} />
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default TransactionsListScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 12,
  },
  filterContainer: {
    marginBottom: 12,
  },
  picker: {
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  container: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  receiver: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  status_success: {
    color: "green",
  },
  status_pending: {
    color: "orange",
  },
  status_failed: {
    color: "red",
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
  loadMoreBtn: {
    marginTop: 8,
    alignItems: "center",
  },
});
