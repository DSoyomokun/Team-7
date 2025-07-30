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

interface BudgetCategory {
  id: number;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

const initialBudgetCategories: BudgetCategory[] = [
  {
    id: 1,
    name: "Food & Dining",
    budgeted: 600,
    spent: 485.32,
    color: "#4ade80"
  },
  {
    id: 2,
    name: "Transportation",
    budgeted: 300,
    spent: 245.20,
    color: "#60a5fa"
  },
  {
    id: 3,
    name: "Entertainment",
    budgeted: 200,
    spent: 215.99,
    color: "#f87171"
  },
  {
    id: 4,
    name: "Shopping",
    budgeted: 400,
    spent: 156.45,
    color: "#a78bfa"
  },
  {
    id: 5,
    name: "Utilities",
    budgeted: 250,
    spent: 240.00,
    color: "#fbbf24"
  },
  {
    id: 6,
    name: "Healthcare",
    budgeted: 150,
    spent: 85.00,
    color: "#34d399"
  }
];

export default function BudgetScreen() {
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(initialBudgetCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<BudgetCategory>>({});
  const [forceUpdate, setForceUpdate] = useState(0);

  // Monitor state changes
  useEffect(() => {
    console.log('Budget categories state updated:', budgetCategories.length);
  }, [budgetCategories]);

  // Force re-render when needed
  const forceReRender = () => {
    setForceUpdate(prev => prev + 1);
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.budgeted) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const category: BudgetCategory = {
      id: Date.now(),
      name: newCategory.name,
      budgeted: newCategory.budgeted,
      spent: newCategory.spent || 0,
      color: newCategory.color || "#60a5fa"
    };

    setBudgetCategories([...budgetCategories, category]);
    setNewCategory({});
    setShowAddModal(false);
  };

  const handleEditCategory = (category: BudgetCategory) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleUpdateCategory = () => {
    if (!selectedCategory) return;
    
    setBudgetCategories(budgetCategories.map(c => 
      c.id === selectedCategory.id ? selectedCategory : c
    ));
    setShowEditModal(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (categoryId: number) => {
    console.log('Delete button pressed for category ID:', categoryId);
    console.log('Current categories before delete:', budgetCategories.length);
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this budget category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log('Delete confirmed for category ID:', categoryId);
            const updatedCategories = budgetCategories.filter(c => c.id !== categoryId);
            console.log('Categories after filter:', updatedCategories.length);
            setBudgetCategories(updatedCategories);
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
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalBudgeted = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalBudgeted - totalSpent;

  const getBudgetStatus = (category: BudgetCategory) => {
    const percentage = (category.spent / category.budgeted) * 100;
    if (percentage >= 100) return 'over';
    if (percentage >= 80) return 'warning';
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Budget Overview</Text>
        <View style={[styles.summaryCard, glassStyles.card]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Budgeted</Text>
              <Text style={[styles.summaryAmount, { color: '#60a5fa' }]}>
                {formatCurrency(totalBudgeted)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Spent</Text>
              <Text style={[styles.summaryAmount, { color: totalSpent > totalBudgeted ? '#ef4444' : '#10b981' }]}>
                {formatCurrency(totalSpent)}
              </Text>
            </View>
          </View>
          <View style={styles.remainingContainer}>
            <Text style={styles.remainingLabel}>Remaining</Text>
            <Text style={[styles.remainingAmount, { color: remaining >= 0 ? '#10b981' : '#ef4444' }]}>
              {formatCurrency(remaining)}
            </Text>
          </View>
        </View>
      </View>

      {/* Add Category Button */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={[styles.addButton, glassStyles.card]}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add Budget Category</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.addButton, glassStyles.card, { backgroundColor: '#ef4444' + '40' }]}
          onPress={() => {
            console.log('Test delete - current categories:', budgetCategories.length);
            if (budgetCategories.length > 0) {
              handleDeleteCategory(budgetCategories[0].id);
            }
          }}
        >
          <Text style={styles.addButtonText}>Test Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Budget Categories List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {budgetCategories.length === 0 ? (
          <View style={[styles.emptyContainer, glassStyles.card]}>
            <Text style={styles.emptyText}>No budget categories yet!</Text>
            <Text style={styles.emptySubtext}>Add your first budget category to start tracking</Text>
          </View>
        ) : (
          budgetCategories.map((category) => {
            const status = getBudgetStatus(category);
            const percentage = Math.min((category.spent / category.budgeted) * 100, 100);
            
            return (
              <View key={`${category.id}-${forceUpdate}`} style={[styles.categoryCard, glassStyles.card]}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryAmount}>
                      {formatCurrency(category.spent)} / {formatCurrency(category.budgeted)}
                    </Text>
                  </View>
                  <View style={styles.categoryActions}>
                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(status) }]} />
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => handleEditCategory(category)}
                    >
                      <Text style={styles.actionButtonText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteCategory(category.id)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={styles.actionButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { 
                          width: `${percentage}%`, 
                          backgroundColor: getStatusColor(status) 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.percentageText, { color: getStatusColor(status) }]}>
                    {Math.round(percentage)}%
                  </Text>
                </View>
                
                <Text style={styles.remainingText}>
                  {category.budgeted - category.spent >= 0 
                    ? `${formatCurrency(category.budgeted - category.spent)} remaining`
                    : `${formatCurrency(Math.abs(category.budgeted - category.spent))} over budget`
                  }
                </Text>
              </View>
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Category Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, glassStyles.card]}>
            <Text style={styles.modalTitle}>Add Budget Category</Text>
            
            <Text style={styles.fieldLabel}>Category Name *</Text>
            <TextInput
              style={[styles.input, glassStyles.card]}
              value={newCategory.name || ''}
              onChangeText={(text) => setNewCategory({...newCategory, name: text})}
              placeholder="e.g., Groceries"
              placeholderTextColor={GlassTheme.colors.neutral[500]}
            />

            <Text style={styles.fieldLabel}>Budget Amount *</Text>
            <TextInput
              style={[styles.input, glassStyles.card]}
              value={newCategory.budgeted?.toString() || ''}
              onChangeText={(text) => setNewCategory({...newCategory, budgeted: parseFloat(text) || 0})}
              placeholder="e.g., 500"
              keyboardType="numeric"
              placeholderTextColor={GlassTheme.colors.neutral[500]}
            />

            <Text style={styles.fieldLabel}>Already Spent (optional)</Text>
            <TextInput
              style={[styles.input, glassStyles.card]}
              value={newCategory.spent?.toString() || '0'}
              onChangeText={(text) => setNewCategory({...newCategory, spent: parseFloat(text) || 0})}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={GlassTheme.colors.neutral[500]}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewCategory({});
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddCategory}
              >
                <Text style={styles.modalButtonText}>Add Category</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, glassStyles.card]}>
            <Text style={styles.modalTitle}>Edit Budget Category</Text>
            
            {selectedCategory && (
              <>
                <Text style={styles.fieldLabel}>Category Name</Text>
                <TextInput
                  style={[styles.input, glassStyles.card]}
                  value={selectedCategory.name}
                  onChangeText={(text) => 
                    setSelectedCategory({...selectedCategory, name: text})
                  }
                  placeholderTextColor={GlassTheme.colors.neutral[500]}
                />

                <Text style={styles.fieldLabel}>Budget Amount</Text>
                <TextInput
                  style={[styles.input, glassStyles.card]}
                  value={selectedCategory.budgeted.toString()}
                  onChangeText={(text) => 
                    setSelectedCategory({...selectedCategory, budgeted: parseFloat(text) || 0})
                  }
                  keyboardType="numeric"
                  placeholderTextColor={GlassTheme.colors.neutral[500]}
                />

                <Text style={styles.fieldLabel}>Amount Spent</Text>
                <TextInput
                  style={[styles.input, glassStyles.card]}
                  value={selectedCategory.spent.toString()}
                  onChangeText={(text) => 
                    setSelectedCategory({...selectedCategory, spent: parseFloat(text) || 0})
                  }
                  keyboardType="numeric"
                  placeholderTextColor={GlassTheme.colors.neutral[500]}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setShowEditModal(false);
                      setSelectedCategory(null);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleUpdateCategory}
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
  summaryCard: {
    padding: GlassTheme.spacing.lg,
    borderRadius: GlassTheme.borderRadius.lg,
    width: '100%',
    maxWidth: 350,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: GlassTheme.spacing.md,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: GlassTheme.colors.neutral[500],
    fontWeight: '500',
    marginBottom: GlassTheme.spacing.xs,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: GlassTheme.typography.primary,
  },
  remainingContainer: {
    alignItems: 'center',
    paddingTop: GlassTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: GlassTheme.colors.neutral[700],
  },
  remainingLabel: {
    fontSize: 16,
    color: GlassTheme.colors.neutral[400],
    fontWeight: '500',
    marginBottom: GlassTheme.spacing.xs,
  },
  remainingAmount: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: GlassTheme.typography.primary,
  },
  actionBar: {
    paddingHorizontal: GlassTheme.spacing.lg,
    marginBottom: GlassTheme.spacing.lg,
  },
  addButton: {
    borderRadius: GlassTheme.borderRadius.lg,
    padding: GlassTheme.spacing.md,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: GlassTheme.colors.primary[400],
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: GlassTheme.spacing.lg,
    gap: GlassTheme.spacing.md,
  },
  emptyContainer: {
    padding: GlassTheme.spacing.xxl,
    alignItems: 'center',
    borderRadius: GlassTheme.borderRadius.xl,
  },
  emptyText: {
    fontSize: 20,
    color: GlassTheme.colors.neutral[400],
    fontWeight: '600',
    marginBottom: GlassTheme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 16,
    color: GlassTheme.colors.neutral[500],
    textAlign: 'center',
  },
  categoryCard: {
    borderRadius: GlassTheme.borderRadius.xl,
    padding: GlassTheme.spacing.lg,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: GlassTheme.spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: GlassTheme.spacing.xs,
  },
  categoryAmount: {
    fontSize: 16,
    color: GlassTheme.colors.neutral[400],
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GlassTheme.spacing.xs,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: GlassTheme.spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: GlassTheme.spacing.sm,
    gap: GlassTheme.spacing.md,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: GlassTheme.colors.neutral[700],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  remainingText: {
    fontSize: 14,
    color: GlassTheme.colors.neutral[500],
    fontStyle: 'italic',
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
    maxHeight: '80%',
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