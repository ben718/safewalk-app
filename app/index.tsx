import { ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { HeroCardPremium } from '@/components/ui/hero-card-premium';
import { StatusCard } from '@/components/ui/status-card';
import { useApp } from '@/lib/context/app-context';
import { useState } from 'react';
import { ToastPop } from '@/components/ui/toast-pop';

export default function IndexScreen() {
  const router = useRouter();
  const { settings, currentSession } = useApp();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
        <View className="gap-1 mb-4">
          <Text className="text-3xl font-bold text-foreground">
            SafeWalk
          </Text>
          <Text className="text-base text-muted">
            Reste en sécurité, partout.
          </Text>
        </View>

        {/* Hero Card */}
        <HeroCardPremium
          title="Je sors"
          description="Définis une heure de retour. Un proche est prévenu si tu ne confirmes pas."
          buttonLabel="Commencer"
          onButtonPress={handleStartSession}
          emoji="🚀"
        />

        {/* Status Card */}
        <StatusCard
          status={hasContact ? 'active' : 'inactive'}
          title={statusTitle}
          subtitle={statusSubtitle}
          onPress={handleStatusPress}
        />
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
