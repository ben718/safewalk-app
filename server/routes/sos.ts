import { Router, Request, Response } from "express";
import { sendFriendlyAlertSMSToMultiple } from "../services/friendly-sms";

const router = Router();

/**
 * POST /api/sos/trigger
 * Déclenche une alerte SOS immédiate
 * Envoie SMS friendly à tous les contacts d'urgence avec position GPS
 */
router.post("/trigger", async (req: Request, res: Response) => {
  try {
    const { 
      firstName, 
      emergencyContacts, 
      latitude, 
      longitude, 
      limitTime 
    } = req.body;

    console.log('[SOS] Requête reçue:', { firstName, emergencyContacts, latitude, longitude });

    if (!firstName || !emergencyContacts || emergencyContacts.length === 0) {
      console.error('[SOS] Erreur: données manquantes');
      return res.status(400).json({
        success: false,
        error: "firstName et emergencyContacts sont requis",
      });
    }

    // Utiliser le système SMS friendly pour SOS
    const location = latitude && longitude ? { latitude, longitude } : undefined;
    const limitTimeStr = limitTime || new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    console.log(`[SOS] Envoi SMS friendly à ${emergencyContacts.length} contact(s)...`);

    const smsResults = await sendFriendlyAlertSMSToMultiple(
      emergencyContacts,
      firstName,
      limitTimeStr,
      '🚨 ALERTE SOS IMMÉDIATE',
      location
    );

    res.json({
      success: true,
      message: "Alerte SOS déclenchée",
      smsResults: smsResults.map(r => ({
        contact: emergencyContacts.find((c: any) => c.phone === r.phone)?.name || 'Unknown',
        phone: r.phone,
        messageSid: r.messageSid,
        status: r.status,
      })),
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("[SOS] Erreur:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du déclenchement de l'alerte SOS",
      details: String(error),
    });
  }
});

export default router;
