import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput,
  Modal 
} from 'react-native';
import { GlassTheme, glassStyles } from '../../constants/GlassTheme';
import { TransactionItem } from '../../components/ui/TransactionItem';
import { TransactionBottomSheet } from '../../components/ui/TransactionBottomSheet';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

const initialTransactions: Transaction[] = [
  {
    id: 1,
    description: "Grocery Store",
    amount: -85.32,
    date: "Today",
    category: "Food & Dining",
    type: "expense"
  },
  {
    id: 2,
    description: "Salary Deposit",
    amount: 3200.00,
    date: "Yesterday",
    category: "Income",
    type: "income"
  },
  {
    id: 3,
    description: "Netflix Subscription",
    amount: -15.99,
    date: "2 days ago",
    category: "Entertainment",
    type: "expense"
  },
  {
    id: 4,  
    description: "Gas Station",
    amount: -45.20,
    date: "3 days ago",
    category: "Transportation",
    type: "expense"
  },
  {
    id: 5,
    description: "Freelance Payment",
    amount: 850.00,
    date: "4 days ago",
    category: "Income",
    type: "income"
  },
  {
    id: 6,
    description: "Coffee Shop",
    amount: -4.50,
    date: "5 days ago",
    category: "Food & Dining",
    type: "expense"
  }
];

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [forceUpdate, setForceUpdate] = useState(0);

  // Monitor state changes
  useEffect(() => {
    console.log('Transactions state updated:', transactions.length);
  }, [transactions]);

  // Force re-render when needed
  const forceReRender = () => {
    setForceUpdate(prev => prev + 1);
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTransaction = (transactionData: any) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      description: transactionData.description,
      amount: transactionData.type === 'expense' ? -Math.abs(transactionData.amount) : Math.abs(transactionData.amount),
      date: 'Today',
      category: transactionData.category,
      type: transactionData.type
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

  const handleUpdateTransaction = () => {
    if (!selectedTransaction) return;
    
    setTransactions(transactions.map(t => 
      t.id === selectedTransaction.id ? selectedTransaction : t
    ));
    setShowEditModal(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = (transactionId: number) => {
    console.log('Delete button pressed for transaction ID:', transactionId);
    console.log('Current transactions before delete:', transactions.length);
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log('Delete confirmed for transaction ID:', transactionId);
            const updatedTransactions = transactions.filter(t => t.id !== transactionId);
            console.log('Transactions after filter:', updatedTransactions.length);
            setTransactions(updatedTransactions);
            console.log('State update triggered');
            // Force re-render to ensure UI updates
            setTimeout(() => forceReRender(), 100);
          }
        }
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <View style={[styles.balanceCard, glassStyles.card]}>
          <Text style={styles.balanceLabel}>Net Total</Text>
          <Text style={[styles.balance, { color: totalBalance >= 0 ? '#4ade80' : '#f87171' }]}>
            {formatCurrency(totalBalance)}
          </Text>
        </View>
      </View>

      {/* Search and Add Button */}
      <View style={styles.actionBar}>
        <View style={[styles.searchContainer, glassStyles.card]}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={GlassTheme.colors.neutral[500]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={[styles.addButton, glassStyles.card]}
          onPress={() => setShowAddSheet(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.addButton, glassStyles.card, { backgroundColor: '#ef4444' + '40' }]}
          onPress={() => {
            console.log('Test delete - current transactions:', transactions.length);
            if (transactions.length > 0) {
              handleDeleteTransaction(transactions[0].id);
            }
          }}
        >
          <Text style={styles.addButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.transactionsList, glassStyles.card]}>
          {filteredTransactions.length === 0 ? (
            <Text style={styles.emptyText}>No transactions found</Text>
          ) : (
            filteredTransactions.map((transaction) => (
              <View key={`${transaction.id}-${forceUpdate}`} style={styles.transactionRow}>
                <View style={styles.transactionContent}>
                  <TransactionItem
                    description={transaction.description}
                    amount={transaction.amount}
                    date={transaction.date}
                    category={transaction.category}
                    type={transaction.type}
                  />
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditTransaction(transaction)}
                  >
                    <Text style={styles.actionButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteTransaction(transaction.id)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Transaction Bottom Sheet */}
      <TransactionBottomSheet
        isVisible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onSubmit={handleAddTransaction}
      />

      {/* Edit Transaction Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, glassStyles.card]}>
            <Text style={styles.modalTitle}>Edit Transaction</Text>
            
            {selectedTransaction && (
              <>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.input, glassStyles.card]}
                  value={selectedTransaction.description}
                  onChangeText={(text) => 
                    setSelectedTransaction({...selectedTransaction, description: text})
                  }
                  placeholderTextColor={GlassTheme.colors.neutral[500]}
                />

                <Text style={styles.fieldLabel}>Amount</Text>
                <TextInput
                  style={[styles.input, glassStyles.card]}
                  value={Math.abs(selectedTransaction.amount).toString()}
                  onChangeText={(text) => {
                    const amount = parseFloat(text) || 0;
                    setSelectedTransaction({
                      ...selectedTransaction, 
                      amount: selectedTransaction.type === 'expense' ? -Math.abs(amount) : Math.abs(amount)
                    });
                  }}
                  keyboardType="numeric"
                  placeholderTextColor={GlassTheme.colors.neutral[500]}
                />

                <Text style={styles.fieldLabel}>Category</Text>
                <TextInput
                  style={[styles.input, glassStyles.card]}
                  value={selectedTransaction.category}
                  onChangeText={(text) => 
                    setSelectedTransaction({...selectedTransaction, category: text})
                  }
                  placeholderTextColor={GlassTheme.colors.neutral[500]}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowEditModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleUpdateTransaction}
                  >
                    <Text style={styles.modalButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlassTheme.colors.primary[900],
  },
  header: {
    alignItems: 'center',
    padding: GlassTheme.spacing.lg,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
    marginBottom: GlassTheme.spacing.lg,
  },
  balanceCard: {
    padding: GlassTheme.spacing.md,
    borderRadius: GlassTheme.borderRadius.lg,
    alignItems: 'center',
    minWidth: 200,
  },
  balanceLabel: {
    fontSize: 16,
    color: GlassTheme.colors.neutral[500],
    fontWeight: '500',
    marginBottom: GlassTheme.spacing.xs,
  },
  balance: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: GlassTheme.typography.primary,
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: GlassTheme.spacing.lg,
    marginBottom: GlassTheme.spacing.lg,
    gap: GlassTheme.spacing.md,
  },
  searchContainer: {
    flex: 1,
    borderRadius: GlassTheme.borderRadius.lg,
    paddingHorizontal: GlassTheme.spacing.md,
  },
  searchInput: {
    color: 'white',
    fontSize: 16,
    paddingVertical: GlassTheme.spacing.md,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: GlassTheme.colors.primary[500],
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: GlassTheme.spacing.lg,
  },
  transactionsList: {
    borderRadius: GlassTheme.borderRadius.xl,
    padding: GlassTheme.spacing.md,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: GlassTheme.spacing.xs,
  },
  transactionContent: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: GlassTheme.spacing.xs,
    marginLeft: GlassTheme.spacing.md,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: GlassTheme.colors.primary[500] + '40',
  },
  deleteButton: {
    backgroundColor: '#ef4444' + '60',
    borderWidth: 1,
    borderColor: '#ef4444' + '40',
  },
  actionButtonText: {
    fontSize: 16,
  },
  emptyText: {
    color: GlassTheme.colors.neutral[500],
    fontSize: 16,
    textAlign: 'center',
    padding: GlassTheme.spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: GlassTheme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: GlassTheme.borderRadius.xl,
    padding: GlassTheme.spacing.lg,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: GlassTheme.spacing.lg,
  },
  fieldLabel: {
    fontSize: 16,
    color: GlassTheme.colors.neutral[300],
    marginBottom: GlassTheme.spacing.xs,
    marginTop: GlassTheme.spacing.md,
  },
  input: {
    borderRadius: GlassTheme.borderRadius.lg,
    padding: GlassTheme.spacing.md,
    color: 'white',
    fontSize: 16,
    marginBottom: GlassTheme.spacing.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: GlassTheme.spacing.md,
    marginTop: GlassTheme.spacing.lg,
  },
  modalButton: {
    flex: 1,
    borderRadius: GlassTheme.borderRadius.lg,
    padding: GlassTheme.spacing.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: GlassTheme.colors.neutral[600] + '60',
  },
  saveButton: {
    backgroundColor: GlassTheme.colors.primary[500] + '80',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});