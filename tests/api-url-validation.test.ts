import { describe, it, expect } from 'vitest';

/**
 * Test de validation de l'URL API
 * Vérifie que l'URL API est accessible et que le service SMS est configuré
 */
describe('API URL Validation', () => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://3000-irwl1yzlwbswmhi7zu2m2-c84b8aca.us1.manus.computer';

  it('should have a valid API URL configured', () => {
    expect(API_URL).toBeDefined();
    expect(API_URL).toMatch(/^https?:\/\//);
  });

  it('should be able to reach the health endpoint', async () => {
    const response = await fetch(`${API_URL}/api/sms/health`);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.service).toBe('SMS API');
    expect(data.twilioConfigured).toBe(true);
  });

  it('should be able to send a test SMS', async () => {
    const response = await fetch(`${API_URL}/api/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: '+33612345678',
        message: 'Test SafeWalk - Validation automatique',
      }),
    });

    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.sid).toBeDefined();
    expect(data.status).toBeDefined();
  });
});
