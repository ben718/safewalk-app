import { ScrollView, View, Text, Pressable, Switch, Alert } from 'react-native';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { GlassCard } from '@/components/ui/glass-card';
import { PopTextField } from '@/components/ui/pop-text-field';
import { SegmentedControlPill } from '@/components/ui/segmented-control-pill';
import { useApp } from '@/lib/context/app-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { ToastPop } from '@/components/ui/toast-pop';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, deleteAllData } = useApp();
  const [firstName, setFirstName] = useState(settings.firstName);
  const [contactName, setContactName] = useState(settings.emergencyContactName);
  const [contactPhone, setContactPhone] = useState(settings.emergencyContactPhone);
  const [tolerance, setTolerance] = useState(settings.tolerance);
  const [locationEnabled, setLocationEnabled] = useState(settings.locationEnabled);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Autosave firstName
  useEffect(() => {
    const timer = setTimeout(() => {
      if (firstName !== settings.firstName) {
        updateSettings({ firstName });
        setToastMessage('✅ Prénom sauvegardé');
        setShowToast(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [firstName]);

  // Autosave contact
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        contactName !== settings.emergencyContactName ||
        contactPhone !== settings.emergencyContactPhone
      ) {
        updateSettings({
          emergencyContactName: contactName,
          emergencyContactPhone: contactPhone,
        });
        setToastMessage('✅ Contact sauvegardé');
        setShowToast(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [contactName, contactPhone]);

  // Autosave tolerance
  useEffect(() => {
    if (tolerance !== settings.tolerance) {
      updateSettings({ tolerance });
      setToastMessage(`✅ Tolérance: ${tolerance} min`);
      setShowToast(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [tolerance]);

  // Autosave location
  useEffect(() => {
    if (locationEnabled !== settings.locationEnabled) {
      updateSettings({ locationEnabled });
      setToastMessage(
        locationEnabled
          ? '✅ Localisation activée'
          : '✅ Localisation désactivée'
      );
      setShowToast(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [locationEnabled]);

  const handleDeleteData = () => {
    Alert.alert(
      '⚠️ Supprimer toutes les données',
      'Cette action est irréversible. Tous vos paramètres et historique seront supprimés.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteAllData();
            setToastMessage('🗑️ Données supprimées');
            setShowToast(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
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
        <View className="gap-1 mb-6">
          <Text className="text-4xl font-bold text-foreground">
            Paramètres
          </Text>
          <Text className="text-base text-muted">
            Personnalise ta sécurité.
          </Text>
        </View>

        {/* SECTION 1: PROFIL */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
            👤 Profil
          </Text>

          {/* Card "Ton prénom" */}
          <View className="mb-3">
            <GlassCard className="gap-3">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="person" size={18} color="#6C63FF" />
                <Text className="text-sm font-semibold text-muted flex-1">
                  Ton prénom
                </Text>
              </View>
              <PopTextField
                placeholder="Ex: Ben"
                value={firstName}
                onChangeText={setFirstName}
              />
              <Text className="text-xs text-muted">
                Utilisé pour personnaliser les messages d'alerte.
              </Text>
            </GlassCard>
          </View>
        </View>

        {/* SECTION 2: SÉCURITÉ */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
            🛡️ Sécurité
          </Text>

          {/* Card "Contact d'urgence" */}
          <View className="mb-3">
            <GlassCard className="gap-3">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="emergency" size={18} color="#FF4D4D" />
                <Text className="text-sm font-semibold text-foreground flex-1">
                  Contact d'urgence
                </Text>
              </View>
              
              <View>
                <Text className="text-xs text-muted mb-1.5">Nom</Text>
                <PopTextField
                  placeholder="Ex: Maman"
                  value={contactName}
                  onChangeText={setContactName}
                />
              </View>

              <View>
                <Text className="text-xs text-muted mb-1.5">Numéro</Text>
                <View className="flex-row items-center gap-2">
                  <View className="flex-1">
                    <PopTextField
                      placeholder="+33 6 12 34 56 78"
                      value={contactPhone}
                      onChangeText={setContactPhone}
                    />
                  </View>
                  <Pressable 
                    className="p-2"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <MaterialIcons name="phone" size={22} color="#6C63FF" />
                  </Pressable>
                </View>
              </View>

              <View className="bg-orange-50 rounded-lg p-2.5 border border-orange-200">
                <Text className="text-xs text-orange-700 font-medium">
                  ⚠️ Ce contact recevra une alerte si tu ne confirmes pas ton retour.
                </Text>
              </View>
            </GlassCard>
          </View>

          {/* Card "Tolérance" */}
          <View className="mb-3">
            <GlassCard className="gap-3">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="schedule" size={18} color="#2DE2A6" />
                <Text className="text-sm font-semibold text-foreground flex-1">
                  Marge de tolérance
                </Text>
              </View>
              <Text className="text-xs text-muted">
                Délai avant déclenchement de l'alerte après l'heure limite.
              </Text>
              <SegmentedControlPill
                options={[
                  { label: '10 min', value: 10 },
                  { label: '15 min', value: 15 },
                  { label: '30 min', value: 30 },
                ]}
                value={tolerance}
                onValueChange={(value) => setTolerance(value as number)}
              />
            </GlassCard>
          </View>

          {/* Card "Localisation" */}
          <View className="mb-3">
            <GlassCard className="gap-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 gap-1">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="location-on" size={18} color="#3A86FF" />
                    <Text className="text-sm font-semibold text-foreground">
                      Partage de position
                    </Text>
                  </View>
                  <Text className="text-xs text-muted">
                    Envoyer ta position GPS en cas d'alerte (si disponible)
                  </Text>
                </View>
                <Switch
                  value={locationEnabled}
                  onValueChange={(value) => {
                    setLocationEnabled(value);
                  }}
                  trackColor={{ false: '#E5E7EB', true: '#2DE2A6' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </GlassCard>
          </View>
        </View>

        {/* SECTION 3: À PROPOS */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
            ℹ️ À propos
          </Text>

          {/* Card "Confidentialité" */}
          <Pressable 
            className="mb-2"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            {({ pressed }) => (
              <GlassCard 
                className="gap-3"
                style={{
                  opacity: pressed ? 0.7 : 1,
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 flex-1">
                    <MaterialIcons name="privacy-tip" size={18} color="#6C63FF" />
                    <Text className="text-sm font-semibold text-foreground">
                      Confidentialité
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color="#B0B0B0" />
                </View>
              </GlassCard>
            )}
          </Pressable>

          {/* Card "Version" */}
          <View className="mb-2">
            <GlassCard className="gap-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="info" size={18} color="#F59E0B" />
                  <Text className="text-sm text-muted">Version</Text>
                </View>
                <Text className="text-sm font-bold text-foreground">
                  v1.0.0
                </Text>
              </View>
            </GlassCard>
          </View>

          {/* Card "Support" */}
          <Pressable 
            className="mb-4"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            {({ pressed }) => (
              <GlassCard 
                className="gap-3"
                style={{
                  opacity: pressed ? 0.7 : 1,
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 flex-1">
                    <MaterialIcons name="help" size={18} color="#2DE2A6" />
                    <Text className="text-sm text-muted">Support</Text>
                  </View>
                  <Text className="text-sm font-semibold text-primary">
                    Contacter
                  </Text>
                </View>
              </GlassCard>
            )}
          </Pressable>

          {/* Bouton "Supprimer mes données" */}
          <Pressable 
            onPress={handleDeleteData}
            className="py-4"
          >
            {({ pressed }) => (
              <View
                style={{
                  opacity: pressed ? 0.6 : 1,
                }}
              >
                <Text className="text-center text-base font-bold text-error">
                  🗑️ Supprimer mes données
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* Toast */}
      {showToast && (
        <ToastPop
          message={toastMessage}
          type="success"
          duration={1500}
          onDismiss={() => setShowToast(false)}
        />
      )}
    </View>
  );
}
