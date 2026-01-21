// En développement: localhost:3000
// En production: URL du serveur déployé
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface FollowUpAlertParams {
  contacts: Array<{ name: string; phone: string }>;
  userName: string;
  location?: { latitude: number; longitude: number };
}

export interface ConfirmationParams {
  contacts: Array<{ name: string; phone: string }>;
  userName: string;
}

/**
 * Envoyer un SMS de relance après 10 min si pas de confirmation
 */
export async function sendFollowUpAlertSMS(params: FollowUpAlertParams): Promise<void> {
  try {
    console.log('📤 Appel API SMS relance avec:', params);
    const url = `${API_BASE_URL}/api/friendly-sms/follow-up`;
    console.log('🔗 URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    console.log('📊 Réponse API relance:', response.status, response.statusText);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ Réponse API:', errorBody);
      throw new Error(`SMS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ SMS relance envoyés avec succès:', data);
  } catch (error) {
    console.error('❌ Erreur SMS relance:', error);
    throw error;
  }
}

/**
 * Envoyer un SMS de confirmation quand l'utilisateur confirme "Je vais bien"
 */
export async function sendConfirmationSMS(params: ConfirmationParams): Promise<void> {
  try {
    console.log('📤 Appel API SMS confirmation avec:', params);
    const url = `${API_BASE_URL}/api/friendly-sms/confirmation`;
    console.log('🔗 URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    console.log('📊 Réponse API confirmation:', response.status, response.statusText);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ Réponse API:', errorBody);
      throw new Error(`SMS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ SMS confirmation envoyés avec succès:', data);
  } catch (error) {
    console.error('❌ Erreur SMS confirmation:', error);
    throw error;
  }
}
