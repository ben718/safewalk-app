import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { HeroCardPremium } from '@/components/ui/hero-card-premium';
import { StatusCard } from '@/components/ui/status-card';
import { ScreenTransition } from '@/components/ui/screen-transition';
import { useApp } from '@/lib/context/app-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ToastPop } from '@/components/ui/toast-pop';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings, currentSession } = useApp();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const hasContact = settings.emergencyContactName && settings.emergencyContactPhone;

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
          paddingBottom: insets.bottom + 16,
        }}
      >
        {/* Header */}
        <ScreenTransition delay={0} duration={350}>
          <View className="gap-1 mb-4">
            <Text className="text-4xl font-bold text-foreground">
              SafeWalk
            </Text>
            <Text className="text-base text-muted">
              Reste en sécurité, partout.
            </Text>
          </View>
        </ScreenTransition>

        {/* Hero Card */}
        <ScreenTransition delay={100} duration={350}>
          <View className="mb-3">
            <HeroCardPremium
              title="Je sors"
              description="Définis une heure de retour. Un proche est prévenu si tu ne confirmes pas."
              buttonLabel="Commencer"
              onButtonPress={handleStartSession}
            />
          </View>
        </ScreenTransition>

        {/* Status Card */}
        <ScreenTransition delay={200} duration={350}>
          <View className="mb-3">
            <StatusCard
              status={hasContact ? 'active' : 'inactive'}
              title={hasContact ? 'Sécurité active' : 'Sécurité inactive'}
              subtitle={hasContact ? 'Contact configuré' : 'Configurer un contact'}
              onPress={handleStatusPress}
            />
          </View>
        </ScreenTransition>

        {/* Current Session Info (if active) */}
        {currentSession && (
          <ScreenTransition delay={300} duration={350}>
            <Pressable
              onPress={() => router.push('/active-session')}
            >
              {({ pressed }) => (
                <View
                  className="p-4 rounded-2xl mb-3"
                  style={{
                    backgroundColor: 'rgba(45, 226, 166, 0.1)',
                    borderLeftWidth: 4,
                    borderLeftColor: '#2DE2A6',
                    opacity: pressed ? 0.7 : 1,
                  }}
                >
                  <View className="flex-row items-center gap-2 mb-1">
                    <MaterialIcons name="location-on" size={16} color="#2DE2A6" />
                    <Text className="text-sm font-semibold text-foreground">
                      Sortie en cours
                    </Text>
                  </View>
                  <Text className="text-xs text-muted">
                    Appuie pour voir les détails
                  </Text>
                </View>
              )}
            </Pressable>
          </ScreenTransition>
        )}
      </ScrollView>

      {/* Toast */}
      {showToast && (
        <ToastPop
          message={toastMessage}
          type="warning"
          duration={2000}
          onDismiss={() => setShowToast(false)}
        />
      )}
    </View>
  );
}
