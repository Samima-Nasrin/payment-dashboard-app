import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Transaction = {
  _id: string;
  amount: number;
  receiver: string;
  method: string;
  status: string;
  createdAt: string;
};

type RouteParams = {
  TransactionDetails: {
    transaction: Transaction;
  };
};

const TransactionDetailsScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'TransactionDetails'>>();
  const { transaction } = route.params;
  const navigation = useNavigation();

  // Get color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return '#28a745'; // green
      case 'pending':
        return '#fd7e14'; // orange
      case 'failed':
        return '#dc3545'; // red
      default:
        return '#6c757d'; // grey
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Transaction Details</Text>

      <View style={styles.card}>
        <Detail label="Receiver" value={transaction.receiver} />
        <Detail label="Amount" value={`₹${transaction.amount.toLocaleString('en-IN')}`} />
        <Detail label="Method" value={transaction.method} />
        <Detail
          label="Status"
          value={transaction.status}
          valueColor={getStatusColor(transaction.status)}
        />
        <Detail
          label="Date"
          value={new Date(transaction.createdAt).toLocaleString()}
        />
        <Detail label="Transaction ID" value={transaction._id} />
      </View>
    </View>
  );
};

const Detail = ({
  label,
  value,
  valueColor = '#222',
}: {
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <View style={styles.detailBox}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
  </View>
);

export default TransactionDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafafa',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    color: '#007bff',
    fontSize: 16,
    marginLeft: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  detailBox: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
  },
});
