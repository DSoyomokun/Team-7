import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassTheme } from '../../constants/GlassTheme';

interface TransactionItemProps {
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
}

export const TransactionItem = ({
  description,
  amount,
  date,
  category,
  type
}: TransactionItemProps) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[
          styles.indicator,
          { backgroundColor: type === "income" ? GlassTheme.colors.success : GlassTheme.colors.error }
        ]} />
        <View style={styles.transactionInfo}>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.category}>{category}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
      </View>
      
      <Text style={[
        styles.amount,
        { color: type === "income" ? GlassTheme.colors.success : GlassTheme.colors.error }
      ]}>
        {type === "income" ? "+" : "-"}{formatAmount(amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: GlassTheme.spacing.md,
    borderRadius: GlassTheme.borderRadius.md,
    backgroundColor: GlassTheme.colors.glass.light,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: GlassTheme.spacing.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: GlassTheme.spacing.md,
    // Removed shadow for web compatibility
  },
  transactionInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: GlassTheme.colors.neutral[500],
    fontWeight: '500',
  },
  separator: {
    fontSize: 14,
    color: GlassTheme.colors.neutral[500],
    marginHorizontal: GlassTheme.spacing.xs,
  },
  date: {
    fontSize: 14,
    color: GlassTheme.colors.neutral[500],
    fontWeight: '500',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: GlassTheme.typography.primary,
    // Removed text shadow for web compatibility
  },
});