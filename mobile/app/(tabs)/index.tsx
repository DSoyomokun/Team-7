import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { GlassTheme, glassStyles } from '../../constants/GlassTheme';
import { AccountCard } from '../../components/ui/AccountCard';
import { TransactionItem } from '../../components/ui/TransactionItem';
import { GoalProgressRing } from '../../components/ui/GoalProgressRing';
import { TransactionBottomSheet } from '../../components/ui/TransactionBottomSheet';

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
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAddTransaction = (transactionData: any) => {
    console.log('New transaction added:', transactionData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

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
            {accounts.map((account, index) => (
              <AccountCard
                key={index}
                accountName={account.accountName}
                balance={account.balance}
                accountType={account.accountType}
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
              {goals.map((goal, index) => (
                <GoalProgressRing
                  key={index}
                  title={goal.title}
                  current={goal.current}
                  target={goal.target}
                  color={goal.color}
                />
              ))}
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={[styles.sectionCard, glassStyles.card]}>
              {transactions.map((transaction, index) => (
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
});
