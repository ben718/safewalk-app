import { logger } from "../utils/logger";
import { Router, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { sendFriendlyAlertSMSToMultiple } from "../services/friendly-sms";

const router = Router();

// Rate limiter: max 5 requêtes par minute par IP (SÉCURITÉ)
const sosLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Max 5 requêtes par minute
  message: {
    success: false,
    error: "Trop de requêtes. Veuillez réessayer dans 1 minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Schéma de validation Zod (SÉCURITÉ)
const sosRequestSchema = z.object({
  firstName: z.string().min(1).max(100),
  emergencyContacts: z.array(
    z.object({
      name: z.string().min(1).max(100),
      phone: z.string().regex(/^\+?[1-9]\d{1,14}$/), // Format E.164
    })
  ).min(1).max(5),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  limitTime: z.string().optional(),
});

/**
 * POST /api/sos/trigger
 * Déclenche une alerte SOS immédiate
 * Envoie SMS friendly à tous les contacts d'urgence avec position GPS
 */
router.post("/trigger", sosLimiter, async (req: Request, res: Response) => {
  try {
    // Validation des données avec Zod (SÉCURITÉ)
    const validation = sosRequestSchema.safeParse(req.body);
    
    if (!validation.success) {
      logger.error('[SOS] Validation échouée:', validation.error.issues);
      return res.status(400).json({
        success: false,
        error: "Données invalides",
        details: validation.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`),
      });
    }

    const { 
      firstName, 
      emergencyContacts, 
      latitude, 
      longitude, 
      limitTime 
    } = validation.data;

    logger.debug('[SOS] Requête reçue:', { firstName, emergencyContacts, latitude, longitude });

    // Utiliser le système SMS friendly pour SOS
    const location = latitude && longitude ? { latitude, longitude } : undefined;
    const limitTimeStr = limitTime || new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    logger.debug(`[SOS] Envoi SMS friendly à ${emergencyContacts.length} contact(s)...`);

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
    logger.error("[SOS] Erreur:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du déclenchement de l'alerte SOS",
      details: String(error),
    });
  }
});

export default router;
