import { describe, it, expect } from 'vitest';

/**
 * Test: Vérifier que EXPO_PUBLIC_API_URL est correctement configurée
 */
describe.skip('API URL Configuration', () => {
  it('should have EXPO_PUBLIC_API_URL configured', () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    console.log('🔗 EXPO_PUBLIC_API_URL:', apiUrl);
    expect(apiUrl).toBeDefined();
    expect(apiUrl).toContain('http');
  });

  it('should be able to reach the API server', async () => {
    // En développement, utiliser localhost
    const apiUrl = 'http://localhost:3000';
    console.log('📡 Vérification de la connexion à:', apiUrl);

    try {
      const response = await fetch(`${apiUrl}/api/friendly-sms/follow-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts: [{ name: 'Test', phone: '+33763458273' }],
          userName: 'Test',
        }),
      });

      console.log('✅ Serveur API accessible (Status:', response.status, ')');
      expect(response.status).toBe(200);
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      throw error;
    }
  });
});
