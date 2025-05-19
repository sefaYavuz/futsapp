import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../store/user';
import { UserRole } from '../types/user';

export default function RoleScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { currentUser, updateUserRole } = useUserStore();

  const handleRoleChange = (role: UserRole) => {
    updateUserRole(role);
    router.back();
  };

  const roles: { role: UserRole; label: string; description: string }[] = [
    {
      role: 'player',
      label: 'Player',
      description: 'Join games and track your performance',
    },
    {
      role: 'organizer',
      label: 'Organizer',
      description: 'Create and manage games',
    },
    {
      role: 'admin',
      label: 'Admin',
      description: 'Full access to all features',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Select Role</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {roles.map(({ role, label, description }) => (
          <Pressable
            key={role}
            style={[
              styles.roleCard,
              {
                backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff',
                borderColor: currentUser?.role === role ? colors.tint.default : 'transparent',
              },
            ]}
            onPress={() => handleRoleChange(role)}>
            <View style={styles.roleHeader}>
              <Text style={[styles.roleLabel, { color: colors.text }]}>{label}</Text>
              {currentUser?.role === role && (
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.tint.default} />
              )}
            </View>
            <Text style={[styles.roleDescription, { color: colors.tabIconDefault }]}>
              {description}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  roleCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  roleDescription: {
    fontSize: 16,
  },
}); 