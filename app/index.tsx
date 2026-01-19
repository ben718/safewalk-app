import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { HeroCardPremium } from '@/components/ui/hero-card-premium';
import { StatusCard } from '@/components/ui/status-card';
import { GlassCard } from '@/components/ui/glass-card';
import { useApp } from '@/lib/context/app-context';
import { useState, useEffect } from 'react';
import { ToastPop } from '@/components/ui/toast-pop';
import { MaterialIcons } from '@expo/vector-icons';

export default function IndexScreen() {
  const router = useRouter();
  const { settings, currentSession } = useApp();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('--:--:--');

  const hasContact = settings.emergencyContactName && settings.emergencyContactPhone;
  const statusTitle = hasContact ? 'Sécurité active' : 'Sécurité inactive';
  const statusSubtitle = hasContact ? 'Contact configuré' : 'Configurer un contact';

  const handleStartSession = () => {
    if (!hasContact) {
      setToastMessage('Configure un contact d\'urgence');
      setShowToast(true);
      setTimeout(() => {
        router.push('/settings');
      }, 1500);
      return;
    }

    router.push('/new-session');
  };

  const handleStatusPress = () => {
    if (!hasContact) {
      router.push('/settings');
    }
  };

  const handleActiveSessionPress = () => {
    if (currentSession) {
      router.push('/active-session');
    }
  };

  // Update time remaining every second
  useEffect(() => {
    if (!currentSession) return;

    const updateTimeRemaining = () => {
      const now = Date.now();
      const deadline = currentSession.dueTime + currentSession.tolerance * 60 * 1000;
      const remaining = deadline - now;

      if (remaining <= 0) {
        setTimeRemaining('En retard');
      } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setTimeRemaining(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [currentSession]);

  return (
    <ScreenContainer
      className="relative pb-24"
      containerClassName="bg-background"
    >
      <BubbleBackground />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="relative z-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="gap-1 mb-3">
          <Text className="text-3xl font-bold text-foreground">
            SafeWalk
          </Text>
          <Text className="text-base text-muted">
            Reste en sécurité, partout.
          </Text>
        </View>

        {/* Hero Card */}
        <View className="mb-3">
          <HeroCardPremium
            title="Je sors"
            description="Définis une heure de retour. Un proche est prévenu si tu ne confirmes pas."
            buttonLabel="Commencer"
            onButtonPress={handleStartSession}
            emoji="🚀"
          />
        </View>

        {/* Status Card */}
        <View className="mb-3">
          <StatusCard
            status={hasContact ? 'active' : 'inactive'}
            title={statusTitle}
            subtitle={statusSubtitle}
            onPress={handleStatusPress}
          />
        </View>

        {/* Active Session Card (if exists) */}
        {currentSession && (
          <Pressable onPress={handleActiveSessionPress}>
            {({ pressed }) => (
              <GlassCard
                className="flex-row items-center justify-between p-4"
                style={{
                  opacity: pressed ? 0.8 : 1.0,
                }}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <Text className="text-2xl">📍</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                      Sortie en cours
                    </Text>
                    <Text className="text-xs text-muted">
                      Temps restant: {timeRemaining}
                    </Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color="#6C63FF"
                />
              </GlassCard>
            )}
          </Pressable>
        )}
      </ScrollView>

      {/* Toast */}
      {showToast && (
        <ToastPop
          message={toastMessage}
          type="warning"
          duration={1500}
          onDismiss={() => setShowToast(false)}
        />
      )}
    </ScreenContainer>
  );
}
