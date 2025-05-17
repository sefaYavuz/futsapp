import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';
import { useMatchesStore } from '../store/matches';
import { useUserStore } from '../store/user';
import { Match } from '../types/match';

const locations = [
  'Futsal Arena Centrum',
  'Sportcentrum West',
  'Futsal Club Oost',
];

export default function NewMatchScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { currentUser } = useUserStore();
  const addMatch = useMatchesStore((state) => state.addMatch);
  const { t } = useTranslation();

  const [location, setLocation] = useState(locations[0]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [maxPlayers, setMaxPlayers] = useState('10');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
      location,
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{t('matches.new.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={[styles.formGroup, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
          <Text style={[styles.label, { color: colors.text }]}>{t('matches.new.location')}</Text>
          <View style={styles.locationContainer}>
            {locations.map((loc) => (
              <Pressable
                key={loc}
                style={[
                  styles.locationButton,
                  location === loc && { backgroundColor: colors.tint },
                ]}
                onPress={() => setLocation(loc)}>
                <Text
                  style={[
                    styles.locationButtonText,
                    { color: location === loc ? 'white' : colors.text },
                  ]}>
                  {loc}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.formGroup, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
          <Text style={[styles.label, { color: colors.text }]}>{t('matches.new.date')}</Text>
          <Pressable
            style={[styles.dateTimeButton, { backgroundColor: colors.tint }]}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateTimeButtonText}>
              {date.toLocaleDateString('nl-NL', {month: 'short', day: 'numeric'})}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={[styles.formGroup, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }]}>
          <Text style={[styles.label, { color: colors.text }]}>{t('matches.new.time')}</Text>
          <Pressable
            style={[styles.dateTimeButton, { backgroundColor: colors.tint }]}
            onPress={() => setShowTimePicker(true)}>
            <Text style={styles.dateTimeButtonText}>
              {time.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'})}
            </Text>
          </Pressable>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setTime(selectedTime);
                }
              }}
            />
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

        <Pressable
          style={[styles.createButton, { backgroundColor: colors.tint }]}
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
  content: {
    flex: 1,
    padding: 16,
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
  createButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 