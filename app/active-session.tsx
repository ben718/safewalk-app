import { ScrollView, View, Text, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { GlassCard } from '@/components/ui/glass-card';
import { BigSuccessButton } from '@/components/ui/big-success-button';
import { CushionPillButton } from '@/components/ui/cushion-pill-button';
import { useApp } from '@/lib/context/app-context';
import { useState, useEffect } from 'react';
import { ToastPop } from '@/components/ui/toast-pop';

export default function ActiveSessionScreen() {
  const router = useRouter();
  const { currentSession, endSession, addTimeToSession, cancelSession } = useApp();
  const [timeLeft, setTimeLeft] = useState('--:--');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLate, setIsLate] = useState(false);

  useEffect(() => {
    if (!currentSession) {
      router.push('/');
      return;
    }

    const updateTimeLeft = () => {
      const now = Date.now();
      const deadline = currentSession.dueTime + currentSession.tolerance * 60 * 1000;
      const remaining = deadline - now;

      if (remaining <= 0) {
        // En retard
        setIsLate(true);
        const lateTime = Math.abs(remaining);
        const hours = Math.floor(lateTime / (1000 * 60 * 60));
        const minutes = Math.floor((lateTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((lateTime % (1000 * 60)) / 1000);
        setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      } else {
        // Temps restant
        setIsLate(false);
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [currentSession]);

  const handleReturnHome = async () => {
    await endSession();
    setToastMessage('Bienvenue à la maison !');
    setShowToast(true);
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  const handleAddTime = async () => {
    await addTimeToSession(15);
    setToastMessage('15 minutes ajoutées');
    setShowToast(true);
  };

  const handleCancel = () => {
    Alert.alert(
      'Annuler la sortie',
      'Êtes-vous sûr de vouloir annuler cette sortie ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          style: 'destructive',
          onPress: async () => {
            await cancelSession();
            setToastMessage('Sortie annulée');
            setShowToast(true);
            setTimeout(() => {
              router.push('/');
            }, 500);
          },
        },
      ]
    );
  };

  if (!currentSession) {
    return null;
  }

  return (
    <ScreenContainer
      className="relative pb-32"
      containerClassName="bg-background"
    >
      <BubbleBackground />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="relative z-10 gap-2"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="gap-1 mb-2">
          <Text className="text-3xl font-bold text-foreground">
            Sortie en cours
          </Text>
          <Text className="text-base text-muted">
            Tu forase après 😊
          </Text>
        </View>

        {/* Time Display - Compact */}
        <GlassCard
          className="items-center justify-center py-4 gap-2"
          style={{
            backgroundColor: isLate ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <Text className="text-sm text-muted font-semibold">
            {isLate ? 'En retard' : 'Temps restant'}
          </Text>
          <Text
            className="font-bold"
            style={{
              fontSize: 52,
              color: isLate ? '#F59E0B' : '#6C63FF',
            }}
          >
            {timeLeft}
          </Text>
          <View className="gap-1 items-center mt-1">
            <Text className="text-xs text-muted">
              Heure limite : {currentSession.dueTime ? new Date(currentSession.dueTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </Text>
            <Text className="text-xs text-muted">
              Tolérance : {currentSession.tolerance} min
            </Text>
          </View>
        </GlassCard>

        {/* CTA Buttons - Collés sous la card */}
        <View className="gap-3 mt-3">
          <BigSuccessButton
            label="Je suis rentré"
            onPress={handleReturnHome}
          />

          <CushionPillButton
            label="+ 15 min"
            onPress={handleAddTime}
            variant="secondary"
            size="md"
          />

          <Pressable onPress={handleCancel}>
            <Text className="text-center text-sm font-semibold text-error">
              Annuler la sortie
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Toast */}
      {showToast && (
        <ToastPop
          message={toastMessage}
          type={toastMessage.includes('Bienvenue') ? 'success' : 'info'}
          duration={1500}
          onDismiss={() => setShowToast(false)}
        />
      )}
    </ScreenContainer>
  );
}
