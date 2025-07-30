import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Could not log out.');
    }
  };

  const transactions = [
    { name: 'Starbucks', date: 'Today', amount: -5.75 },
    { name: 'Amazon', date: 'Yesterday', amount: -49.99 },
    { name: 'Paycheck', date: 'Jul 15', amount: 2450.0 },
    { name: 'Uber', date: 'Jul 14', amount: -12.5 },
  ];

  const monthlySpending = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [1500, 2700, 4200, 10000, 5200, 3300, 2200],
      },
    ],
  };

  const savingsGrowth = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [2500, 1000, 2000, 9500, 5200, 4800, 4900],
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.brand}><Text style={styles.highlight}>Fin</Text>Track</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Here's your financial overview</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Overview</Text>
        <Text style={styles.balance}>$8,459.52</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Transactions</Text>
        {transactions.map((tx, i) => (
          <View key={i} style={styles.transactionRow}>
            <View>
              <Text style={styles.transactionName}>{tx.name}</Text>
              <Text style={styles.transactionDate}>{tx.date}</Text>
            </View>
            <Text style={tx.amount > 0 ? styles.income : styles.expense}>
              {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Spending</Text>
        <BarChart
          data={monthlySpending}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Savings Growth</Text>
        <LineChart
          data={savingsGrowth}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#111',
  backgroundGradientTo: '#111',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 240, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#00f0ff',
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 16,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brand: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  highlight: {
    color: '#00f0ff',
  },
  logoutButton: {
    backgroundColor: '#00f0ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#aaa',
    marginBottom: 16,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 10,
  },
  balance: {
    color: '#00f0ff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  transactionName: {
    color: '#fff',
    fontSize: 14,
  },
  transactionDate: {
    color: '#888',
    fontSize: 12,
  },
  income: {
    color: '#0f0',
    fontWeight: 'bold',
  },
  expense: {
    color: '#f0f',
    fontWeight: 'bold',
  },
  chart: {
    marginTop: 8,
    borderRadius: 16,
  },
});

export default Dashboard;
