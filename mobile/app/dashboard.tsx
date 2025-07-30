import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../src/lib/supabase';
import { router } from 'expo-router';
import { apiService } from '../src/services/api';
import { GlassTheme, glassStyles } from '../constants/GlassTheme';
import { AccountCard } from '../components/ui/AccountCard';
import { TransactionItem } from '../components/ui/TransactionItem';
import { GoalProgressRing } from '../components/ui/GoalProgressRing';
import { TransactionBottomSheet } from '../components/ui/TransactionBottomSheet';
import { BottomTabNavigation } from '../components/ui/BottomTabNavigation';

// Sample data - replace with your API calls
const accounts = [
  {
    accountName: "Main Checking",
    balance: 15420.50,
    accountType: "Checking Account"
  },
  {
    accountName: "Savings Fund",
    balance: 28750.00,
    accountType: "Savings Account"
  },
  {
    accountName: "Investment",
    balance: 12340.75,
    accountType: "Brokerage Account"
  }
];

const transactions = [
  {
    description: "Grocery Store",
    amount: -85.32,
    date: "Today",
    category: "Food & Dining",
    type: "expense" as const
  },
  {
    description: "Salary Deposit",
    amount: 3200.00,
    date: "Yesterday",
    category: "Income",
    type: "income" as const
  },
  {
    description: "Netflix Subscription",
    amount: -15.99,
    date: "2 days ago",
    category: "Entertainment",
    type: "expense" as const
  },
  {
    description: "Gas Station",
    amount: -45.20,
    date: "3 days ago",
    category: "Transportation",
    type: "expense" as const
  }
];

const goals = [
  {
    title: "Emergency Fund",
    current: 8500,
    target: 15000,
    color: "hsl(267, 84%, 81%)"
  },
  {
    title: "Vacation",
    current: 2300,
    target: 5000,
    color: "hsl(285, 35%, 60%)"
  },
  {
    title: "New Car",
    current: 12000,
    target: 25000,
    color: "hsl(300, 100%, 75%)"
  }
];

