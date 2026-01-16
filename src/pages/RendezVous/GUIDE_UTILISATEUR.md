# Guide d'Utilisation - Gestion des Rendez-vous

## Accès rapide
```
/secretaire/rendez-vous - Vue secrétaire
```

## Vue Calendrier (Par défaut)

### Navigation
1. **Sélectionner une date** : Cliquez sur n'importe quelle date du calendrier
2. **Jours avec RDV** : Identifiés par un point bleu sous la date
3. **Aujourd'hui** : Surligné en bleu clair
4. **Date sélectionnée** : Fond bleu foncé

### Actions sur les rendez-vous
- **✓ Vert** : Confirmer un RDV en attente
- **✓ Bleu** : Marquer un RDV confirmé comme terminé
- **✎ Crayon** : Modifier le RDV
- **✗ Rouge** : Annuler le RDV

## Vue Liste

### Filtres disponibles
1. **Période** :
   - Aujourd'hui : Tous les RDV du jour
   - Cette semaine : RDV de la semaine en cours
   - Tous : Tous les RDV

2. **Statut** :
   - Tous les statuts
   - En Attente (Jaune)
   - Confirmé (Bleu)
   - Annulé (Rouge)
   - Terminé (Vert)

## Créer un Rendez-vous

1. Cliquez sur **"+ Nouveau RDV"**
2. **Rechercher le patient** :
   - Tapez le nom ou CIN dans la barre de recherche
   - Sélectionnez le patient dans la liste déroulante
3. **Sélectionner le médecin** depuis le menu déroulant
4. **Choisir la date** avec le sélecteur de date
5. **Choisir l'heure** avec le sélecteur d'heure
6. **Entrer le motif** de la consultation (obligatoire)
7. **Ajouter des notes** (optionnel)
8. Cliquer sur **"Créer"**

## Modifier un Rendez-vous

1. Cliquez sur l'icône **✎ Crayon** du RDV à modifier
2. Le formulaire s'ouvre avec les données actuelles
3. Modifiez les champs nécessaires
4. Changez le statut si besoin
5. Cliquez sur **"Modifier"**

## Annuler un Rendez-vous

1. Cliquez sur l'icône **✗ Rouge** du RDV
2. Confirmez l'annulation dans la boîte de dialogue
3. Le RDV passe au statut "Annulé"

## Workflow des Statuts

```
EN_ATTENTE (Jaune) 
    ↓ [Clic sur ✓]
CONFIRME (Bleu)
    ↓ [Clic sur ✓]
TERMINE (Vert)
```

À tout moment : **✗** → ANNULE (Rouge)

## Raccourcis Clavier

- **ESC** : Fermer les modales

## Codes Couleurs

| Statut | Couleur | Signification |
|--------|---------|---------------|
| EN_ATTENTE | 🟡 Jaune | RDV créé, en attente de confirmation |
| CONFIRME | 🔵 Bleu | Patient a confirmé sa présence |
| TERMINE | 🟢 Vert | Consultation effectuée |
| ANNULE | 🔴 Rouge | RDV annulé |

## Notifications

Toutes les actions affichent une notification :
- ✅ **Succès** : Création, modification, confirmation
- ❌ **Erreur** : Problèmes de connexion, validation
- ℹ️ **Info** : Chargement des données

## Astuces

1. **Planification rapide** : 
   - Vue calendrier pour voir les créneaux libres
   - Cliquez sur une date vide pour créer un RDV

2. **Gestion quotidienne** :
   - Vue liste avec filtre "Aujourd'hui"
   - Confirmez les RDV en attente
   - Marquez les consultations terminées

3. **Recherche patient** :
   - Le CIN est plus rapide si vous l'avez
   - La recherche par nom fonctionne avec nom partiel

4. **Éviter les conflits** :
   - Vérifiez les horaires existants dans la vue calendrier
   - Les RDV sont triés chronologiquement

## Résolution de Problèmes

### La liste est vide
- Vérifiez les filtres actifs
- Changez de période (Semaine/Tous)
- Vérifiez le filtre de statut

### Patient non trouvé
- Vérifiez l'orthographe
- Utilisez le CIN si disponible
- Le patient doit être créé d'abord dans "Gestion des Patients"

### Impossible de créer un RDV
- Vérifiez que tous les champs obligatoires (*) sont remplis
- Patient et Médecin doivent être sélectionnés
- Date et heure doivent être valides
- Le motif est obligatoire

## Support

Pour des questions ou problèmes :
1. Consultez la console navigateur (F12)
2. Vérifiez votre connexion internet
3. Contactez l'administrateur système
