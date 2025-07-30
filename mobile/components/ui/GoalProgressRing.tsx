import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GlassTheme } from '../../constants/GlassTheme';

interface GoalProgressRingProps {
  title: string;
  current: number;
  target: number;
  color?: string;
  size?: "sm" | "md" | "lg";
  showMilestones?: boolean;
}

export const GoalProgressRing = ({ 
  title, 
  current, 
  target, 
  color = GlassTheme.colors.primary[500],
  size = "md",
  showMilestones = true
}: GoalProgressRingProps) => {
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);
  const [scaleAnimation] = useState(new Animated.Value(1));
  const [progressAnimation] = useState(new Animated.Value(0));
  
  const percentage = Math.min((current / target) * 100, 100);
  const animatedPercentage = Math.min((animatedCurrent / target) * 100, 100);
  
  // Size configurations
  const sizeConfig = {
    sm: { 
      container: 80, 
      ring: 30, 
      text: 14, 
      amount: 16, 
      strokeWidth: 4,
      padding: 12 
    },
    md: { 
      container: 96, 
      ring: 38, 
      text: 16, 
      amount: 18, 
      strokeWidth: 6,
      padding: 16 
    },
    lg: { 
      container: 120, 
      ring: 50, 
      text: 18, 
      amount: 20, 
      strokeWidth: 8,
      padding: 20 
    }
  };
  
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.ring;
  
  // Milestone detection
  const milestones = [25, 50, 75, 90, 100];

  useEffect(() => {
    // Animate current value change
    const timer = setTimeout(() => {
      setAnimatedCurrent(current);
      
      // Animate progress
      Animated.timing(progressAnimation, {
        toValue: percentage,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [current, percentage]);
  
  useEffect(() => {
    if (showMilestones) {
      const currentMilestone = milestones.find(m => 
        animatedPercentage >= m && lastMilestone < m
      );
      
      if (currentMilestone && currentMilestone > lastMilestone) {
        setCelebrating(true);
        setLastMilestone(currentMilestone);
        
        // Celebration animation
        Animated.sequence([
          Animated.timing(scaleAnimation, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        
        const celebrationTimer = setTimeout(() => {
          setCelebrating(false);
        }, 2000);
        
        return () => clearTimeout(celebrationTimer);
      }
    }
  }, [animatedPercentage, lastMilestone, showMilestones]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const getStatusIcon = () => {
    if (percentage >= 100) return '🏆';
    if (percentage >= 75) return '🎯';
    if (percentage >= 50) return '📈';
    return '🚀';
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ scale: scaleAnimation }] },
        celebrating && styles.celebrating
      ]}
    >
      {/* Background gradient overlay */}
      <View style={styles.backgroundGradient} />
      
      {/* Progress Ring Container */}
      <View style={[styles.progressContainer, { width: config.container, height: config.container }]}>
        {/* Outer ring background */}
        <View style={[
          styles.outerRing,
          { 
            width: config.container - 10,
            height: config.container - 10,
            borderRadius: (config.container - 10) / 2,
            borderWidth: config.strokeWidth,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }
        ]} />
        
        {/* Progress ring - simplified for React Native */}
        <Animated.View style={[
          styles.progressRing,
          { 
            width: config.container - 10,
            height: config.container - 10,
            borderRadius: (config.container - 10) / 2,
            borderWidth: config.strokeWidth,
            borderColor: color,
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            transform: [
              { 
                rotate: progressAnimation.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['-90deg', `${270 - 90}deg`],
                })
              }
            ]
          }
        ]} />
        
        {/* Center content */}
        <View style={styles.centerContent}>
          <View style={styles.percentageContainer}>
            <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
            <Text style={[styles.percentage, { fontSize: config.text }]}>
              {Math.round(animatedPercentage)}%
            </Text>
          </View>
          {percentage >= 100 && (
            <Text style={styles.achievedText}>Goal!</Text>
          )}
        </View>
      </View>
      
      {/* Goal information */}
      <View style={styles.goalInfo}>
        <Text style={[styles.title, { fontSize: config.text }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.amounts}>
          <Text style={[styles.currentAmount, { fontSize: config.amount }]}>
            {formatCurrency(animatedCurrent)}
          </Text>
          <Text style={styles.targetAmount}>
            of {formatCurrency(target)}
          </Text>
          
          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: color,
                }
              ]}
            />
          </View>
        </View>
      </View>

      {/* Celebration overlay */}
      {celebrating && (
        <View style={styles.celebrationOverlay}>
          <Text style={styles.celebrationText}>🎉 Milestone Reached! 🎉</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlassTheme.colors.glass.light,
    borderRadius: GlassTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: GlassTheme.spacing.sm,
    padding: GlassTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  celebrating: {
    borderColor: GlassTheme.colors.primary[500] + '66',
    ...GlassTheme.shadows.glass,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: GlassTheme.colors.primary[500] + '05',
    borderRadius: GlassTheme.borderRadius.lg,
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: GlassTheme.spacing.lg,
  },
  outerRing: {
    position: 'absolute',
  },
  progressRing: {
    position: 'absolute',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIcon: {
    fontSize: 12,
  },
  percentage: {
    fontWeight: '700',
    color: 'white',
    fontFamily: GlassTheme.typography.mono,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  achievedText: {
    fontSize: 10,
    color: GlassTheme.colors.success,
    fontWeight: '600',
    marginTop: 2,
  },
  goalInfo: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
    marginBottom: GlassTheme.spacing.sm,
  },
  amounts: {
    gap: 4,
  },
  currentAmount: {
    fontWeight: '700',
    color: 'white',
    fontFamily: GlassTheme.typography.mono,
  },
  targetAmount: {
    fontSize: 12,
    color: GlassTheme.colors.neutral[500],
    fontFamily: GlassTheme.typography.mono,
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginTop: GlassTheme.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: GlassTheme.colors.primary[500] + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: GlassTheme.borderRadius.lg,
  },
  celebrationText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
});