export default function Dashboard() {
  const [showTransactionSheet, setShowTransactionSheet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    accounts: accounts, // Fallback to static data
    transactions: transactions,
    goals: goals,
    totalBalance: 0
  });

  // Load real data from backend
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🏦 Loading dashboard data...');

      // Fetch data from multiple endpoints
      const [accountsResult, transactionsResult, goalsResult] = await Promise.all([
        apiService.getAccounts(),
        apiService.getTransactions({ limit: 10 }), // Get recent transactions
        apiService.getGoals()
      ]);

      console.log('📊 API Results:', {
        accounts: accountsResult,
        transactions: transactionsResult,
        goals: goalsResult
      });

      // Update state with real data or keep fallbacks
      const newData = {
        accounts: accountsResult.success ? accountsResult.data : accounts,
        transactions: transactionsResult.success ? (transactionsResult.data.transactions || transactionsResult.data || transactions) : transactions,
        goals: goalsResult.success ? goalsResult.data : goals,
        totalBalance: 0
      };

      // Calculate total balance
      if (Array.isArray(newData.accounts)) {
        newData.totalBalance = newData.accounts.reduce((sum: number, account: any) => {
          return sum + (account.balance || 0);
        }, 0);
      } else {
        newData.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
      }

      setDashboardData(newData);

      // Show user feedback about data source
      if (accountsResult.success || transactionsResult.success || goalsResult.success) {
        console.log('✅ Successfully loaded some data from backend');
      } else {
        console.log('⚠️ Using demo data - backend connection failed');
        Alert.alert(
          'Demo Mode', 
          'Using sample data. Check your backend connection and authentication.',
          [{ text: 'OK' }]
        );
      }

    } catch (error) {
      console.error('Dashboard data loading failed:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Using demo data.');
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = dashboardData.totalBalance;

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const handleAddTransaction = async (transactionData: any) => {
    console.log('New transaction added:', transactionData);
    
    // Create the transaction via API
    const result = await apiService.createTransaction(transactionData);
    
    if (result.success) {
      console.log('✅ Transaction created successfully');
      // Refresh dashboard data to show the new transaction
      await loadDashboardData();
      Alert.alert('Success', 'Transaction added successfully!');
    } else {
      console.error('❌ Failed to create transaction:', result.error);
      Alert.alert('Error', `Failed to add transaction: ${result.error}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={GlassTheme.colors.primary[500]} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Financial Dashboard</Text>
          <View style={[styles.totalBalanceCard, glassStyles.card]}>
            <Text style={styles.totalBalanceLabel}>Total Balance</Text>
            <Text style={styles.totalBalance}>{formatCurrency(totalBalance)}</Text>
          </View>
        </View>

        {/* Account Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          <View style={styles.accountGrid}>
            {dashboardData.accounts.map((account: any, index: number) => (
              <AccountCard
                key={index}
                accountName={account.accountName || account.name}
                balance={account.balance}
                accountType={account.accountType || account.type}
              />
            ))}
          </View>
        </View>

        {/* Goals and Transactions */}
        <View style={styles.twoColumnSection}>
          {/* Goals Section */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Financial Goals</Text>
            <View style={[styles.sectionCard, glassStyles.card]}>
              {dashboardData.goals.map((goal: any, index: number) => (
                <GoalProgressRing
                  key={index}
                  title={goal.title || goal.name}
                  current={goal.current || goal.currentAmount}
                  target={goal.target || goal.targetAmount}
                  color={goal.color || "hsl(267, 84%, 81%)"}
                />
              ))}
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={[styles.sectionCard, glassStyles.card]}>
              {dashboardData.transactions.map((transaction: any, index: number) => (
                <TransactionItem
                  key={index}
                  description={transaction.description}
                  amount={transaction.amount}
                  date={transaction.date}
                  category={transaction.category}
                  type={transaction.type}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <Button title="Sign out" onPress={signOut} />
        </View>
        
        {/* Add some bottom padding for the tab navigation */}
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Transaction Bottom Sheet */}
      <TransactionBottomSheet
        isVisible={showTransactionSheet}
        onClose={() => setShowTransactionSheet(false)}
        onSubmit={handleAddTransaction}
      />
      
      {/* Bottom Tab Navigation */}
      <BottomTabNavigation
        activeTab="dashboard"
        onTabPress={(tabId) => {
          if (tabId === 'transactions') {
            setShowTransactionSheet(true);
          }
          console.log('Tab pressed:', tabId);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlassTheme.colors.primary[900],
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: GlassTheme.spacing.lg,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: GlassTheme.spacing.xxl,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
    textAlign: 'center',
    marginBottom: GlassTheme.spacing.lg,
    // Removed text shadow for web compatibility
  },
  totalBalanceCard: {
    padding: GlassTheme.spacing.lg,
    borderRadius: GlassTheme.borderRadius.xl,
    alignItems: 'center',
    maxWidth: 300,
    width: '100%',
  },
  totalBalanceLabel: {
    fontSize: 18,
    color: GlassTheme.colors.neutral[500],
    fontWeight: '500',  
    marginBottom: GlassTheme.spacing.sm,
  },
  totalBalance: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
    // Removed text shadow for web compatibility
  },
  section: {
    marginBottom: GlassTheme.spacing.xxl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
    marginBottom: GlassTheme.spacing.lg,
    // Removed text shadow for web compatibility
  },
  accountGrid: {
    gap: GlassTheme.spacing.md,
  },
  twoColumnSection: {
    gap: GlassTheme.spacing.xxl,
    marginBottom: GlassTheme.spacing.xxl,
  },
  column: {
    flex: 1,
  },
  sectionCard: {
    padding: GlassTheme.spacing.lg,
    borderRadius: GlassTheme.borderRadius.xl,
  },
  signOutContainer: {
    marginTop: GlassTheme.spacing.xl,
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: GlassTheme.spacing.lg,
    fontSize: 16,
    color: 'white',
    fontFamily: GlassTheme.typography.body,
  },
});