import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';
import { useMatchesStore } from '../store/matches';
import { useUserStore } from '../store/user';
import { getRolePermissions } from '../types/user';

const locations = {
  'Futsal Arena Centrum': require('@/assets/images/zuidhaghe.webp'),
  'Sportcentrum West': require('@/assets/images/zuidhaghe.webp'),
  'Futsal Club Oost': require('@/assets/images/zuidhaghe.webp'),
};

export default function MatchDetailsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { currentUser } = useUserStore();
  const matches = useMatchesStore((state) => state.matches);
  const updateMatch = useMatchesStore((state) => state.updateMatch);
  const { t } = useTranslation();

  const match = matches.find((m) => m.id === id);

  if (!match) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>{t('matches.alerts.notFound')}</Text>
      </SafeAreaView>
    );
  }

  const permissions = currentUser ? getRolePermissions(currentUser.role) : null;
  const canEdit = permissions?.canEditMatch && match.createdBy === currentUser?.id;

  const handleJoinMatch = () => {
    if (!currentUser) {
      Alert.alert(t('matches.alerts.error'), t('matches.alerts.signInRequired'));
      return;
    }

    if (match.players.length >= match.maxPlayers) {
      Alert.alert(t('matches.alerts.error'), t('matches.alerts.matchFull'));
      return;
    }

    if (match.players.includes(currentUser.id)) {
      Alert.alert(t('matches.alerts.error'), t('matches.alerts.alreadyJoined'));
      return;
    }

    updateMatch(match.id, {
      ...match,
      players: [...match.players, currentUser.id],
    });
  };

  const handleLeaveMatch = () => {
    if (!currentUser) return;

    updateMatch(match.id, {
      ...match,
      players: match.players.filter((id) => id !== currentUser.id),
    });
  };

  const handleCompleteMatch = () => {
    if (!currentUser) return;

    updateMatch(match.id, {
      ...match,
      status: 'completed',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={locations[match.location as keyof typeof locations] || locations['Futsal Arena Centrum']}
        style={styles.background}
        imageStyle={styles.backgroundImage}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
          style={styles.gradient}>
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color="white" />
            </Pressable>
            <Text style={styles.title}>{match.location}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.infoContainer}>
              <View style={styles.dateTimeContainer}>
                <IconSymbol name="calendar" size={24} color="white" />
                <Text style={styles.dateTime}>
                  {new Date(match.date).toLocaleDateString('nl-NL', {month: 'short', day: 'numeric'})} • {match.time.split('T')[1].slice(0, 5)}
                </Text>
              </View>

              <View style={styles.playersContainer}>
                <IconSymbol name="person.2.fill" size={24} color="white" />
                <Text style={styles.players}>
                  {match.players.length}/{match.maxPlayers} {t('matches.players')}
                </Text>
              </View>

              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: match.status === 'scheduled' ? '#4CAF50' : '#FFC107' }]} />
                <Text style={styles.status}>{t(`matches.status.${match.status}`)}</Text>
              </View>
            </View>

            <View style={styles.actionsContainer}>
              {match.status === 'scheduled' && (
                <>
                  {match.players.includes(currentUser?.id || '') ? (
                    <Pressable
                      style={[styles.actionButton, { backgroundColor: colors.error }]}
                      onPress={handleLeaveMatch}>
                      <Text style={styles.actionButtonText}>{t('matches.actions.leave')}</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={[styles.actionButton, { backgroundColor: colors.tint }]}
                      onPress={handleJoinMatch}>
                      <Text style={styles.actionButtonText}>{t('matches.actions.join')}</Text>
                    </Pressable>
                  )}
                </>
              )}

              {canEdit && match.status === 'scheduled' && (
                <Pressable
                  style={[styles.actionButton, { backgroundColor: colors.success }]}
                  onPress={handleCompleteMatch}>
                  <Text style={styles.actionButtonText}>{t('matches.actions.complete')}</Text>
                </Pressable>
              )}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.8,
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  infoContainer: {
    gap: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateTime: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  playersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  players: {
    color: 'white',
    fontSize: 18,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  status: {
    color: 'white',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
}); 