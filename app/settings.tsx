import { View, Text, Pressable, Switch, Alert, ScrollView } from 'react-native';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { GlassCard } from '@/components/ui/glass-card';
import { PopTextField } from '@/components/ui/pop-text-field';
import { SegmentedControlPill } from '@/components/ui/segmented-control-pill';
import { ScreenTransition } from '@/components/ui/screen-transition';
import { useApp } from '@/lib/context/app-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { ToastPop } from '@/components/ui/toast-pop';
import { validatePhoneNumber } from '@/lib/utils';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, deleteAllData } = useApp();
  const [firstName, setFirstName] = useState(settings.firstName);
  const [contactName, setContactName] = useState(settings.emergencyContactName);
  const [contactPhone, setContactPhone] = useState(settings.emergencyContactPhone);
  const [contact2Name, setContact2Name] = useState(settings.emergencyContact2Name || '');
  const [contact2Phone, setContact2Phone] = useState(settings.emergencyContact2Phone || '');

  const [locationEnabled, setLocationEnabled] = useState(settings.locationEnabled);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phone2Error, setPhone2Error] = useState<string | null>(null);

  // Autosave firstName
  useEffect(() => {
    const timer = setTimeout(() => {
      if (firstName !== settings.firstName) {
        updateSettings({ firstName });
        setToastMessage('Prénom sauvegardé');
        setShowToast(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [firstName]);

  // Autosave contact 1 avec validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        contactName !== settings.emergencyContactName ||
        contactPhone !== settings.emergencyContactPhone
      ) {
        // Valider le numéro si non vide
        if (contactPhone && !validatePhoneNumber(contactPhone)) {
          setPhoneError('Format invalide. Utilisez +33 suivi de 9 chiffres (ex: +33612345678)');
          return;
        }
        setPhoneError(null);
        updateSettings({
          emergencyContactName: contactName,
          emergencyContactPhone: contactPhone,
        });
        setToastMessage('Contact 1 sauvegardé');
        setShowToast(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [contactName, contactPhone]);

  // Autosave contact 2 avec validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        contact2Name !== (settings.emergencyContact2Name || '') ||
        contact2Phone !== (settings.emergencyContact2Phone || '')
      ) {
        // Valider le numéro si non vide
        if (contact2Phone && !validatePhoneNumber(contact2Phone)) {
          setPhone2Error('Format invalide. Utilisez +33 suivi de 9 chiffres (ex: +33612345678)');
          return;
        }
        setPhone2Error(null);
        updateSettings({
          emergencyContact2Name: contact2Name,
          emergencyContact2Phone: contact2Phone,
        });
        setToastMessage('Contact 2 sauvegardé');
        setShowToast(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [contact2Name, contact2Phone]);



  // Autosave location
  useEffect(() => {
    if (locationEnabled !== settings.locationEnabled) {
      updateSettings({ locationEnabled });
      setToastMessage(
        locationEnabled
          ? 'Localisation activée'
          : 'Localisation désactivée'
      );
      setShowToast(true);
    }
  }, [locationEnabled]);

  const handleDeleteData = () => {
    Alert.alert(
      'Supprimer toutes les données',
      'Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteAllData();
            setToastMessage('Données supprimées');
            setShowToast(true);
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      <BubbleBackground />

      <View
        className="relative z-10 flex-1"
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
              Paramètres
            </Text>
          </View>
        </ScreenTransition>

        {/* SECTION 1: PROFIL */}
        <ScreenTransition delay={100} duration={350}>
          <View className="mb-4">
            <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
              Profil
            </Text>

            {/* Card "Ton prénom" */}
            <GlassCard className="gap-2">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="person" size={16} color="#6C63FF" />
                <Text className="text-sm font-semibold text-muted">
                  Prénom
                </Text>
              </View>
              <PopTextField
                placeholder="Ben"
                value={firstName}
                onChangeText={setFirstName}
              />
            </GlassCard>
          </View>
        </ScreenTransition>

        {/* SECTION 2: SÉCURITÉ */}
        <ScreenTransition delay={200} duration={350}>
          <View className="mb-4">
            <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
              Sécurité
            </Text>

            {/* Card "Contact d'urgence 1" */}
            <View className="mb-3">
              <GlassCard className="gap-2">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="emergency" size={16} color="#FF4D4D" />
                  <Text className="text-sm font-semibold text-foreground">
                    Contact 1
                  </Text>
                </View>
                
                <PopTextField
                  placeholder="Nom"
                  value={contactName}
                  onChangeText={setContactName}
                />

                <View className="flex-row items-center gap-2">
                  <View className="flex-1">
                    <PopTextField
                      placeholder="+33 6 12 34 56 78"
                      value={contactPhone}
                      onChangeText={setContactPhone}
                    />
                    {phoneError && (
                      <Text className="text-xs text-error mt-1">
                        {phoneError}
                      </Text>
                    )}
                  </View>
                  <Pressable className="p-2">
                    <MaterialIcons name="phone" size={20} color="#6C63FF" />
                  </Pressable>
                </View>
              </GlassCard>
            </View>

            {/* Card "Contact d'urgence 2" */}
            <View className="mb-3">
              <GlassCard className="gap-2">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="person-add" size={16} color="#3A86FF" />
                  <Text className="text-sm font-semibold text-foreground">
                    Contact 2 (optionnel)
                  </Text>
                </View>
                
                <PopTextField
                  placeholder="Nom"
                  value={contact2Name}
                  onChangeText={setContact2Name}
                />

                <View className="flex-row items-center gap-2">
                  <View className="flex-1">
                    <PopTextField
                      placeholder="+33 6 12 34 56 78"
                      value={contact2Phone}
                      onChangeText={setContact2Phone}
                    />
                    {phone2Error && (
                      <Text className="text-xs text-error mt-1">
                        {phone2Error}
                      </Text>
                    )}
                  </View>
                  <Pressable className="p-2">
                    <MaterialIcons name="phone" size={20} color="#6C63FF" />
                  </Pressable>
                </View>
              </GlassCard>
            </View>



            {/* Card "Localisation" */}
            <View className="mb-3">
              <GlassCard className="gap-2">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 flex-1">
                    <MaterialIcons name="location-on" size={16} color="#3A86FF" />
                    <Text className="text-sm font-semibold text-foreground">
                      Partage de position
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
        </ScreenTransition>

        {/* Bouton "Supprimer mes données" */}
        <ScreenTransition delay={300} duration={350}>
          <Pressable onPress={handleDeleteData}>
            <Text className="text-center text-base font-bold text-error">
              Supprimer mes données
            </Text>
          </Pressable>
        </ScreenTransition>
      </View>

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
