import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { LOCATIONS } from '@/constants/Locations';
import { useColorScheme } from '@/hooks/useColorScheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';
import { useMatchesStore } from '../store/matches';
import { useUserStore } from '../store/user';
import { Match } from '../types/match';
import { getRolePermissions } from '../types/user';

export default function NewMatchScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { currentUser } = useUserStore();
  const addMatch = useMatchesStore((state) => state.addMatch);
  const { t } = useTranslation();

  const [location, setLocation] = useState(LOCATIONS[0]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [maxPlayers, setMaxPlayers] = useState('10');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const permissions = currentUser ? getRolePermissions(currentUser.role) : null;
  const canCreateMatch = permissions?.canCreateMatch;

  useEffect(() => {
    if (!currentUser || (currentUser && !canCreateMatch)) {
      const timeout = setTimeout(() => {
        router.push('/matches');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentUser, canCreateMatch]);

  const handleCreateMatch = () => {
    if (!currentUser) {
      Alert.alert(t('matches.alerts.error'), t('matches.alerts.signInRequired'));
      return;
    }

    if (!location || !date || !time || !maxPlayers) {
      Alert.alert(t('matches.alerts.error'), t('matches.alerts.fillAllFields'));
      return;
    }

    const maxPlayersNum = parseInt(maxPlayers, 10);
    if (isNaN(maxPlayersNum) || maxPlayersNum < 2 || maxPlayersNum > 20) {
      Alert.alert(t('matches.alerts.error'), t('matches.alerts.invalidPlayers'));
      return;
    }

    const newMatch: Match = {
      id: Date.now().toString(),
      location: location.name,
      date: date.toISOString().split('T')[0],
      time: time.toISOString(),
      maxPlayers: maxPlayersNum,
      players: [currentUser.id],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      status: 'scheduled' as const,
    };

    addMatch(newMatch);
    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set') {
      setDate(selectedDate || date);
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === 'set') {
      setTime(selectedTime || time);
    }
    setShowTimePicker(false);
  };

  if (!currentUser || (currentUser && !canCreateMatch)) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>{t('matches.new.title')}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.error} />
          <Text style={{ color: colors.error, fontSize: 18, fontWeight: 'bold', marginTop: 16, textAlign: 'center' }}>
            {t('matches.alerts.permissionDenied')}
          </Text>
          <Text style={{ color: colors.text, marginTop: 8, textAlign: 'center' }}>
            {t('matches.alerts.permissionDeniedSubtext') || 'You do not have permission to create a match. Redirecting...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{t('matches.new.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.formContainer}>
            <View style={[styles.formGroup, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
              <Text style={[styles.label, { color: colors.text }]}>{t('matches.new.location')}</Text>
              <View style={styles.locationContainer}>
                {Object.values(LOCATIONS).map((loc) => (
                  <Pressable
                    key={loc.id}
                    style={[
                      styles.locationButton,
                      { backgroundColor: colors.tint.darker },
                      location?.id === loc.id && { backgroundColor: colors.tint.default },
                    ]}
                    onPress={() => setLocation(loc)}>
                    <Text
                      style={[
                        styles.locationButtonText,
                        { color: location?.id === loc.id ? colors.text : colors.text },
                      ]}>
                      {loc.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={[styles.formGroup, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
              <Text style={[styles.label, { color: colors.text }]}>{t('matches.new.date')}</Text>
              <Pressable
                style={[styles.dateTimeButton, { backgroundColor: colors.tint.default }]}
                onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateTimeButtonText}>
                  {date.toLocaleDateString('nl-NL', {month: 'short', day: 'numeric'})}
                </Text>
              </Pressable>
              {showDatePicker && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    testID="datePicker"
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                </View>
              )}
            </View>

            <View style={[styles.formGroup, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
              <Text style={[styles.label, { color: colors.text }]}>{t('matches.new.time')}</Text>
              <Pressable
                style={[styles.dateTimeButton, { backgroundColor: colors.tint.default }]}
                onPress={() => setShowTimePicker(true)}>
                <Text style={styles.dateTimeButtonText}>
                  {time.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'})}
                </Text>
              </Pressable>
              {showTimePicker && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    testID="timePicker"
                    value={time}
                    mode="time"
                    display="spinner"
                    onChange={handleTimeChange}
                  />
                </View>
              )}
            </View>

            <View style={[styles.formGroup, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
              <Text style={[styles.label, { color: colors.text }]}>{t('matches.new.maxPlayers')}</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
                value={maxPlayers}
                onChangeText={setMaxPlayers}
                keyboardType="number-pad"
                placeholder={t('matches.new.maxPlayersPlaceholder')}
                placeholderTextColor={colors.tabIconDefault}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.createButtonContainer}>
        <Pressable
          style={[styles.createButton, { backgroundColor: colors.tint.default }]}
          onPress={handleCreateMatch}>
          <Text style={styles.createButtonText}>{t('matches.new.create')}</Text>
        </Pressable>
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
    borderRadius: 22,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    flex: 1,
  },
  formGroup: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateTimeButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  dateTimeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  createButtonContainer: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  createButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    marginTop: 8,
    backgroundColor: 'transparent',
  },
}); 