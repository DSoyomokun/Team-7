import React, { useState } from 'react';
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
import { GoalProgressRing } from '../../components/ui/GoalProgressRing';

interface Goal {
  id: number;
  title: string;
  current: number;
  target: number;
  color: string;
  description?: string;
}

const initialGoals: Goal[] = [
  {
    id: 1,
    title: "Emergency Fund",
    current: 8500,
    target: 15000,
    color: "hsl(267, 84%, 81%)",
    description: "Build a 6-month emergency fund"
  },
  {
    id: 2,
    title: "Vacation",
    current: 2300,
    target: 5000,
    color: "hsl(285, 35%, 60%)",
    description: "Save for Europe trip next summer"
  },
  {
    id: 3,
    title: "New Car",
    current: 12000,
    target: 25000,
    color: "hsl(300, 100%, 75%)",
    description: "Down payment for new car"
  }
];

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({});

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const goal: Goal = {
      id: Date.now(),
      title: newGoal.title,
      current: newGoal.current || 0,
      target: newGoal.target,
      color: newGoal.color || "hsl(200, 50%, 70%)",
      description: newGoal.description || ""
    };

    setGoals([...goals, goal]);
    setNewGoal({});
    setShowAddModal(false);
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowEditModal(true);
  };

  const handleUpdateGoal = () => {
    if (!selectedGoal) return;
    
    setGoals(goals.map(g => 
      g.id === selectedGoal.id ? selectedGoal : g
    ));
    setShowEditModal(false);
    setSelectedGoal(null);
  };

  const handleDeleteGoal = (goalId: number) => {
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete this goal?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setGoals(goals.filter(g => g.id !== goalId));
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

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Financial Goals</Text>
        <View style={[styles.summaryCard, glassStyles.card]}>
          <Text style={styles.summaryLabel}>Total Progress</Text>
          <Text style={styles.summaryText}>
            {formatCurrency(totalSaved)} / {formatCurrency(totalTarget)}
          </Text>
          <Text style={styles.percentageText}>
            {Math.round((totalSaved / totalTarget) * 100)}% Complete
          </Text>
        </View>
      </View>

      {/* Add Goal Button */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={[styles.addButton, glassStyles.card]}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add New Goal</Text>
        </TouchableOpacity>
      </View>

      {/* Goals List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {goals.length === 0 ? (
          <View style={[styles.emptyContainer, glassStyles.card]}>
            <Text style={styles.emptyText}>No goals yet!</Text>
            <Text style={styles.emptySubtext}>Add your first financial goal to get started</Text>
          </View>
        ) : (
          goals.map((goal) => (
            <View key={goal.id} style={[styles.goalCard, glassStyles.card]}>
              <View style={styles.goalHeader}>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  {goal.description && (
                    <Text style={styles.goalDescription}>{goal.description}</Text>
                  )}
                </View>
                <View style={styles.goalActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditGoal(goal)}
                  >
                    <Text style={styles.actionButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteGoal(goal.id)}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.goalProgress}>
                <GoalProgressRing
                  title=""
                  current={goal.current}
                  target={goal.target}
                  color={goal.color}
                />
                <View style={styles.goalStats}>
                  <Text style={styles.goalCurrent}>{formatCurrency(goal.current)}</Text>
                  <Text style={styles.goalTarget}>of {formatCurrency(goal.target)}</Text>
                  <Text style={styles.goalPercentage}>
                    {Math.round((goal.current / goal.target) * 100)}% Complete
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, glassStyles.card]}>
            <Text style={styles.modalTitle}>Add New Goal</Text>
            
            <Text style={styles.fieldLabel}>Goal Title *</Text>
            <TextInput
              style={[styles.input, glassStyles.card]}
              value={newGoal.title || ''}
              onChangeText={(text) => setNewGoal({...newGoal, title: text})}
              placeholder="e.g., Emergency Fund"
              placeholderTextColor={GlassTheme.colors.neutral[500]}
            />

            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.input, glassStyles.card]}
              value={newGoal.description || ''}
              onChangeText={(text) => setNewGoal({...newGoal, description: text})}
              placeholder="Optional description"
              placeholderTextColor={GlassTheme.colors.neutral[500]}
            />

            <Text style={styles.fieldLabel}>Target Amount *</Text>
            <TextInput
              style={[styles.input, glassStyles.card]}
              value={newGoal.target?.toString() || ''}
              onChangeText={(text) => setNewGoal({...newGoal, target: parseFloat(text) || 0})}
              placeholder="e.g., 10000"
              keyboardType="numeric"
              placeholderTextColor={GlassTheme.colors.neutral[500]}
            />

            <Text style={styles.fieldLabel}>Current Amount</Text>
            <TextInput
              style={[styles.input, glassStyles.card]}
              value={newGoal.current?.toString() || '0'}
              onChangeText={(text) => setNewGoal({...newGoal, current: parseFloat(text) || 0})}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={GlassTheme.colors.neutral[500]}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewGoal({});
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddGoal}
              >
                <Text style={styles.modalButtonText}>Add Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Goal Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, glassStyles.card]}>
            <Text style={styles.modalTitle}>Edit Goal</Text>
            
            {selectedGoal && (
              <>
                <Text style={styles.fieldLabel}>Goal Title</Text>
                <TextInput
                  style={[styles.input, glassStyles.card]}
                  value={selectedGoal.title}
                  onChangeText={(text) => 
                    setSelectedGoal({...selectedGoal, title: text})
                  }
                  placeholderTextColor={GlassTheme.colors.neutral[500]}
                />

                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.input, glassStyles.card]}
                  value={selectedGoal.description || ''}
                  onChangeText={(text) => 
                    setSelectedGoal({...selectedGoal, description: text})
                  }
                  placeholderTextColor={GlassTheme.colors.neutral[500]}
                />

                <Text style={styles.fieldLabel}>Target Amount</Text>
                <TextInput
                  style={[styles.input, glassStyles.card]}
                  value={selectedGoal.target.toString()}
                  onChangeText={(text) => 
                    setSelectedGoal({...selectedGoal, target: parseFloat(text) || 0})
                  }
                  keyboardType="numeric"
                  placeholderTextColor={GlassTheme.colors.neutral[500]}
                />

                <Text style={styles.fieldLabel}>Current Amount</Text>
                <TextInput
                  style={[styles.input, glassStyles.card]}
                  value={selectedGoal.current.toString()}
                  onChangeText={(text) => 
                    setSelectedGoal({...selectedGoal, current: parseFloat(text) || 0})
                  }
                  keyboardType="numeric"
                  placeholderTextColor={GlassTheme.colors.neutral[500]}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setShowEditModal(false);
                      setSelectedGoal(null);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleUpdateGoal}
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
    alignItems: 'center',
    minWidth: 250,
  },
  summaryLabel: {
    fontSize: 16,
    color: GlassTheme.colors.neutral[500],
    fontWeight: '500',
    marginBottom: GlassTheme.spacing.xs,
  },
  summaryText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
    marginBottom: GlassTheme.spacing.xs,
  },
  percentageText: {
    fontSize: 14,
    color: GlassTheme.colors.primary[400],
    fontWeight: '600',
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
    gap: GlassTheme.spacing.lg,
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
  goalCard: {
    borderRadius: GlassTheme.borderRadius.xl,
    padding: GlassTheme.spacing.lg,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: GlassTheme.spacing.lg,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: GlassTheme.spacing.xs,
  },
  goalDescription: {
    fontSize: 14,
    color: GlassTheme.colors.neutral[400],
  },
  goalActions: {
    flexDirection: 'row',
    gap: GlassTheme.spacing.xs,
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
    backgroundColor: '#ef4444' + '40',
  },
  actionButtonText: {
    fontSize: 16,
  },
  goalProgress: {
    alignItems: 'center',
  },
  goalStats: {
    alignItems: 'center',
    marginTop: GlassTheme.spacing.md,
  },
  goalCurrent: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
  },
  goalTarget: {
    fontSize: 16,
    color: GlassTheme.colors.neutral[400],
    marginTop: GlassTheme.spacing.xs,
  },
  goalPercentage: {
    fontSize: 14,
    color: GlassTheme.colors.primary[400],
    fontWeight: '600',
    marginTop: GlassTheme.spacing.xs,
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