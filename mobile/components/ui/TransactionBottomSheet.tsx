import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { GlassTheme, glassStyles } from '../../constants/GlassTheme';
import { apiService } from '../../src/services/api';

interface TransactionBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (transaction: TransactionData) => void;
}

interface TransactionData {
  amount: string;
  category: string;
  date: Date;
  notes: string;
  type: 'income' | 'expense';
}

const categories = [
  { id: "food", label: "Food & Dining", emoji: "🍽️" },
  { id: "transport", label: "Transport", emoji: "🚗" },
  { id: "shopping", label: "Shopping", emoji: "🛍️" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬" },
  { id: "bills", label: "Bills & Utilities", emoji: "📄" },
  { id: "health", label: "Health", emoji: "🏥" },
  { id: "education", label: "Education", emoji: "📚" },
  { id: "travel", label: "Travel", emoji: "✈️" },
];

export function TransactionBottomSheet({ isVisible, onClose, onSubmit }: TransactionBottomSheetProps) {
  const [formData, setFormData] = useState<TransactionData>({
    amount: '',
    category: '',
    date: new Date(),
    notes: '',
    type: 'expense', // Default to expense
  });
  const [errors, setErrors] = useState<Partial<TransactionData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<TransactionData> = {};
    
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('🚀 Transaction form submitted!', formData);
    if (!validateForm()) {
      console.log('❌ Form validation failed', errors);
      return;
    }
    
    setIsLoading(true);
    console.log('⏳ Starting API call...');
    
    try {
      const result = await apiService.createTransaction({
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        notes: formData.notes,
        type: formData.type,
      });
      
      if (result.success) {
        Alert.alert('Success', `$${formData.amount} ${formData.type} transaction added successfully!`);
        
        // Call the parent callback with the transaction data
        onSubmit({
          ...formData,
          amount: parseFloat(formData.amount),
        });
        
        // Reset form and close
        setFormData({ amount: '', category: '', date: new Date(), notes: '', type: 'expense' });
        setErrors({});
        onClose();
      } else {
        Alert.alert('Error', result.error || 'Failed to create transaction');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
          {/* Handle bar */}
          <View style={styles.handleBar} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Transaction</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Transaction Type Toggle */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Transaction Type</Text>
              <View style={styles.typeToggle}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    formData.type === 'expense' && styles.typeButtonSelected
                  ]}
                  onPress={() => setFormData({ ...formData, type: 'expense' })}
                >
                  <Text style={[
                    styles.typeButtonText,
                    formData.type === 'expense' && styles.typeButtonTextSelected
                  ]}>💸 Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    formData.type === 'income' && styles.typeButtonSelected
                  ]}
                  onPress={() => setFormData({ ...formData, type: 'income' })}
                >
                  <Text style={[
                    styles.typeButtonText,
                    formData.type === 'income' && styles.typeButtonTextSelected
                  ]}>💰 Income</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={GlassTheme.colors.neutral[500]}
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                  keyboardType="decimal-pad"
                />
              </View>
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      formData.category === category.id && styles.categoryButtonSelected
                    ]}
                    onPress={() => setFormData({ ...formData, category: category.id })}
                  >
                    <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            {/* Notes Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Add a note..."
                placeholderTextColor={GlassTheme.colors.neutral[500]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!formData.amount || !formData.category || isLoading) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!formData.amount || !formData.category || isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>Adding...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>
                  Add {formData.type === 'income' ? 'Income' : 'Expense'}
                  {selectedCategory && ` ${selectedCategory.emoji}`}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: GlassTheme.colors.glass.dark,
    borderTopLeftRadius: GlassTheme.borderRadius.xl,
    borderTopRightRadius: GlassTheme.borderRadius.xl,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: GlassTheme.colors.glass.light,
    ...GlassTheme.shadows.glass,
  },
  handleBar: {
    width: 48,
    height: 6,
    backgroundColor: GlassTheme.colors.neutral[500],
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: GlassTheme.spacing.md,
    marginBottom: GlassTheme.spacing.sm,
    opacity: 0.3,
  },
  header: {
    alignItems: 'center',
    paddingBottom: GlassTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: GlassTheme.colors.glass.light,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
    textShadowColor: GlassTheme.colors.primary[500],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  content: {
    padding: GlassTheme.spacing.lg,
  },
  inputGroup: {
    marginBottom: GlassTheme.spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: GlassTheme.colors.neutral[500],
    marginBottom: GlassTheme.spacing.sm,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GlassTheme.colors.glass.light,
    borderRadius: GlassTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: GlassTheme.colors.glass.light,
    paddingVertical: GlassTheme.spacing.lg,
    paddingHorizontal: GlassTheme.spacing.md,
  },
  dollarSign: {
    fontSize: 24,
    fontWeight: '600',
    color: GlassTheme.colors.neutral[500],
    fontFamily: GlassTheme.typography.mono,
    marginRight: GlassTheme.spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    fontFamily: GlassTheme.typography.mono,
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GlassTheme.spacing.sm,
  },
  categoryButton: {
    backgroundColor: GlassTheme.colors.glass.light,
    borderRadius: GlassTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: GlassTheme.colors.glass.light,
    padding: GlassTheme.spacing.md,
    width: '48%',
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: GlassTheme.colors.primary[500] + '33',
    borderColor: GlassTheme.colors.primary[500] + '66',
    ...GlassTheme.shadows.subtle,
  },
  categoryEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
  notesInput: {
    backgroundColor: GlassTheme.colors.glass.light,
    borderRadius: GlassTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: GlassTheme.colors.glass.light,
    padding: GlassTheme.spacing.md,
    fontSize: 16,
    color: 'white',
    fontFamily: GlassTheme.typography.body,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: GlassTheme.colors.primary[500],
    borderRadius: GlassTheme.borderRadius.lg,
    paddingVertical: GlassTheme.spacing.lg,
    paddingHorizontal: GlassTheme.spacing.xl,
    alignItems: 'center',
    marginTop: GlassTheme.spacing.lg,
    ...GlassTheme.shadows.glass,
  },
  submitButtonDisabled: {
    backgroundColor: GlassTheme.colors.neutral[600],
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
  },
  errorText: {
    color: GlassTheme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: GlassTheme.colors.glass.light,
    borderRadius: GlassTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: GlassTheme.colors.glass.light,
    overflow: 'hidden',
  },
  typeButton: {
    flex: 1,
    paddingVertical: GlassTheme.spacing.md,
    paddingHorizontal: GlassTheme.spacing.lg,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  typeButtonSelected: {
    backgroundColor: GlassTheme.colors.primary[500] + '33',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: GlassTheme.colors.neutral[500],
    fontFamily: GlassTheme.typography.primary,
  },
  typeButtonTextSelected: {
    color: 'white',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});