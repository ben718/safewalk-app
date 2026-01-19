import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { GlassCard } from '@/components/ui/glass-card';
import { BigSuccessButton } from '@/components/ui/big-success-button';
import { useApp } from '@/lib/context/app-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function ActiveSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession, endSession, cancelSession, addTimeToSession } = useApp();
  const [remainingTime, setRemainingTime] = useState<string>('00:00:00');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (!currentSession) {
      router.push('/');
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const dueTime = currentSession.dueTime;
      const tolerance = currentSession.tolerance * 60 * 1000;
      const deadline = dueTime + tolerance;
      const remaining = deadline - now;

      if (remaining > 0) {
        setIsOverdue(false);
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setRemainingTime(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      } else {
        setIsOverdue(true);
        const overdueTime = Math.abs(remaining);
        const hours = Math.floor(overdueTime / (1000 * 60 * 60));
        const minutes = Math.floor((overdueTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((overdueTime % (1000 * 60)) / 1000);
        setRemainingTime(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession, router]);

  const handleCompleteSession = async () => {
    await endSession();
    router.push('/');
  };

  const handleExtendSession = async () => {
    await addTimeToSession(15);
  };

  const handleCancelSession = () => {
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
            router.push('/');
          },
        },
      ]
    );
  };

  if (!currentSession) {
    return null;
  }

  const dueTimeStr = new Date(currentSession.dueTime).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View className="flex-1 bg-background">
      <BubbleBackground />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="relative z-10"
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 16,
        }}
      >
        {/* 1) Titre en haut */}
        <View className="mb-3">
          <Text className="text-4xl font-bold text-foreground">
            Sortie en cours
          </Text>
        </View>

        {/* 2) Petite pill card sous titre */}
        <View
          className="mb-4 px-3 py-2 rounded-full self-start"
          style={{
            backgroundColor: 'rgba(108, 99, 255, 0.1)',
          }}
        >
          <Text className="text-sm text-primary font-semibold">
            😊 Tu foras après
          </Text>
        </View>

        {/* 3) Grosse card principale (timer card) */}
        <GlassCard
          className="mb-4"
          style={{
            backgroundColor: isOverdue ? 'rgba(255, 77, 77, 0.08)' : 'rgba(255, 255, 255, 0.94)',
            borderRadius: 32,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          {/* Header "🌙 Heure limite" */}
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-lg">🌙</Text>
            <Text className="text-sm font-semibold text-muted">
              Heure limite
            </Text>
          </View>

          {/* Grand chiffre au centre */}
          <Text
            className="text-7xl font-bold text-center mb-3"
            style={{
              color: isOverdue ? '#FF4D4D' : '#6C63FF',
              lineHeight: 80,
            }}
          >
            {isOverdue ? 'En retard' : remainingTime}
          </Text>

          {/* Sous-bloc info */}
          <View className="gap-2 mb-4 border-t border-border pt-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Heure limite :</Text>
              <Text className="text-sm font-semibold text-foreground">
                {dueTimeStr}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Tolérance :</Text>
              <Text className="text-sm font-semibold text-foreground">
                {currentSession.tolerance} min
              </Text>
            </View>
          </View>

          {/* Bouton vert dans la card */}
          <BigSuccessButton
            label="✅ Je suis rentré"
            onPress={handleCompleteSession}
          />
        </GlassCard>

        {/* 4) Sous la grande card: 2 boutons en ligne */}
        <View className="flex-row gap-3 mb-4">
          {/* Gauche: "+ 15 min" */}
          <Pressable
            onPress={handleExtendSession}
            className="flex-1 py-3 px-4 rounded-2xl"
            style={{
              backgroundColor: 'rgba(108, 99, 255, 0.15)',
              borderWidth: 1,
              borderColor: 'rgba(108, 99, 255, 0.3)',
            }}
          >
            <Text className="text-center text-sm font-semibold text-primary">
              + 15 min
            </Text>
          </Pressable>

          {/* Droite: "Annuler la sortie" (danger outline) */}
          <Pressable
            onPress={handleCancelSession}
            className="flex-1 py-3 px-4 rounded-2xl flex-row items-center justify-center gap-2"
            style={{
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: '#FF4D4D',
            }}
          >
            <MaterialIcons name="warning" size={16} color="#FF4D4D" />
            <Text className="text-center text-sm font-semibold text-error">
              Annuler
            </Text>
          </Pressable>
        </View>

        {/* 5) Espace pour la capsule menu (18px) */}
        <View style={{ height: 18 }} />
      </ScrollView>
    </View>
  );
}
