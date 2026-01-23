import { sendSMS } from './api-client';
import { cleanPhoneNumber, validatePhoneNumber } from '../utils';

/**
 * Service SMS - Point d'entrée unique pour tous les envois SMS d'urgence
 */

export type SMSReason = 'test' | 'alert' | 'sos' | 'followup' | 'confirmation';

export interface SendEmergencySMSOptions {
  reason: SMSReason;
  tripId?: string;
  contactName: string;
  contactPhone: string;
  firstName?: string;
  note?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface SendEmergencySMSResult {
  ok: boolean;
  sid?: string;
  error?: string;
  timestamp: number;
}

/**
 * Normaliser un numéro français en format E.164
 * Exemples:
 * - 06 12 34 56 78 => +33612345678
 * - 07 12 34 56 78 => +33712345678
 * - +33 6 12 34 56 78 => +33612345678
 */
function normalizePhoneNumber(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  
  // Si commence déjà par +, on garde tel quel
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // Si commence par 06 ou 07 (France), on ajoute +33
  if (cleaned.startsWith('06') || cleaned.startsWith('07')) {
    return '+33' + cleaned.substring(1);
  }
  
  // Sinon on ajoute + devant
  return '+' + cleaned;
}

/**
 * Construire le message SMS selon la raison
 */
function buildMessage(options: SendEmergencySMSOptions): string {
  const { reason, contactName, firstName, note, location } = options;
  const userName = firstName || 'Votre contact';
  
  switch (reason) {
    case 'test':
      return `Test SafeWalk: Ceci est un SMS de test envoyé depuis l'app. Tout fonctionne ! 🚀`;
    
    case 'alert':
      let alertMsg = `🚨 ALERTE SafeWalk\n\n${userName} n'a pas confirmé son retour à l'heure prévue.`;
      if (note) {
        alertMsg += `\n\nDestination: ${note}`;
      }
      if (location) {
        const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        alertMsg += `\n\nDernière position connue:\n${mapsUrl}`;
      }
      alertMsg += `\n\nMerci de vérifier que tout va bien.`;
      return alertMsg;
    
    case 'sos':
      let sosMsg = `🆘 SOS SafeWalk\n\n${userName} a déclenché une alerte SOS d'urgence !`;
      if (note) {
        sosMsg += `\n\nDestination: ${note}`;
      }
      if (location) {
        const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        sosMsg += `\n\nPosition actuelle:\n${mapsUrl}`;
      }
      sosMsg += `\n\nContactez-le immédiatement ou appelez les secours si nécessaire.`;
      return sosMsg;
    
    case 'followup':
      let followupMsg = `⚠️ RELANCE SafeWalk\n\n${userName} n'a toujours pas confirmé son retour (10 minutes après l'heure limite).`;
      if (location) {
        const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        followupMsg += `\n\nDernière position:\n${mapsUrl}`;
      }
      followupMsg += `\n\nMerci de le contacter rapidement.`;
      return followupMsg;
    
    case 'confirmation':
      return `✅ SafeWalk\n\n${userName} a confirmé qu'il va bien. Tout est OK ! 😊`;
    
    default:
      return `SafeWalk: Message d'urgence de ${userName}`;
  }
}

/**
 * Envoyer un SMS d'urgence
 * Fonction unique utilisée par Test SMS, SOS et Alerte Retard
 */
export async function sendEmergencySMS(options: SendEmergencySMSOptions): Promise<SendEmergencySMSResult> {
  const timestamp = Date.now();
  
  console.log(`📤 [SMS Service] Envoi SMS d'urgence (${options.reason})...`);
  console.log(`📋 [SMS Service] Options:`, {
    reason: options.reason,
    contactName: options.contactName,
    contactPhone: options.contactPhone,
    hasLocation: !!options.location,
  });
  
  try {
    // Validation du numéro
    const cleanedPhone = cleanPhoneNumber(options.contactPhone);
    if (!validatePhoneNumber(cleanedPhone)) {
      console.error('❌ [SMS Service] Numéro invalide:', options.contactPhone);
      return {
        ok: false,
        error: 'Numéro de téléphone invalide',
        timestamp,
      };
    }
    
    // Normalisation en E.164
    const normalizedPhone = normalizePhoneNumber(cleanedPhone);
    console.log(`📞 [SMS Service] Numéro normalisé: ${options.contactPhone} => ${normalizedPhone}`);
    
    // Construction du message
    const message = buildMessage(options);
    console.log(`📝 [SMS Service] Message (${message.length} chars):`, message.substring(0, 100) + '...');
    
    // Envoi via API
    const result = await sendSMS(normalizedPhone, message);
    
    if (result.ok) {
      console.log(`✅ [SMS Service] SMS envoyé avec succès (SID: ${result.sid})`);
      return {
        ok: true,
        sid: result.sid,
        timestamp,
      };
    } else {
      console.error(`❌ [SMS Service] Échec envoi SMS:`, result.error);
      return {
        ok: false,
        error: result.error || 'Échec envoi SMS',
        timestamp,
      };
    }
  } catch (error: any) {
    console.error('❌ [SMS Service] Exception:', error);
    return {
      ok: false,
      error: error.message || 'Erreur réseau',
      timestamp,
    };
  }
}
