# Guide de Test - Module Administrateur

## 📋 Vue d'ensemble

Ce document décrit comment tester le module Administrateur nouvellement implémenté pour l'application Cabinet Médical. Le module permet la gestion complète des cabinets, comptes utilisateurs et médicaments avec connexion PostgreSQL.

## 🔧 Prérequis

1. PostgreSQL installé et en cours d'exécution
2. Base de données `cabinet_medical` créée
3. Java 17+ installé
4. Node.js 16+ et npm installés
5. Maven installé

## 📦 Installation et Configuration

### 1. Cloner le projet
```bash
git clone https://github.com/hasnaeaqe/front_app.git
cd front_app
git checkout copilot/fix-admin-module-postgresql
```

### 2. Configurer la base de données

#### a. Créer la base de données (si ce n'est pas déjà fait)
```bash
psql -U postgres
CREATE DATABASE cabinet_medical;
\q
```

#### b. Appliquer le schéma initial
```bash
psql -U postgres -d cabinet_medical -f database_complete.sql
```

#### c. Appliquer les mises à jour pour le module admin
```bash
psql -U postgres -d cabinet_medical -f backend/database_updates.sql
```

#### d. Vérifier les modifications
```sql
psql -U postgres -d cabinet_medical

-- Vérifier que la table activite_admin existe
\d activite_admin

-- Vérifier les nouvelles colonnes dans cabinet
\d cabinet

-- Vérifier les nouvelles colonnes dans medicament
\d medicament

-- Vérifier les nouvelles colonnes dans utilisateurs
\d utilisateurs

\q
```

### 3. Configuration Backend

#### a. Vérifier application.properties
```bash
cat backend/src/main/resources/application.properties
```

Assurez-vous que les paramètres suivants sont corrects:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cabinet_medical
spring.datasource.username=postgres
spring.datasource.password=votre_mot_de_passe
```

#### b. Compiler et lancer le backend
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

Le backend devrait démarrer sur `http://localhost:8080`

### 4. Configuration Frontend

#### a. Installer les dépendances
```bash
cd ..  # retour à la racine
npm install
```

#### b. Lancer le frontend
```bash
npm start
```

Le frontend devrait s'ouvrir automatiquement sur `http://localhost:3000`

## 🧪 Scénarios de Test

### Test 1: Connexion Administrateur

1. Accéder à `http://localhost:3000/login`
2. Se connecter avec un compte administrateur:
   - Email: `admin@cabinet.com`
   - Mot de passe: `password123`
3. **Résultat attendu**: Redirection vers `/admin/dashboard`

### Test 2: Dashboard - Statistiques en Temps Réel

1. Vérifier que le dashboard affiche:
   - ✅ Nombre de cabinets actifs / total
   - ✅ Nombre de comptes utilisateurs (médecins + secrétaires)
   - ✅ Nombre total de médicaments
   - ✅ Nombre de services actifs
   - ✅ Liste des 5 cabinets récents avec nombre de médecins
   - ✅ Liste des 10 dernières activités admin

2. **Résultat attendu**: Toutes les données proviennent de la base de données (pas de données statiques)

### Test 3: Gestion des Cabinets

#### A. Accéder à la page Cabinets
1. Cliquer sur "Cabinets" dans la navigation
2. **Résultat attendu**: Page `/admin/cabinets` s'affiche avec liste des cabinets

#### B. Créer un nouveau cabinet
1. Cliquer sur "Nouveau Cabinet"
2. Remplir le formulaire:
   - Nom: `Cabinet Test`
   - Adresse: `123 Rue Test, Casablanca`
   - Téléphone: `0522123456`
   - Email: `test@cabinet.com`
   - Actif: coché
3. Cliquer sur "Créer"
4. **Résultats attendus**:
   - ✅ Message toast "Cabinet créé avec succès"
   - ✅ Cabinet apparaît dans la liste
   - ✅ Activité enregistrée dans la BD (vérifier dans Dashboard > Activité Récente)

#### C. Modifier un cabinet
1. Cliquer sur l'icône "Modifier" (crayon) d'un cabinet
2. Modifier les informations
3. Cliquer sur "Modifier"
4. **Résultats attendus**:
   - ✅ Message toast "Cabinet modifié avec succès"
   - ✅ Modifications visibles dans la liste
   - ✅ Activité de modification enregistrée

#### D. Activer/Désactiver un cabinet
1. Cliquer sur l'icône "Power" d'un cabinet actif
2. **Résultats attendus**:
   - ✅ Message toast "Cabinet désactivé avec succès"
   - ✅ Badge passe de "Actif" (vert) à "Inactif" (gris)
   - ✅ Activité toggle enregistrée

