import express, { Router } from "express";
import webhookRoutes from "../routes/webhooks";
import sosRoutes from "../routes/sos";
import friendlySmsRoutes from "../routes/friendly-sms";

const router = Router();

// Monter les routes API utilisées
router.use("/webhooks", webhookRoutes);
router.use("/sos", sosRoutes);
router.use("/friendly-sms", friendlySmsRoutes);

export default router;
