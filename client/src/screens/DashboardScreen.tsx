import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { getToken } from '../utils/storage';
import { API_BASE_URL } from '@/constants/constant';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = await getToken('token');
      const res = await axios.get(`${API_BASE_URL}/payments/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.log('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load dashboard stats</Text>
      </View>
    );
  }

  const chartData = {
    labels: stats.last7Days.map((d: any) => d._id?.slice(5) || ''),
    datasets: [
      {
        data: stats.last7Days.map((d: any) =>
          typeof d.total === 'number' ? d.total : 0
        ),
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>📊 Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Payments Today</Text>
        <Text style={styles.cardValue}>{stats.totalToday}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Revenue</Text>
        <Text style={styles.cardValue}>
          ₹{stats.totalRevenue.toLocaleString('en-IN')}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Failed Payments</Text>
        <Text style={[styles.cardValue, { color: '#D9534F' }]}>
          {stats.failedCount}
        </Text>
      </View>

      <Text style={styles.chartTitle}>📈 Last 7 Days Revenue</Text>
      <LineChart
        data={chartData}
        width={Math.min(screenWidth - 40, 360)}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#eaf4ff',
          backgroundGradientTo: '#eaf4ff',
          decimalPlaces: 0,
          color: () => '#007AFF',
          labelColor: () => '#333',
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#007AFF',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    borderRadius: 16,
    marginBottom: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#cc0000',
  },
});