#### E. Supprimer un cabinet
1. Cliquer sur l'icône "Corbeille" d'un cabinet
2. Confirmer la suppression
3. **Résultats attendus**:
   - ✅ Message de confirmation avant suppression
   - ✅ Message toast "Cabinet supprimé avec succès"
   - ✅ Cabinet disparaît de la liste
   - ✅ Activité de suppression enregistrée

#### F. Recherche de cabinets
1. Taper un nom de cabinet dans la barre de recherche
2. **Résultat attendu**: Liste filtrée en temps réel

### Test 4: Gestion des Comptes

#### A. Accéder à la page Comptes
1. Cliquer sur "Comptes" dans la navigation
2. **Résultat attendu**: Page `/admin/comptes` s'affiche avec liste des utilisateurs (médecins et secrétaires uniquement)

#### B. Créer un nouveau compte médecin
1. Cliquer sur "Nouveau Compte"
2. Remplir le formulaire:
   - Nom: `Alaoui`
   - Prénom: `Ahmed`
   - Email: `ahmed.alaoui@test.com`
   - Mot de passe: `Test123456`
   - Rôle: `Médecin`
   - Téléphone: `0661234567`
   - Cabinet: sélectionner un cabinet
   - Spécialité: sélectionner une spécialité
   - Actif: coché
3. Cliquer sur "Créer"
4. **Résultats attendus**:
   - ✅ Message toast "Compte créé avec succès"
   - ✅ Compte apparaît dans la liste avec badge violet "Médecin"
   - ✅ Mot de passe haché avec SHA-256 en BD
   - ✅ Activité enregistrée

#### C. Créer un compte secrétaire
1. Répéter avec Rôle: `Secrétaire`
2. **Résultat attendu**: Badge bleu "Secrétaire"

#### D. Modifier un compte
1. Cliquer sur l'icône "Modifier"
2. Modifier les informations (ne pas modifier le mot de passe)
3. Cliquer sur "Modifier"
4. **Résultats attendus**:
   - ✅ Message toast "Compte modifié avec succès"
   - ✅ Modifications visibles
   - ✅ Mot de passe inchangé en BD

#### E. Changer le mot de passe
1. Modifier un compte
2. Entrer un nouveau mot de passe
3. Sauvegarder
4. **Résultats attendus**:
   - ✅ Nouveau mot de passe haché avec SHA-256
   - ✅ Connexion possible avec nouveau mot de passe

#### F. Activer/Désactiver un compte
1. Cliquer sur l'icône "Power"
2. **Résultats attendus**:
   - ✅ Message toast approprié
   - ✅ Badge statut mis à jour
   - ✅ Compte désactivé ne peut plus se connecter

#### G. Supprimer un compte
1. Cliquer sur l'icône "Corbeille"
2. Confirmer
3. **Résultats attendus**:
   - ✅ Confirmation demandée
   - ✅ Suppression réussie
   - ✅ Activité enregistrée

#### H. Recherche de comptes
1. Taper un nom, prénom ou email
2. **Résultat attendu**: Filtre en temps réel

### Test 5: Gestion des Médicaments

#### A. Accéder à la page Médicaments
1. Cliquer sur "Médicaments" dans la navigation
2. **Résultat attendu**: Page `/admin/medicaments` s'affiche avec liste des médicaments

#### B. Créer un nouveau médicament
1. Cliquer sur "Nouveau Médicament"
2. Remplir le formulaire:
   - Nom: `Doliprane 1000mg`
   - Catégorie: `Antalgique`
   - Fabricant: `Sanofi`
   - Description: `Médicament contre la douleur et la fièvre`
   - Posologie: `1 comprimé toutes les 6 heures`
3. Cliquer sur "Créer"
4. **Résultats attendus**:
   - ✅ Message toast "Médicament créé avec succès"
   - ✅ Médicament apparaît avec badge cyan pour la catégorie
   - ✅ Activité enregistrée

#### C. Modifier un médicament
1. Cliquer sur l'icône "Modifier"
2. Modifier les informations
3. Sauvegarder
4. **Résultats attendus**:
   - ✅ Modifications appliquées
   - ✅ Activité enregistrée

#### D. Supprimer un médicament
1. Cliquer sur l'icône "Corbeille"
2. Confirmer
3. **Résultats attendus**:
   - ✅ Confirmation demandée
   - ✅ Suppression réussie
   - ✅ Activité enregistrée

