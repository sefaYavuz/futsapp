import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';
import { useMatchesStore } from '../store/matches';
import { useStatsStore } from '../store/stats';
import { useUserStore } from '../store/user';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // Full width minus padding

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const matches = useMatchesStore((state) => state.matches);
  const { currentUser } = useUserStore();
  const { stats } = useStatsStore();
  const { t } = useTranslation();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Filter upcoming match
  const upcomingMatches = matches
    .filter((match) => {
      const matchDate = new Date(`${match.date}T${match.time}`);
      return matchDate > new Date();
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);

  const handleCreateMatch = () => {
    router.push('/matches/new');
  };

  const handleViewMatches = () => {
    router.push('/matches');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Welcome Section */}
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
          paddingHorizontal: 0,
          paddingTop: 24,
          paddingBottom: 24
        }}>
          <View
            style={{ 
              borderRadius: 0, 
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
              backgroundColor: colors.tint.default,
            }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>
              {currentUser ? t('home.welcomeWithName').replace('{{name}}', currentUser.name) : t('home.welcome')}
            </Text>
            <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)' }}>
              {t('home.welcomeSubtext')}
            </Text>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
          paddingHorizontal: 24,
          marginBottom: 32
        }}>
          <Text style={{ fontSize: 24, fontWeight: '600', color: colorScheme === 'dark' ? 'white' : '#0f172a', marginBottom: 20 }}>
            {t('home.actions.quickActions')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Pressable
              onPress={handleCreateMatch}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: colorScheme === 'dark' ? '#1e293b' : 'white',
                borderRadius: 20,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}>
              <LinearGradient
                colors={['#16a34a', '#15803d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <IconSymbol name="plus" size={32} color="white" />
              </LinearGradient>
              <Text style={{ color: colorScheme === 'dark' ? 'white' : '#0f172a', fontWeight: '600', fontSize: 18 }}>
                {t('home.actions.createMatch')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleViewMatches}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: colorScheme === 'dark' ? '#1e293b' : 'white',
                borderRadius: 20,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}>
              <LinearGradient
                colors={['#16a34a', '#15803d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <IconSymbol name="calendar" size={32} color="white" />
              </LinearGradient>
              <Text style={{ color: colorScheme === 'dark' ? 'white' : '#0f172a', fontWeight: '600', fontSize: 18 }}>
                {t('home.actions.viewMatches')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/settings')}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: colorScheme === 'dark' ? '#1e293b' : 'white',
                borderRadius: 20,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}>
              <LinearGradient
                colors={['#16a34a', '#15803d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <IconSymbol name="gearshape" size={32} color="white" />
              </LinearGradient>
              <Text style={{ color: colorScheme === 'dark' ? 'white' : '#0f172a', fontWeight: '600', fontSize: 18 }}>
                {t('common.settings')}
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* User Stats - Temporarily disabled
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
          paddingHorizontal: 24,
          marginBottom: 32
        }}>
          <StyledText style={{ fontSize: 24, fontWeight: '600', color: colorScheme === 'dark' ? 'white' : '#0f172a', marginBottom: 20 }}>
            Your Stats
          </StyledText>
          <StyledView style={{ 
            backgroundColor: colorScheme === 'dark' ? '#1e293b' : 'white', 
            borderRadius: 20, 
            padding: 32,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            width: CARD_WIDTH,
          }}>
            <StyledView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
              <StyledView style={{ alignItems: 'center', flex: 1 }}>
                <LinearGradient
                  colors={['#16a34a', '#15803d']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <IconSymbol name="soccerball" size={32} color="white" />
                </LinearGradient>
                <StyledText style={{ color: colorScheme === 'dark' ? 'white' : '#0f172a', fontWeight: '600', fontSize: 24 }}>
                  {stats.goals}
                </StyledText>
                <StyledText style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 14 }}>
                  Goals
                </StyledText>
              </StyledView>

              <StyledView style={{ alignItems: 'center', flex: 1 }}>
                <LinearGradient
                  colors={['#16a34a', '#15803d']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <IconSymbol name="hand.thumbsup" size={32} color="white" />
                </LinearGradient>
                <StyledText style={{ color: colorScheme === 'dark' ? 'white' : '#0f172a', fontWeight: '600', fontSize: 24 }}>
                  {stats.assists}
                </StyledText>
                <StyledText style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 14 }}>
                  Assists
                </StyledText>
              </StyledView>

              <StyledView style={{ alignItems: 'center', flex: 1 }}>
                <LinearGradient
                  colors={['#16a34a', '#15803d']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <IconSymbol name="trophy" size={32} color="white" />
                </LinearGradient>
                <StyledText style={{ color: colorScheme === 'dark' ? 'white' : '#0f172a', fontWeight: '600', fontSize: 24 }}>
                  {stats.gamesPlayed}
                </StyledText>
                <StyledText style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 14 }}>
                  Games
                </StyledText>
              </StyledView>
            </StyledView>

            <StyledView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <StyledView style={{ alignItems: 'center', flex: 1 }}>
                <LinearGradient
                  colors={['#16a34a', '#15803d']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <IconSymbol name="star" size={32} color="white" />
                </LinearGradient>
                <StyledText style={{ color: colorScheme === 'dark' ? 'white' : '#0f172a', fontWeight: '600', fontSize: 24 }}>
                  {stats.rating.toFixed(1)}
                </StyledText>
                <StyledText style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 14 }}>
                  Rating
                </StyledText>
              </StyledView>

              <StyledView style={{ alignItems: 'center', flex: 1 }}>
                <LinearGradient
                  colors={['#16a34a', '#15803d']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <IconSymbol name="flame" size={32} color="white" />
                </LinearGradient>
                <StyledText style={{ color: colorScheme === 'dark' ? 'white' : '#0f172a', fontWeight: '600', fontSize: 24 }}>
                  {stats.currentStreak}
                </StyledText>
                <StyledText style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 14 }}>
                  Streak
                </StyledText>
              </StyledView>

              <StyledView style={{ alignItems: 'center', flex: 1 }}>
                <LinearGradient
                  colors={['#16a34a', '#15803d']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <IconSymbol name="medal" size={32} color="white" />
                </LinearGradient>
                <StyledText style={{ color: colorScheme === 'dark' ? 'white' : '#0f172a', fontWeight: '600', fontSize: 24 }}>
                  {stats.mvpCount}
                </StyledText>
                <StyledText style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 14 }}>
                  MVP
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledView>
        </Animated.View>
        */}

        {/* Upcoming Matches */}
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
          paddingHorizontal: 24,
          marginBottom: 32
        }}>
          <Text style={{ fontSize: 24, fontWeight: '600', color: colorScheme === 'dark' ? 'white' : '#0f172a', marginBottom: 20 }}>
            {t('home.upcomingMatches')}
          </Text>
          {upcomingMatches.length > 0 ? (
            upcomingMatches.map((match) => (
              <Pressable
                key={match.id}
                onPress={() => router.push(`/matches/${match.id}`)}
                style={({ pressed }) => ({
                  backgroundColor: colorScheme === 'dark' ? '#1e293b' : 'white',
                  borderRadius: 20,
                  padding: 24,
                  marginBottom: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ color: colorScheme === 'dark' ? 'white' : '#0f172a', fontWeight: '600', fontSize: 18 }}>
                    {match.location}
                  </Text>
                  <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 14 }}>
                    {new Date(`${match.date}T${match.time}`).toLocaleDateString('nl-NL')} {match.time}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconSymbol name="person" size={16} color={colorScheme === 'dark' ? '#94a3b8' : '#64748b'} />
                  <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 14, marginLeft: 8 }}>
                    {match.players.length} {t('matches.players')}
                  </Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={{ 
              backgroundColor: colorScheme === 'dark' ? '#1e293b' : 'white',
              borderRadius: 20,
              padding: 32,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <IconSymbol name="calendar" size={48} color={colorScheme === 'dark' ? '#94a3b8' : '#64748b'} />
              <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', textAlign: 'center', fontSize: 16, marginTop: 16 }}>
                {t('home.noUpcomingMatches')}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Futsal Tip */}
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
          paddingHorizontal: 24,
          marginBottom: 32
        }}>
          <Text style={{ fontSize: 24, fontWeight: '600', color: colorScheme === 'dark' ? 'white' : '#0f172a', marginBottom: 20 }}>
            {t('home.futsalTip')}
          </Text>
          <View style={{ 
            backgroundColor: colorScheme === 'dark' ? '#1e293b' : 'white',
            borderRadius: 20,
            padding: 32,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            width: CARD_WIDTH,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <LinearGradient
                colors={['#16a34a', '#15803d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <IconSymbol name="lightbulb" size={32} color="white" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colorScheme === 'dark' ? 'white' : '#0f172a', fontWeight: '600', fontSize: 20, marginBottom: 12 }}>
                  {t('home.futsalTipTitle')}
                </Text>
                <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 16, lineHeight: 24 }}>
                  {t('home.futsalTipText')}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
