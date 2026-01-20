# Guide de Test E2E - SafeWalk

Ce guide explique comment tester le flux complet de SafeWalk : envoi SMS, réception webhook, et mise à jour du statut.

## 🎯 Objectif

Valider que le flux suivant fonctionne correctement :

```
1. Créer une session avec heure limite
   ↓
2. Attendre l'expiration du délai
   ↓
3. Déclencher l'alerte et envoyer SMS
   ↓
4. Recevoir le webhook Twilio avec statut
   ↓
5. Mettre à jour le statut en temps réel
   ↓
6. Permettre au check-in d'annuler l'alerte
```

## 📋 Prérequis

### 1. Variables d'Environnement

Assurez-vous que les secrets Twilio sont configurés :

```bash
export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TWILIO_AUTH_TOKEN="1234567890abcdef1234567890abcdef"
export TWILIO_PHONE_NUMBER="+33123456789"
export API_URL="http://localhost:3000"
```

### 2. API en Cours d'Exécution

Démarrez le serveur SafeWalk :

```bash
npm run dev:server
```

Vérifiez que l'API est accessible :

```bash
curl http://localhost:3000/health
# Réponse: {"status":"ok"}
```

## 🚀 Exécuter les Tests

### Option 1 : Tests Rapides (Recommandé)

```bash
# Exécuter tous les tests sauf le session flow (2 min)
./scripts/run-e2e-tests.sh quick
```

**Durée :** ~30 secondes

**Tests inclus :**
- ✅ API Health Check
- ✅ Twilio Configuration
- ✅ SMS Endpoint
- ✅ Webhook Endpoint
- ✅ Check-in Endpoint
- ✅ SMS Delivery Flow
- ✅ Check-in Flow

### Option 2 : Tests Complets

```bash
# Exécuter tous les tests inclus le session flow (2 min)
./scripts/run-e2e-tests.sh full
```

**Durée :** ~2 minutes 30 secondes

**Tests supplémentaires :**
- ✅ Full Session Flow (crée une session, attend 2 min, vérifie l'alerte)

### Option 3 : Exécution Manuelle

```bash
# Exécuter directement avec ts-node
npx ts-node scripts/test-e2e-flow.ts
```

## 📊 Résultats Attendus

### Tests Rapides (Succès)

```
✅ API Health Check (45ms)
✅ Twilio Configuration (12ms)
✅ SMS Endpoint (234ms)
✅ Webhook Endpoint (156ms)
✅ Check-in Endpoint (89ms)
✅ SMS Delivery Flow (445ms)
✅ Check-in Flow (267ms)

Total: 7/7 PASS (1248ms)
```

### Erreurs Possibles

| Erreur | Cause | Solution |
|--------|-------|----------|
| `API not healthy` | API non démarrée | Exécuter `npm run dev:server` |
| `Twilio credentials not configured` | Variables d'env manquantes | Exporter les secrets Twilio |
| `Invalid TWILIO_ACCOUNT_SID format` | Format incorrect | Vérifier le format (AC + 32 caractères) |
| `SMS endpoint failed` | Erreur lors de l'envoi SMS | Vérifier les logs du serveur |
| `Webhook endpoint failed` | Erreur lors de la réception du webhook | Vérifier que le serveur accepte les webhooks |

## 🔍 Tester Manuellement

### 1. Créer une Session

```bash
curl -X POST http://localhost:3000/api/sessions/create \
  -H "Content-Type: application/json" \
  -d '{
    "limitTime": '$(date +%s000 -d "+2 minutes")',
    "tolerance": 900000,
    "emergencyContact1": {
      "name": "Contact 1",
      "phone": "+33612345678"
    }
  }'
```

### 2. Envoyer un SMS

```bash
curl -X POST http://localhost:3000/api/sms/alert \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumbers": ["+33612345678"],
    "limitTimeStr": "14:00",
    "tolerance": 15
  }'
```

### 3. Simuler un Webhook Twilio

```bash
curl -X POST http://localhost:3000/api/webhooks/twilio \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "MessageSid=SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d "AccountSid=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d "MessageStatus=delivered" \
  -d "To=%2B33612345678" \
  -d "From=%2B33123456789" \
  -d "ApiVersion=2010-04-01"
```

### 4. Confirmer un Check-in

```bash
curl -X POST http://localhost:3000/api/check-in/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-id-from-step-1"
  }'
```

## 📈 Monitoring

### Logs du Serveur

Pendant l'exécution des tests, vérifiez les logs du serveur :

```bash
# Terminal 1 : Serveur
npm run dev:server

# Terminal 2 : Tests
./scripts/run-e2e-tests.sh quick
```

Vous devriez voir :

```
[API] POST /api/sms/alert - 200 OK
[API] POST /api/webhooks/twilio - 200 OK
[API] POST /api/check-in/confirm - 200 OK
```

### Vérifier les SMS Reçus

1. Allez sur https://www.twilio.com/console/sms/logs
2. Vérifiez que les SMS sont listés avec le statut "delivered"
3. Vérifiez que les webhooks ont été reçus (onglet "Webhooks")

## 🐛 Dépannage

### L'API n'est pas accessible

```bash
# Vérifier que le serveur est en cours d'exécution
lsof -i :3000

# Démarrer le serveur
npm run dev:server
```

### Les SMS ne sont pas envoyés

```bash
# Vérifier les logs Twilio
curl https://www.twilio.com/console/sms/logs

# Vérifier les secrets
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_AUTH_TOKEN
echo $TWILIO_PHONE_NUMBER
```

### Le webhook n'est pas reçu

```bash
# Vérifier que le webhook URL est configuré dans Twilio
# https://www.twilio.com/console/phone-numbers/incoming

# Vérifier les logs du serveur
npm run dev:server
```

## 📚 Ressources

- [Script de Test](./scripts/test-e2e-flow.ts)
- [Script de Lancement](./scripts/run-e2e-tests.sh)
- [Configuration Twilio Webhook](./TWILIO_WEBHOOK_SETUP.md)
- [Documentation API](./server/README.md)

## ✅ Checklist de Validation

Avant de déployer en production :

- [ ] Tests E2E rapides passent (7/7)
- [ ] Tests E2E complets passent (8/8)
- [ ] SMS reçus avec le bon format
- [ ] Webhook Twilio configuré et actif
- [ ] Statut des contacts mis à jour en temps réel
- [ ] Check-in annule correctement l'alerte
- [ ] Testé sur Expo Go (iPhone/Android réel)
- [ ] Logs du serveur clairs et sans erreurs

## 🚀 Prochaines Étapes

1. **Configurer le webhook Twilio** — Voir [TWILIO_WEBHOOK_SETUP.md](./TWILIO_WEBHOOK_SETUP.md)
2. **Tester sur Expo Go** — Scanner le QR code pour tester sur appareil réel
3. **Déployer en production** — Utiliser le bouton Publish dans l'UI Manus

---

**Questions ?** Consultez la documentation ou contactez le support.
