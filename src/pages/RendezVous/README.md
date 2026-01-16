# Gestion des Rendez-vous (Appointment Management)

Système complet de gestion des rendez-vous pour le cabinet médical.

## Fonctionnalités

### 📅 Vue Calendrier
- **Calendrier interactif** avec locale française
- **Marqueurs visuels** sur les dates avec rendez-vous (points bleus)
- **Sélection de date** pour filtrer les rendez-vous
- **Liste filtrée** affichant tous les RDV pour la date sélectionnée
- **Actions rapides** : Voir, Modifier, Confirmer, Annuler

### 📋 Vue Liste
- **Filtres temporels** : Aujourd'hui / Cette semaine / Tous
- **Filtre par statut** : Tous, En attente, Confirmé, Annulé, Terminé
- **Tableau complet** avec colonnes :
  - Date & Heure
  - Patient
  - Médecin
  - Motif
  - Statut (badge coloré)
  - Actions (icônes)

### ➕ Création/Modification de RDV
- **Recherche patient intelligente** :
  - Autocomplete avec recherche par nom ou CIN
  - Affichage des résultats en temps réel
  - Sélection facile depuis la liste déroulante
- **Sélection médecin** : Liste déroulante avec spécialité
- **Date picker** : Sélection de date
- **Time picker** : Sélection de l'heure
- **Motif** : Champ texte pour le motif de consultation
- **Notes** : Champ optionnel pour informations additionnelles
- **Validation des champs** obligatoires

### 🔄 Gestion des Statuts
Workflow des statuts :
1. **EN_ATTENTE** (Jaune) → Nouveau RDV créé
2. **CONFIRME** (Bleu) → RDV confirmé par le patient/secrétaire
3. **TERMINE** (Vert) → Consultation terminée
4. **ANNULE** (Rouge) → RDV annulé

Actions rapides :
- Bouton ✓ pour confirmer un RDV en attente
- Bouton ✓ pour terminer un RDV confirmé
- Bouton ✗ pour annuler un RDV

### 🔍 Filtres et Recherche
- **Filtrage par date** dans la vue calendrier
- **Filtrage temporel** dans la vue liste
- **Filtrage par statut** dans les deux vues
- **Tri chronologique** automatique

## Structure des Données

### Rendez-vous
```javascript
{
  id: number,
  patientId: number,
  patientNom: string,
  patientPrenom: string,
  medecinId: number,
  medecinNom: string,
  medecinPrenom: string,
  medecinSpecialite: string,
  date: string, // Format: 'YYYY-MM-DD'
  heure: string, // Format: 'HH:MM'
  motif: string,
  notes: string,
  statut: 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE' | 'TERMINE'
}
```

## API Endpoints

### Récupérer tous les RDV
```javascript
GET /api/rendez-vous?date=...&statut=...
```

### Créer un RDV
```javascript
POST /api/rendez-vous
Body: { patientId, medecinId, date, heure, motif, notes, statut }
```

### Modifier un RDV
```javascript
PUT /api/rendez-vous/:id
Body: { patientId, medecinId, date, heure, motif, notes, statut }
```

### Supprimer/Annuler un RDV
```javascript
DELETE /api/rendez-vous/:id
// Ou mettre à jour le statut à 'ANNULE'
```

### Rechercher des patients
```javascript
GET /api/patients/search?query=...
```

## Utilisation

### Import
```javascript
import RendezVousList from './pages/RendezVous/RendezVousList';
// ou
import { RendezVousList } from './pages/RendezVous';
```

### Dans l'application
```javascript
<Route path="/rendez-vous" element={<RendezVousList />} />
```

## Composants UI Utilisés

- **DashboardLayout** : Layout principal avec navigation
- **Card** : Cartes pour sections
- **Button** : Boutons avec variants (primary, outline, danger)
- **Modal** : Modales pour formulaires et confirmations
- **Input** : Champs de saisie
- **Badge** : Badges colorés pour statuts
- **Table** : Tableau pour vue liste
- **react-calendar** : Composant calendrier
- **lucide-react** : Icônes
- **react-hot-toast** : Notifications toast

