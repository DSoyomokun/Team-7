import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput,
  Modal,
  Switch
} from 'react-native';
import { GlassTheme, glassStyles } from '../../constants/GlassTheme';
import { supabase } from '../../src/lib/supabase';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  currency: string;
  notifications: boolean;
}

const initialProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  currency: "USD",
  notifications: true
};

// Type definitions for setting items
type SettingItem = 
  | {
      label: string;
      action: () => void;
      icon: string;
      dangerous?: boolean;
    }
  | {
      label: string;
      toggle: boolean;
      value: boolean;
      action: (value: boolean) => void;
      icon: string;
    };

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile>(initialProfile);

  const handleSaveProfile = () => {
    setProfile(editingProfile);
    setShowEditModal(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await supabase.auth.signOut();
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Feature Coming Soon", "Account deletion will be available in a future update.");
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert("Export Data", "Your financial data export will be sent to your email address.");
  };

  const settingSections = [
    {
      title: "Account Settings",
      items: [
        {
          label: "Edit Profile",
          action: () => {
            setEditingProfile(profile);
            setShowEditModal(true);
          },
          icon: "👤"
        },
        {
          label: "Change Password",
          action: () => Alert.alert("Coming Soon", "Password change feature coming soon!"),
          icon: "🔐"
        },
        {
          label: "Privacy Settings",
          action: () => Alert.alert("Coming Soon", "Privacy settings coming soon!"),
          icon: "🔒"
        }
      ]
    },
    {
      title: "App Preferences",
      items: [
        {
          label: "Notifications",
          toggle: true,
          value: profile.notifications,
          action: (value: boolean) => setProfile({...profile, notifications: value}),
          icon: "🔔"
        }
      ]
    },
    {
      title: "Data & Security",
      items: [
        {
          label: "Export Data",
          action: handleExportData,
          icon: "📤"
        },
        {
          label: "Delete Account",
          action: handleDeleteAccount,
          icon: "🗑️",
          dangerous: true
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          label: "Help Center",
          action: () => Alert.alert("Help", "Help center coming soon!"),
          icon: "❓"
        },
        {
          label: "Contact Support",
          action: () => Alert.alert("Support", "Email us at support@fintrack.com"),
          icon: "📧"
        },
        {
          label: "About",
          action: () => Alert.alert("About", "FinTrack v1.0.0\nBuilt with ❤️ by Team 7"),
          icon: "ℹ️"
        }
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          
          {/* Profile Card */}
          <View style={[styles.profileCard, glassStyles.card]}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={[styles.sectionCard, glassStyles.card]}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && styles.settingItemBorder
                  ]}
                  onPress={() => !('toggle' in item) && item.action && item.action()}
                  disabled={'toggle' in item}
                >
                  <View style={styles.settingLeft}>
                    <Text style={styles.settingIcon}>{item.icon}</Text>
                    <Text style={[
                      styles.settingLabel,
                      'dangerous' in item && item.dangerous && styles.dangerousText
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                  
                  {'toggle' in item ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.action}
                      trackColor={{ 
                        false: GlassTheme.colors.neutral[600], 
                        true: GlassTheme.colors.primary[500] 
                      }}
                      thumbColor="white"
                    />
                  ) : (
                    <Text style={styles.settingArrow}>›</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity 
            style={[styles.signOutButton, glassStyles.card]}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, glassStyles.card]}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={[styles.input, glassStyles.card]}
              value={editingProfile.name}
              onChangeText={(text) => 
                setEditingProfile({...editingProfile, name: text})
              }
              placeholder="Enter your full name"
              placeholderTextColor={GlassTheme.colors.neutral[500]}
            />

            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={[styles.input, glassStyles.card]}
              value={editingProfile.email}
              onChangeText={(text) => 
                setEditingProfile({...editingProfile, email: text})
              }
              placeholder="Enter your email"
              keyboardType="email-address"
              placeholderTextColor={GlassTheme.colors.neutral[500]}
            />

            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput
              style={[styles.input, glassStyles.card]}
              value={editingProfile.phone}
              onChangeText={(text) => 
                setEditingProfile({...editingProfile, phone: text})
              }
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor={GlassTheme.colors.neutral[500]}
            />

            <Text style={styles.fieldLabel}>Preferred Currency</Text>
            <TextInput
              style={[styles.input, glassStyles.card]}
              value={editingProfile.currency}
              onChangeText={(text) => 
                setEditingProfile({...editingProfile, currency: text.toUpperCase()})
              }
              placeholder="USD"
              maxLength={3}
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
                onPress={handleSaveProfile}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
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
  profileCard: {
    alignItems: 'center',
    padding: GlassTheme.spacing.xl,
    borderRadius: GlassTheme.borderRadius.xl,
    width: '100%',
    maxWidth: 300,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GlassTheme.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: GlassTheme.spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: GlassTheme.spacing.xs,
  },
  profileEmail: {
    fontSize: 16,
    color: GlassTheme.colors.neutral[500],
  },
  section: {
    marginBottom: GlassTheme.spacing.xl,
    paddingHorizontal: GlassTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: GlassTheme.spacing.md,
  },
  sectionCard: {
    borderRadius: GlassTheme.borderRadius.xl,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: GlassTheme.spacing.lg,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: GlassTheme.colors.neutral[700],
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: GlassTheme.spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  dangerousText: {
    color: '#ef4444',
  },
  settingArrow: {
    fontSize: 20,
    color: GlassTheme.colors.neutral[500],
    fontWeight: '300',
  },
  signOutSection: {
    paddingHorizontal: GlassTheme.spacing.lg,
    marginTop: GlassTheme.spacing.lg,
  },
  signOutButton: {
    borderRadius: GlassTheme.borderRadius.lg,
    padding: GlassTheme.spacing.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  signOutText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
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
    color: GlassTheme.colors.neutral[500],
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