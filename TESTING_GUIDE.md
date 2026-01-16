# Guide de Test - Cabinet Médical

Ce guide vous aide à tester l'application complète après l'installation.

## Prérequis pour les Tests

1. PostgreSQL installé et démarré
2. Base de données `cabinet_medical` créée avec le script SQL exécuté
3. Backend Spring Boot démarré sur le port 8080
4. Frontend React démarré sur le port 3000

## 1. Test du Backend (Sans Frontend)

### Test 1: Health Check

```bash
curl http://localhost:8080/api/health
```

**Résultat attendu:**
```json
{
  "status": "UP"
}
```

### Test 2: Authentification

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cabinet.com",
    "password": "password123"
  }'
```

**Résultat attendu:**
```json
{
  "id": 1,
  "nom": "Admin",
  "prenom": "System",
  "email": "admin@cabinet.com",
  "role": "ADMINISTRATEUR",
  "token": "generated-token-here"
}
```

### Test 3: Liste des Patients

```bash
curl http://localhost:8080/api/patients
```

**Résultat attendu:** Array JSON avec 6 patients

### Test 4: Recherche de Patient

```bash
curl "http://localhost:8080/api/patients/search?query=Ahmed"
```

**Résultat attendu:** Patients contenant "Ahmed" dans le nom ou prénom

### Test 5: Créer un Patient

```bash
curl -X POST http://localhost:8080/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "cin": "TEST123",
    "nom": "Test",
    "prenom": "Patient",
    "dateNaissance": "1990-01-01",
    "sexe": "M",
    "numTel": "0612345678",
    "email": "test@example.com",
    "adresse": "123 Rue Test",
    "typeMutuelle": "CNSS"
  }'
```

**Résultat attendu:** Patient créé avec ID généré

### Test 6: Liste des Rendez-vous

```bash
curl http://localhost:8080/api/rendez-vous
```

**Résultat attendu:** Array JSON avec les rendez-vous

### Test 7: Rendez-vous d'un Médecin

```bash
curl "http://localhost:8080/api/rendez-vous/medecin/2"
```

**Résultat attendu:** Rendez-vous du médecin avec ID 2

### Test 8: Liste des Médicaments

```bash
curl http://localhost:8080/api/medicaments
```

**Résultat attendu:** Array JSON avec 6 médicaments

## 2. Test du Frontend (Interface Utilisateur)

### Test 1: Page de Connexion

1. Ouvrir http://localhost:3000
2. Vérifier que le formulaire de connexion s'affiche
3. Les comptes de test sont affichés (en développement)

### Test 2: Connexion Réussie

1. Email: `admin@cabinet.com`
2. Mot de passe: `password123`
3. Cliquer sur "Se connecter"
4. Vérifier la redirection vers la page des patients
5. Vérifier l'affichage du nom dans l'en-tête

### Test 3: Connexion Échouée

1. Entrer un email incorrect
2. Vérifier l'affichage du message d'erreur en rouge

### Test 4: Liste des Patients

1. Après connexion, vérifier l'affichage de la liste des patients
2. Vérifier que 6 patients sont affichés
3. Vérifier les colonnes: CIN, Nom, Prénom, Date de naissance, Sexe, Téléphone, Mutuelle

### Test 5: Recherche de Patient

1. Taper "Ahmed" dans la barre de recherche
2. Appuyer sur Entrée ou cliquer sur "Rechercher"
3. Vérifier que seuls les patients contenant "Ahmed" sont affichés

### Test 6: Actualiser la Liste

1. Cliquer sur le bouton "Actualiser"
2. Vérifier que la liste complète des patients se recharge

### Test 7: Déconnexion

1. Cliquer sur "Déconnexion" en haut à droite
2. Vérifier la redirection vers la page de connexion
3. Vérifier que le token est supprimé du localStorage

## 3. Test d'Intégration Frontend-Backend

### Test de Flux Complet

1. **Démarrer Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Attendre le message "Started CabinetMedicalApplication"

2. **Démarrer Frontend:**
   ```bash
   npm start
   ```
   Le navigateur s'ouvre automatiquement sur http://localhost:3000

3. **Test du Flux:**
   - Connexion avec admin@cabinet.com / password123
   - Vérifier l'affichage des patients depuis la base de données
   - Rechercher un patient
   - Déconnexion
   - Reconnecter avec medecin1@cabinet.com / password123

## 4. Test de la Base de Données

### Vérification des Mots de Passe Hachés

```sql
-- Se connecter à PostgreSQL
psql -U postgres -d cabinet_medical

