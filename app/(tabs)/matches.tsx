import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Alert, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LOCATIONS, getLocationByName } from '../../constants/Locations';
import { useTranslation } from '../hooks/useTranslation';
import { useMatchesStore } from '../store/matches';
import { useUserStore } from '../store/user';
import { getRolePermissions } from '../types/user';

export default function MatchesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { currentUser } = useUserStore();
  const matches = useMatchesStore((state) => state.matches);
  const { t } = useTranslation();

  const handleAddMatch = () => {
    if (!currentUser) {
      Alert.alert(t('matches.alerts.error'), t('matches.alerts.signInRequired'));
      return;
    }

    const permissions = getRolePermissions(currentUser.role);
    if (!permissions.canCreateMatch) {
      Alert.alert(
        t('matches.alerts.error'),
        t('matches.alerts.permissionDenied'),
      );
      return;
    }

    router.push('/matches/new');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('matches.title')}</Text>
        <Pressable
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={handleAddMatch}>
          <IconSymbol name="plus" size={24} color="white" />
        </Pressable>
      </View>

      <View style={styles.content}>
        {matches.map((match) => (
          <Pressable
            key={match.id}
            style={styles.matchCard}
            onPress={() => router.push(`/matches/${match.id}`)}>
            <ImageBackground
              source={getLocationByName(match.location)?.image || LOCATIONS['futsal-arena-centrum'].image}
              style={styles.matchBackground}
              imageStyle={styles.matchBackgroundImage}>
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
                style={styles.matchGradient}>
                <View style={styles.matchContent}>
                  <View style={styles.matchHeader}>
                    <View style={styles.dateTimeContainer}>
                      <IconSymbol name="calendar" size={20} color="white" />
                      <Text style={styles.dateTime}>
                        {new Date(match.date).toLocaleDateString('nl-NL', {month: 'short', day: 'numeric'})} • {match.time.split('T')[1].slice(0, 5)}
                      </Text>
                    </View>
                    <View style={styles.locationContainer}>
                      <IconSymbol name="location.fill" size={20} color="white" />
                      <Text style={styles.location}>{match.location}</Text>
                    </View>
                  </View>

                  <View style={styles.matchFooter}>
                    <View style={styles.playersContainer}>
                      <IconSymbol name="person.2.fill" size={20} color="white" />
                      <Text style={styles.players}>
                        {match.players.length}/{match.maxPlayers} {t('matches.players')}
                      </Text>
                    </View>
                    <View style={styles.statusContainer}>
                      <View style={[styles.statusDot, { backgroundColor: match.status === 'scheduled' ? '#4CAF50' : '#FFC107' }]} />
                      <Text style={styles.status}>{t(`matches.status.${match.status}`)}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
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
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  matchCard: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchBackground: {
    flex: 1,
  },
  matchBackgroundImage: {
    borderRadius: 16,
  },
  matchGradient: {
    flex: 1,
    padding: 16,
  },
  matchContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  matchHeader: {
    gap: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTime: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  location: {
    color: 'white',
    fontSize: 16,
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  players: {
    color: 'white',
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  status: {
    color: 'white',
    fontSize: 14,
    textTransform: 'capitalize',
  },
}); 