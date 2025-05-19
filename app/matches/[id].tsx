import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { getLocationByName, LOCATIONS } from '@/constants/Locations';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getRouteCoordinates } from '@/utils/routing';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';
import { useMatchesStore } from '../store/matches';
import { useUserStore } from '../store/user';
import { getRolePermissions } from '../types/user';

interface Location {
  latitude: number;
  longitude: number;
}

interface RouteInfo {
  coordinates: Location[];
  duration: number;
  distance: number;
}

export default function MatchDetailsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { currentUser } = useUserStore();
  const matches = useMatchesStore((state) => state.matches);
  const updateMatch = useMatchesStore((state) => state.updateMatch);
  const { t } = useTranslation();

  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [matchLocation, setMatchLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Location[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const match = matches.find((m) => m.id === id);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('📍 Permission:', status);
        
        if (status !== 'granted') {
          setLocationError('Permission to access location was denied');
          return;
        }

        // Get user's current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        });

        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        console.log('📍 User location detected', userCoords);
        setUserLocation(userCoords);

        // Get match location coordinates
        if (match) {
          const locationData = getLocationByName(match.location);
          
          if (locationData?.address) {
            const geocodeResult = await Location.geocodeAsync(locationData.address);
            
            if (geocodeResult.length > 0) {
              const matchCoords = {
                latitude: geocodeResult[0].latitude,
                longitude: geocodeResult[0].longitude,
              };
              console.log('📍 Match location found');
              setMatchLocation(matchCoords);

              // Get route coordinates
              setIsLoadingRoute(true);
              try {
                const route = await getRouteCoordinates(userCoords, matchCoords);
                console.log('📍 Route calculated with', route.coordinates.length, 'points');
                setRouteCoordinates(route.coordinates);
                setRouteInfo(route);
              } catch (error) {
                console.error('📍 Route calculation failed');
                setRouteCoordinates([userCoords, matchCoords]);
                setRouteInfo(null);
              } finally {
                setIsLoadingRoute(false);
              }
            } else {
              setLocationError('Could not find coordinates for the match location');
            }
          } else {
            setLocationError('Location address not found');
          }
        }
      } catch (error) {
        console.error('📍 Location error');
        setLocationError('Error getting location');
      }
    })();
  }, [match]);

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

  const initialRegion = {
    latitude: userLocation?.latitude || matchLocation?.latitude || 52.0671,
    longitude: userLocation?.longitude || matchLocation?.longitude || 4.3027,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{match.location}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Location Image Card */}
        <View style={[styles.imageCard, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
          <ImageBackground
            source={getLocationByName(match.location)?.image || LOCATIONS['futsal-arena-centrum'].image}
            style={styles.locationImage}
            imageStyle={styles.locationImageStyle}>
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
              style={styles.locationGradient}>
              <View style={styles.locationInfo}>
                <IconSymbol name="location.fill" size={24} color="white" />
                <Text style={styles.locationText}>{match.location}</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Match Info Card */}
        <View style={[styles.infoContainer, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
          <View style={styles.dateTimeContainer}>
            <IconSymbol name="calendar" size={24} color={colors.text} />
            <Text style={[styles.dateTime, { color: colors.text }]}>
              {new Date(match.date).toLocaleDateString('nl-NL', {month: 'short', day: 'numeric'})} • {match.time.split('T')[1].slice(0, 5)}
            </Text>
          </View>

          <View style={styles.playersContainer}>
            <IconSymbol name="person.2.fill" size={24} color={colors.text} />
            <Text style={[styles.players, { color: colors.text }]}>
              {match.players.length}/{match.maxPlayers} {t('matches.players')}
            </Text>
          </View>

          <View style={[styles.statusContainer, { backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f0f0f0' }]}>
            <View style={[styles.statusDot, { backgroundColor: match.status === 'scheduled' ? '#4CAF50' : '#FFC107' }]} />
            <Text style={[styles.status, { color: colors.text }]}>{t(`matches.status.${match.status}`)}</Text>
          </View>
        </View>

        {/* Map Card */}
        <View style={[styles.mapCard, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
          <View style={styles.mapHeader}>
            <IconSymbol name="map" size={24} color={colors.text} />
            <Text style={[styles.mapTitle, { color: colors.text }]}>{t('matches.directions')}</Text>
            {isLoadingRoute && (
              <Text style={[styles.loadingText, { color: colors.text }]}>
                {t('matches.loadingRoute')}
              </Text>
            )}
          </View>
          {locationError ? (
            <View style={styles.mapError}>
              <Text style={[styles.mapErrorText, { color: colors.text }]}>{locationError}</Text>
            </View>
          ) : (
            <>
              <MapView
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation
                showsMyLocationButton>
                {matchLocation && (
                  <Marker
                    coordinate={matchLocation}
                    title={match.location}
                    description={t('matches.matchLocation')}
                  />
                )}
                {routeCoordinates.length > 0 && (
                  <Polyline
                    coordinates={routeCoordinates}
                    strokeColor={colors.tint.default}
                    strokeWidth={4}
                    lineDashPattern={[1]}
                  />
                )}
              </MapView>
              {routeInfo && (
                <View style={styles.routeInfo}>
                  <View style={styles.routeInfoItem}>
                    <IconSymbol name="clock" size={20} color={colors.text} />
                    <Text style={[styles.routeInfoText, { color: colors.text }]}>
                      {Math.round(routeInfo.duration / 60)} min
                    </Text>
                  </View>
                  <View style={styles.routeInfoItem}>
                    <IconSymbol name="figure.walk" size={20} color={colors.text} />
                    <Text style={[styles.routeInfoText, { color: colors.text }]}>
                      {(routeInfo.distance / 1000).toFixed(1)} km
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
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
                  style={[styles.actionButton, { backgroundColor: colors.tint.default }]}
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
      </ScrollView>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  imageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationImage: {
    height: 200,
  },
  locationImageStyle: {
    opacity: 0.8,
  },
  locationGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 16,
    borderRadius: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateTime: {
    fontSize: 20,
    fontWeight: '600',
  },
  playersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  players: {
    fontSize: 18,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontSize: 16,
    textTransform: 'capitalize',
  },
  mapCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  map: {
    height: 200,
    width: '100%',
  },
  mapError: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  mapErrorText: {
    textAlign: 'center',
    fontSize: 16,
  },
  loadingText: {
    marginLeft: 'auto',
    fontSize: 14,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeInfoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 12,
    paddingBottom: 16,
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