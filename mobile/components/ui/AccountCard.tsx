import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassTheme, glassStyles } from '../../constants/GlassTheme';

interface AccountCardProps {
  accountName: string;
  balance: number;
  accountType: string;
  currency?: string;
}

export const AccountCard = ({ 
  accountName, 
  balance, 
  accountType, 
  currency = "USD" 
}: AccountCardProps) => {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <View style={[styles.container, glassStyles.card]}>
      {/* Gradient accent (simulated with View) */}
      <View style={styles.accentGradient} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{accountName}</Text>
            <Text style={styles.accountType}>{accountType}</Text>
          </View>
          <View style={styles.iconContainer}>
            <View style={styles.iconDot} />
          </View>
        </View>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balance}>{formatBalance(balance)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: GlassTheme.spacing.lg,
    marginBottom: GlassTheme.spacing.md,
    borderRadius: GlassTheme.borderRadius.lg,
    minHeight: 140,
    overflow: 'hidden',
  },
  accentGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: GlassTheme.colors.primary[500],
    opacity: 0.2,
    borderRadius: 40,
  },
  content: {
    position: 'relative',
    zIndex: 10,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: GlassTheme.spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
    color: GlassTheme.colors.neutral[500],
    fontWeight: '500',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GlassTheme.colors.primary[500] + '33', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GlassTheme.colors.primary[500] + '66', // 40% opacity
  },
  iconDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: GlassTheme.colors.primary[500],
    ...GlassTheme.shadows.subtle,
  },
  balanceContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: GlassTheme.spacing.sm,
  },
  balance: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});