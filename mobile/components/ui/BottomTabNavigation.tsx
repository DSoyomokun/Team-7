import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Platform,
} from 'react-native';
import { GlassTheme, glassStyles } from '../../constants/GlassTheme';

// Icons - using simple text icons for React Native compatibility
const IconComponents = {
  Dashboard: () => <Text style={styles.iconText}>📊</Text>,
  Receipt: () => <Text style={styles.iconText}>🧾</Text>,
  Target: () => <Text style={styles.iconText}>🎯</Text>,
  PiggyBank: () => <Text style={styles.iconText}>🏪</Text>,
  User: () => <Text style={styles.iconText}>👤</Text>,
};

interface TabItem {
  id: string;
  label: string;
  icon: keyof typeof IconComponents;
  badge?: number;
  href: string;
}

const tabs: TabItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "Dashboard",
    href: "/"
  },
  {
    id: "transactions", 
    label: "Transactions",
    icon: "Receipt",
    badge: 3,
    href: "/transactions"
  },
  {
    id: "goals",
    label: "Goals", 
    icon: "Target",
    href: "/goals"
  },
  {
    id: "budget",
    label: "Budget",
    icon: "PiggyBank",
    href: "/budget"
  },
  {
    id: "profile",
    label: "Profile",
    icon: "User",
    badge: 1,
    href: "/profile"
  }
];

interface BottomTabNavigationProps {
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
}

export const BottomTabNavigation = ({ 
  activeTab = "dashboard", 
  onTabPress 
}: BottomTabNavigationProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [pressedTab, setPressedTab] = useState<string | null>(null);
  const [animatedValues] = useState(() => 
    tabs.reduce((acc, tab) => {
      acc[tab.id] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  );

  const handleTabPress = (tabId: string) => {
    setPressedTab(tabId);
    setCurrentTab(tabId);
    
    // Animate press effect
    Animated.sequence([
      Animated.timing(animatedValues[tabId], {
        toValue: 0.9,
        duration: 75,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[tabId], {
        toValue: 1,
        duration: 75,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Reset pressed state
    setTimeout(() => setPressedTab(null), 150);
    
    // Call external handler if provided
    onTabPress?.(tabId);
  };

  return (
    <View style={styles.container}>
      {/* Glass morphism background */}
      <View style={[styles.tabContainer, glassStyles.card]}>
        {/* Top accent line */}
        <View style={styles.accentLine} />
        
        {/* Navigation tabs */}
        <View style={styles.tabsWrapper}>
          {tabs.map((tab) => {
            const IconComponent = IconComponents[tab.icon];
            const isActive = currentTab === tab.id;
            const isPressed = pressedTab === tab.id;
            
            return (
              <View
                key={tab.id}
                style={[
                  styles.tabItem
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleTabPress(tab.id)}
                  style={[
                    styles.tabButton,
                    isActive && styles.tabButtonActive,
                    isPressed && styles.tabButtonPressed,
                  ]}
                  activeOpacity={0.7}
                >
                  {/* Badge notification */}
                  {tab.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {tab.badge > 9 ? '9+' : tab.badge}
                      </Text>
                    </View>
                  )}
                  
                  {/* Icon */}
                  <View style={[
                    styles.iconContainer,
                    isActive && styles.iconContainerActive
                  ]}>
                    <IconComponent />
                  </View>
                  
                  {/* Label */}
                  <Text 
                    style={[
                      styles.tabLabel,
                      isActive && styles.tabLabelActive
                    ]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                  
                  {/* Active indicator glow */}
                  {isActive && (
                    <View style={styles.activeIndicator} />
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Safe area for iOS
  },
  tabContainer: {
    borderTopLeftRadius: GlassTheme.borderRadius.xl,
    borderTopRightRadius: GlassTheme.borderRadius.xl,
    borderTopWidth: 1,
    borderTopColor: GlassTheme.colors.glass.light,
    position: 'relative',
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: GlassTheme.colors.primary[500],
    opacity: 0.6,
  },
  tabsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: GlassTheme.spacing.md,
    paddingVertical: GlassTheme.spacing.md,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabButton: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: GlassTheme.spacing.sm,
    paddingHorizontal: GlassTheme.spacing.sm,
    borderRadius: GlassTheme.borderRadius.md,
    minWidth: 60,
    minHeight: 60,
  },
  tabButtonActive: {
    backgroundColor: GlassTheme.colors.primary[500] + '33',
    // Removed shadow for web compatibility
  },
  tabButtonPressed: {
    backgroundColor: GlassTheme.colors.neutral[600] + '50',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    backgroundColor: GlassTheme.colors.error,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
  },
  iconContainer: {
    marginBottom: 4,
  },
  iconContainerActive: {
    opacity: 1,
  },
  iconText: {
    fontSize: 24,
    opacity: 0.7,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: GlassTheme.colors.neutral[500],
    fontFamily: GlassTheme.typography.primary,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: GlassTheme.colors.primary[500],
    fontWeight: '600',
    // Removed text shadow for web compatibility
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: GlassTheme.colors.primary[500] + '10',
    borderRadius: GlassTheme.borderRadius.md,
  },
});