#### E. Recherche de médicaments
1. Taper un nom ou une catégorie
2. **Résultat attendu**: Recherche dans le nom ET la catégorie

### Test 6: Logs d'Activité

1. Retourner au Dashboard
2. Vérifier la section "Activité Récente"
3. **Résultats attendus**:
   - ✅ Toutes les actions effectuées sont loggées
   - ✅ Format: "[TYPE] Titre - Description - Il y a X minutes/heures/jours"
   - ✅ Icônes appropriées selon le type d'action
   - ✅ Ordre chronologique décroissant

### Test 7: Vérification Base de Données

#### A. Vérifier les données en BD
```sql
psql -U postgres -d cabinet_medical

-- Vérifier les cabinets
SELECT id, nom, actif FROM cabinet;

-- Vérifier les utilisateurs (SHA-256)
SELECT id, nom, prenom, email, LEFT(mot_de_passe, 10) as pwd_hash, role, cabinet_id, specialite_id, actif 
FROM utilisateurs WHERE role IN ('MEDECIN', 'SECRETAIRE');

-- Vérifier les médicaments
SELECT id, nom, categorie, fabricant FROM medicament;

-- Vérifier les logs d'activité
SELECT * FROM activite_admin ORDER BY date_creation DESC LIMIT 10;
```

#### B. Vérifier le hachage SHA-256
1. Créer un compte avec mot de passe `test123`
2. Vérifier en BD: le hash devrait être `ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae`

### Test 8: Tests de Validation

#### A. Validation côté client
1. Essayer de créer un cabinet sans nom
2. **Résultat attendu**: Message d'erreur "Le nom est requis"

3. Essayer de créer un compte avec email invalide
4. **Résultat attendu**: Message "Email invalide"

5. Essayer de créer un compte avec mot de passe < 6 caractères
6. **Résultat attendu**: Message "Le mot de passe doit contenir au moins 6 caractères"

#### B. Validation côté serveur
1. Essayer de créer un compte avec email déjà existant
2. **Résultat attendu**: Erreur 400 "Un utilisateur avec cet email existe déjà"

### Test 9: Tests d'Intégration

1. Créer un cabinet
2. Créer un médecin associé à ce cabinet
3. Vérifier que le nombre de médecins du cabinet s'incrémente
4. Désactiver le cabinet
5. Vérifier l'impact sur les statistiques du dashboard

## 📊 Checklist Finale

- [ ] ✅ Dashboard affiche vraies stats depuis BD
- [ ] ✅ CRUD Cabinets fonctionne complètement
- [ ] ✅ CRUD Comptes fonctionne complètement
- [ ] ✅ CRUD Médicaments fonctionne complètement
- [ ] ✅ Mots de passe hachés avec SHA-256
- [ ] ✅ Tous les logs d'activité enregistrés
- [ ] ✅ Messages toast affichés correctement
- [ ] ✅ Recherche en temps réel fonctionne
- [ ] ✅ Badges de couleur corrects (Actif=vert, Inactif=gris, Médecin=violet, Secrétaire=bleu)
- [ ] ✅ Confirmations avant suppression
- [ ] ✅ Aucune donnée hardcodée
- [ ] ✅ Design conforme aux images

## 🐛 Résolution des Problèmes

### Le backend ne démarre pas
- Vérifier que PostgreSQL est en cours d'exécution
- Vérifier les credentials dans `application.properties`
- Vérifier que le port 8080 n'est pas déjà utilisé

### Le frontend ne se connecte pas au backend
- Vérifier que le backend est démarré sur port 8080
- Vérifier la configuration dans `src/services/api.js`
- Ouvrir la console du navigateur pour voir les erreurs

### Erreur "Table does not exist"
- Exécuter `database_complete.sql` puis `database_updates.sql`
- Vérifier la connexion à la bonne base de données

### Les statistiques n'apparaissent pas
- Vérifier que des données existent en BD
- Ouvrir les DevTools et vérifier les appels API
- Vérifier les logs du backend

## 📝 Notes Importantes

1. **Sécurité**: En production, utiliser des mots de passe plus robustes et une méthode de hachage plus sécurisée (bcrypt au lieu de SHA-256)
2. **Performance**: Ajouter de la pagination si les listes deviennent trop grandes
3. **Backup**: Faire des backups réguliers de la base de données
4. **Logs**: Les logs d'activité peuvent grossir rapidement - prévoir un système d'archivage

## ✅ Conclusion

Si tous les tests passent, le module Administrateur est prêt pour la production! 🎉
