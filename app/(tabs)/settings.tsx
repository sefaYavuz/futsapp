import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../store/user';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { currentUser, setUser } = useUserStore();

  const handleSignIn = () => {
    // Hardcoded user data
    setUser({
      id: '1',
      name: 'Sefa Yavuz',
      email: 'test@example.com',
      role: 'player',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <View style={styles.content}>
        {currentUser ? (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
              <View style={[styles.settingItem, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
                <View style={styles.settingItemContent}>
                  <Text style={[styles.settingItemTitle, { color: colors.text }]}>Name</Text>
                  <Text style={[styles.settingItemValue, { color: colors.tabIconDefault }]}>{currentUser.name}</Text>
                </View>
              </View>
              <View style={[styles.settingItem, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
                <View style={styles.settingItemContent}>
                  <Text style={[styles.settingItemTitle, { color: colors.text }]}>Email</Text>
                  <Text style={[styles.settingItemValue, { color: colors.tabIconDefault }]}>{currentUser.email}</Text>
                </View>
              </View>
              <Link href="/settings/role" asChild>
                <Pressable style={[styles.settingItem, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
                  <View style={styles.settingItemContent}>
                    <Text style={[styles.settingItemTitle, { color: colors.text }]}>Role</Text>
                    <Text style={[styles.settingItemValue, { color: colors.tabIconDefault }]}>{currentUser.role}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.tabIconDefault} />
                </Pressable>
              </Link>
            </View>
            <Pressable
              style={[styles.signOutButton, { backgroundColor: '#ff3b30' }]}
              onPress={handleSignOut}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sign in to access settings</Text>
            <Pressable
              style={[styles.signInButton, { backgroundColor: colors.tint }]}
              onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingItemValue: {
    fontSize: 14,
    marginTop: 4,
  },
  signInButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 