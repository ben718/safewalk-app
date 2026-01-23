# SafeWalk - Design System

Ce document définit les règles de cohérence du design pour toute l'application.

---

## 🎨 Palette de Couleurs

### Couleurs Principales
- **Primary** : `#3A86FF` - Boutons principaux, liens, accents
- **Background** : `#FFFFFF` (light) / `#151718` (dark)
- **Foreground** : `#11181C` (light) / `#ECEDEE` (dark) - Texte principal
- **Muted** : `#687076` (light) / `#9BA1A6` (dark) - Texte secondaire

### Couleurs Sémantiques
- **Success** : `#22C55E` (light) / `#4ADE80` (dark) - Confirmations, succès
- **Warning** : `#F59E0B` (light) / `#FBBF24` (dark) - Avertissements
- **Error** : `#EF4444` (light) / `#F87171` (dark) - Erreurs, danger

### Couleurs Spécifiques
- **Surface** : `#F5F5F5` (light) / `#1E2022` (dark) - Cartes, surfaces élevées
- **Border** : `#E5E7EB` (light) / `#334155` (dark) - Bordures, séparateurs

---

## 📝 Typographie

### Titres
- **H1** : `text-5xl font-bold text-foreground` (48px) - Titre principal de page
- **H2** : `text-4xl font-bold text-foreground` (36px) - Sections principales
- **H3** : `text-2xl font-bold text-foreground` (24px) - Sous-sections
- **H4** : `text-xl font-semibold text-foreground` (20px) - Titres de cartes

### Corps de Texte
- **Body Large** : `text-base text-foreground` (16px) - Texte principal
- **Body** : `text-sm text-foreground` (14px) - Texte standard
- **Body Small** : `text-xs text-muted` (12px) - Texte secondaire, légendes

### Labels
- **Label** : `text-sm font-semibold text-foreground` - Labels de formulaires
- **Caption** : `text-xs text-muted uppercase tracking-wider` - Catégories, sections

---

## 🔘 Boutons

### Bouton Primaire (Actions principales)
```tsx
<Pressable className="bg-primary px-6 py-4 rounded-2xl">
  <Text className="text-base font-bold text-white text-center">
    Texte du bouton
  </Text>
</Pressable>
```
- Couleur : `bg-primary` (#3A86FF)
- Texte : Blanc, gras, 16px
- Padding : 16px vertical, 24px horizontal
- Border radius : 16px

### Bouton Secondaire (Actions secondaires)
```tsx
<Pressable className="bg-surface border border-border px-6 py-4 rounded-2xl">
  <Text className="text-base font-semibold text-foreground text-center">
    Texte du bouton
  </Text>
</Pressable>
```
- Couleur : `bg-surface` avec bordure
- Texte : Foreground, semi-gras, 16px

### Bouton Danger (Actions destructives)
```tsx
<Pressable className="bg-error px-6 py-4 rounded-2xl">
  <Text className="text-base font-bold text-white text-center">
    Supprimer
  </Text>
</Pressable>
```
- Couleur : `bg-error` (#EF4444)
- Texte : Blanc, gras, 16px

### Bouton Texte (Actions tertiaires)
```tsx
<Pressable>
  <Text className="text-base font-semibold text-primary text-center">
    Action
  </Text>
</Pressable>
```
- Pas de background
- Texte : Primary, semi-gras, 16px

---

## 📦 Composants

### GlassCard
```tsx
<GlassCard className="p-4 gap-3">
  {/* Contenu */}
</GlassCard>
```
- Padding : 16px
- Gap : 12px entre les éléments
- Background : Semi-transparent avec blur

### StatusCard
```tsx
<StatusCard
  status="active" // ou "inactive"
  title="Titre"
  subtitle="Sous-titre"
  onPress={() => {}}
/>
```
- Status active : Vert (#22C55E)
- Status inactive : Gris (#687076)

---

## ✅ Messages de Feedback

### Toast Success
```
✅ [Action réussie]
Exemples:
- ✅ Contact sauvegardé
- ✅ SMS envoyé à [nom]
- ✅ Session terminée
```

### Toast Error
```
❌ [Raison de l'erreur]
Exemples:
- ❌ Numéro invalide
- ❌ API non accessible
- ❌ Échec: [détails]
```

### Toast Info
```
ℹ️ [Information]
Exemples:
- ℹ️ Prénom sauvegardé
- ℹ️ Localisation activée
```

---

## 📐 Espacements

### Padding de Page
- Top : `insets.top + 12`
- Bottom : `insets.bottom + 16`
- Horizontal : `16px`

### Gaps entre Éléments
- Entre sections : `mb-4` (16px)
- Entre cartes : `mb-3` (12px)
- Dans une card : `gap-3` (12px)
- Entre textes : `gap-1` (4px)

---

## 🎭 États Interactifs

### Pressable
```tsx
<Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 }
  ]}
>
```
- Scale : 0.97 quand pressé
- Opacity : 0.9 quand pressé

### Disabled
```tsx
<Pressable disabled={isDisabled} className="opacity-50">
```
- Opacity : 0.5 quand désactivé

---

## 📱 Icônes

### Tailles
- **Small** : 16px - Labels, textes inline
- **Medium** : 20px - Boutons, actions
- **Large** : 24px - Headers, navigation
- **XLarge** : 32px - Hero sections

### Couleurs
- **Primary** : Utiliser la couleur primary (#3A86FF)
- **Muted** : Utiliser la couleur muted pour les icônes secondaires
- **Success** : #22C55E pour les validations
- **Error** : #EF4444 pour les erreurs
- **Warning** : #F59E0B pour les avertissements

---

## ✏️ Formulaires

### Input Text
```tsx
<PopTextField
  placeholder="Texte du placeholder"
  value={value}
  onChangeText={setValue}
/>
```
- Placeholder : Gris clair
- Texte : Foreground
- Border : Border color
- Focus : Primary color

### Validation
- **Valid** : Icône ✓ verte à droite
- **Invalid** : Icône ✗ rouge à droite + message d'erreur en dessous
- **Neutral** : Icône grise à droite

---

## 🚨 Règles de Cohérence

### ✅ À FAIRE
- Utiliser les composants existants (GlassCard, PopTextField, etc.)
- Utiliser les classes Tailwind définies ci-dessus
- Toujours ajouter un feedback utilisateur (toast, loading, etc.)
- Respecter les espacements définis
- Utiliser les couleurs sémantiques (success, error, warning)

### ❌ À ÉVITER
- Créer de nouvelles couleurs sans raison
- Utiliser des tailles de texte non définies
- Oublier les états interactifs (pressed, disabled)
- Mélanger différents styles de boutons sur la même page
- Utiliser des termes techniques dans les messages utilisateur

---

## 📋 Checklist Design

Avant de livrer une page, vérifier :

- [ ] Tous les textes utilisent les classes définies
- [ ] Tous les boutons suivent le design system
- [ ] Les couleurs sont cohérentes avec la palette
- [ ] Les espacements respectent les règles
- [ ] Les états interactifs sont implémentés
- [ ] Les messages d'erreur sont clairs et cohérents
- [ ] Les icônes ont la bonne taille et couleur
- [ ] Le design fonctionne en light et dark mode
- [ ] Aucun terme obsolète (tolérance, etc.)
- [ ] Feedback utilisateur pour toutes les actions