## Styling

### Couleurs des Statuts
- **EN_ATTENTE** : `bg-yellow-100 text-yellow-800` (Warning)
- **CONFIRME** : `bg-blue-100 text-blue-800` (Info)
- **ANNULE** : `bg-red-100 text-red-800` (Danger)
- **TERMINE** : `bg-green-100 text-green-800` (Success)

### Calendrier
- **Jour sélectionné** : Fond bleu (#2563eb)
- **Aujourd'hui** : Fond bleu clair (#dbeafe)
- **Jour avec RDV** : Point bleu en dessous
- **Hover** : Fond gris clair

## États de Chargement

- **Loading** : Spinner animé pendant le chargement
- **Empty states** : Messages et icônes quand aucun RDV
- **Error states** : Bannière rouge avec message d'erreur

## Responsive Design

- **Mobile** : Vue en colonne unique
- **Tablet** : Vue calendrier en 2 colonnes
- **Desktop** : Vue calendrier en 3 colonnes (calendrier + liste)

## Notifications

Toutes les actions importantes déclenchent une notification :
- ✅ Succès : Création, modification, confirmation
- ❌ Erreur : Échecs d'API, validation
- ℹ️ Info : Chargement des données

## Validation

### Champs obligatoires
- Patient (avec recherche)
- Médecin
- Date
- Heure
- Motif

### Champs optionnels
- Notes

## Mode Développement

Le composant inclut des données mock pour le développement :
- 5 patients exemple
- 4 médecins exemple
- 6 rendez-vous exemple avec différents statuts

Pour activer les vraies API, décommenter les appels dans `loadData()` et `handleSubmit()`.

## Fonctionnalités Avancées

### Autocomplete Patient
- Recherche en temps réel
- Filtrage par nom ou CIN
- Affichage de la fiche patient (CIN, téléphone)
- Fermeture automatique après sélection

### Gestion des Conflits
- Tri chronologique automatique
- Vue claire des horaires
- Identification rapide des créneaux occupés

### Workflow
1. Secrétaire crée un RDV → Statut EN_ATTENTE
2. Patient confirme → Statut CONFIRME
3. Médecin voit le patient → Statut TERMINE
4. En cas d'absence → Statut ANNULE

## Performance

- **Filtrage côté client** pour une UX fluide
- **Lazy loading** possible pour grandes quantités de données
- **Memoization** des calculs de filtre
- **Debounce** sur la recherche patient

## Accessibilité

- Labels sur tous les formulaires
- Raccourcis clavier (Escape pour fermer modales)
- Boutons avec aria-labels
- Contraste des couleurs conforme WCAG
- Navigation au clavier

## Maintenance

### Ajouter un nouveau statut
1. Ajouter dans `statusConfig` dans `getStatusBadge()`
2. Ajouter dans les options du select de filtrage
3. Ajouter dans les options du formulaire
4. Mettre à jour le type TypeScript si utilisé

### Modifier les couleurs
Éditer les classes Tailwind dans :
- `getStatusBadge()` pour les badges
- Style JSX pour le calendrier

### Ajouter un champ
1. Ajouter dans `formData` initial state
2. Ajouter le champ dans le formulaire modal
3. Ajouter dans les objets de données mock
4. Mettre à jour l'affichage dans les cartes/tableaux

## Dépendances

```json
{
  "react": "^19.2.3",
  "react-calendar": "^6.0.0",
  "date-fns": "^4.1.0",
  "lucide-react": "^0.562.0",
  "react-hot-toast": "^2.6.0"
}
```

## Fichiers

```
src/pages/RendezVous/
├── RendezVousList.js    # Composant principal
├── index.js             # Export
└── README.md           # Documentation
```

## Support

Pour toute question ou problème :
1. Vérifier la console pour les erreurs
2. Vérifier les appels API dans l'onglet Network
3. Vérifier les données mock en mode développement
4. Consulter la documentation des composants UI

---

Créé pour le Cabinet Médical - Gestion moderne des rendez-vous
