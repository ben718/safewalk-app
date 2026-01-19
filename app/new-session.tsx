import { ScrollView, Text, View } from 'react-native';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { GlassCard } from '@/components/ui/glass-card';
import { PopTextField } from '@/components/ui/pop-text-field';
import { CushionPillButton } from '@/components/ui/cushion-pill-button';
import { TimeLimitPicker } from '@/components/ui/time-limit-picker';
import { ScreenTransition } from '@/components/ui/screen-transition';
import { useApp } from '@/lib/context/app-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewSessionScreen() {
  const router = useRouter();
  const { settings, startSession } = useApp();
  const insets = useSafeAreaInsets();
  const [limitTime, setLimitTime] = useState(Date.now() + 2.5 * 60 * 60 * 1000);
  const [note, setNote] = useState('');

  const handleStartSession = () => {
    if (!settings.emergencyContactName || !settings.emergencyContactPhone) {
      alert('Veuillez configurer un contact d\'urgence dans les paramètres.');
      router.push('/settings');
      return;
    }
    startSession(limitTime, note);
    router.push('/active-session');
  };

  // CTA height for bottom padding calculation
  const ctaHeight = 60;
  const bottomPadding = ctaHeight + insets.bottom + 12;

  return (
    <View className="flex-1 bg-background">
      <BubbleBackground />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="relative z-10"
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 12,
          paddingBottom: bottomPadding,
        }}
      >
        {/* Header */}
        <ScreenTransition delay={0} duration={350}>
          <View className="gap-1 mb-6">
            <Text className="text-4xl font-bold text-foreground">Je sors</Text>
            <Text className="text-base text-muted">
              Tu penses rentrer vers quelle heure ?
            </Text>
          </View>
        </ScreenTransition>

        {/* Time Limit Picker */}
        <ScreenTransition delay={100} duration={350}>
          <View className="gap-3 mb-4">
            <TimeLimitPicker
              selectedTime={limitTime}
              onTimeSelected={setLimitTime}
            />
          </View>
        </ScreenTransition>

        {/* Card Où vas-tu */}
        <ScreenTransition delay={200} duration={350}>
          <GlassCard className="gap-2 mb-3">
            <Text className="text-sm font-medium text-muted">
              Où vas-tu ? (optionnel)
            </Text>
            <PopTextField
              placeholder="Ex: Soirée chez Karim..."
              value={note}
              onChangeText={setNote}
            />
          </GlassCard>
        </ScreenTransition>

        {/* Card Contact d'urgence */}
        <ScreenTransition delay={300} duration={350}>
          <GlassCard className="gap-2 mb-3">
            <Text className="text-sm font-medium text-muted">
              Contact d'urgence
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">
                  {settings.emergencyContactName || 'Non configuré'}
                </Text>
                <Text className="text-sm text-muted mt-1">
                  {settings.emergencyContactPhone || ''}
                </Text>
              </View>
            </View>
          </GlassCard>
        </ScreenTransition>

        {/* Card Localisation */}
        <ScreenTransition delay={400} duration={350}>
          <GlassCard className="gap-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-medium text-muted">
                  Localisation
                </Text>
                <Text className="text-xs text-muted mt-1">
                  Ajouter ta position en cas d'alerte
                </Text>
              </View>
            </View>
          </GlassCard>
        </ScreenTransition>
      </ScrollView>

      {/* Sticky CTA Bottom */}
      <View
        className="px-4 bg-background border-t border-border"
        style={{ paddingBottom: insets.bottom + 12, paddingTop: 12 }}
      >
        <CushionPillButton
          label="Démarrer"
          onPress={handleStartSession}
          variant="success"
          size="lg"
        />
      </View>
    </View>
  );
}