-- Vérifier les mots de passe (doivent être des hash SHA-256)
SELECT email, mot_de_passe FROM utilisateurs;

-- Résultat attendu: tous les mots de passe doivent commencer par ef92b778...
```

### Vérification des Données

```sql
-- Compter les patients
SELECT COUNT(*) FROM patient;
-- Résultat attendu: 6

-- Compter les rendez-vous
SELECT COUNT(*) FROM rendez_vous;
-- Résultat attendu: 6

-- Compter les médecins
SELECT COUNT(*) FROM utilisateurs WHERE role = 'MEDECIN';
-- Résultat attendu: 4
```

## 5. Test des Erreurs

### Test 1: Authentification Échouée

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@email.com",
    "password": "wrongpass"
  }'
```

**Résultat attendu:** HTTP 401 avec message d'erreur

### Test 2: Patient Inexistant

```bash
curl http://localhost:8080/api/patients/999
```

**Résultat attendu:** HTTP 404 avec message d'erreur

### Test 3: Données Invalides

```bash
curl -X POST http://localhost:8080/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "cin": "",
    "nom": ""
  }'
```

**Résultat attendu:** HTTP 400 avec erreurs de validation

## 6. Test de Performance

### Test de Charge (Optionnel)

Avec Apache Bench (ab):

```bash
# Installer ab (si nécessaire)
sudo apt-get install apache2-utils

# Test de charge sur health check
ab -n 1000 -c 10 http://localhost:8080/api/health

# Test de charge sur liste patients
ab -n 100 -c 5 http://localhost:8080/api/patients
```

## 7. Vérification des Logs

### Logs Backend

Les logs du backend s'affichent dans la console où vous avez lancé `mvn spring-boot:run`.

**Vérifier:**
- Messages de connexion à la base de données
- Requêtes SQL (si `spring.jpa.show-sql=true`)
- Pas d'erreurs ou de stacktraces

### Logs Frontend

1. Ouvrir la Console du navigateur (F12)
2. Onglet "Console"
3. Vérifier l'absence d'erreurs JavaScript
4. Vérifier les requêtes réseau dans l'onglet "Network"

## 8. Test CORS

### Vérification CORS

1. Ouvrir http://localhost:3000
2. Ouvrir la Console (F12)
3. Se connecter
4. Vérifier dans l'onglet Network que les requêtes à localhost:8080 réussissent
5. Pas d'erreur CORS dans la console

## 9. Checklist de Validation Complète

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Health check retourne "UP"
- [ ] Connexion avec admin fonctionne
- [ ] Liste des patients s'affiche
- [ ] Recherche de patients fonctionne
- [ ] Déconnexion fonctionne
- [ ] Toutes les requêtes API réussissent
- [ ] Pas d'erreurs CORS
- [ ] Mots de passe hachés en SHA-256
- [ ] Toutes les données de test présentes dans la DB

## 10. Résolution des Problèmes de Test

### Problème: Backend ne démarre pas

**Solution:**
1. Vérifier que PostgreSQL est démarré
2. Vérifier les credentials dans `application.properties`
3. Vérifier les logs pour l'erreur exacte

### Problème: Erreur 401 lors de la connexion

**Solution:**
1. Vérifier que les mots de passe sont hachés en SHA-256
2. Vérifier que l'email existe dans la base
3. Vérifier les logs backend pour voir l'erreur

### Problème: Erreur CORS

**Solution:**
1. Vérifier que `CorsConfig.java` permet `http://localhost:3000`
2. Redémarrer le backend après modification
3. Vider le cache du navigateur

### Problème: Liste des patients vide

**Solution:**
1. Vérifier que le script SQL a été exécuté
2. Exécuter `SELECT * FROM patient` dans PostgreSQL
3. Vérifier les logs backend pour voir les requêtes SQL

## 11. Rapporter un Problème

Si un test échoue:

1. Noter le test qui échoue
2. Copier le message d'erreur complet
3. Vérifier les logs backend et frontend
4. Vérifier la base de données
5. Créer une issue GitHub avec:
   - Description du problème
   - Étapes pour reproduire
   - Logs d'erreur
   - Configuration système

## Conclusion

Si tous les tests passent, l'application est prête pour:
- Développement de fonctionnalités supplémentaires
- Tests utilisateurs
- Déploiement en environnement de test
- Documentation utilisateur

Pour un déploiement en production, consulter la documentation de sécurité et effectuer des tests de sécurité supplémentaires.
