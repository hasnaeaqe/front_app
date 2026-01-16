# Backend Spring Boot - Cabinet Médical

## Description

Backend Spring Boot pour l'application de gestion de cabinet médical. Ce backend fournit une API REST complète pour gérer les patients, rendez-vous, consultations, ordonnances et factures.

## Technologies Utilisées

- **Java**: 17
- **Spring Boot**: 3.2.1
- **Spring Data JPA**: Persistence des données
- **PostgreSQL**: Base de données
- **Spring Security**: Sécurité et authentification
- **Lombok**: Réduction du code boilerplate
- **Maven**: Gestion des dépendances

## Prérequis

1. **Java JDK 17** ou supérieur
   ```bash
   java -version
   ```

2. **Maven 3.6+**
   ```bash
   mvn -version
   ```

3. **PostgreSQL 12+**
   ```bash
   psql --version
   ```

## Installation et Configuration

### 1. Installation de PostgreSQL

#### Sur Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Sur macOS (avec Homebrew):
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Sur Windows:
Télécharger depuis: https://www.postgresql.org/download/windows/

### 2. Création de la Base de Données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE cabinet_medical;

# Créer un utilisateur (optionnel)
CREATE USER cabinet_user WITH PASSWORD 'cabinet_password';
GRANT ALL PRIVILEGES ON DATABASE cabinet_medical TO cabinet_user;

# Quitter
\q
```

### 3. Exécuter le Script SQL

```bash
# Se connecter à la base de données
psql -U postgres -d cabinet_medical

# Exécuter le script SQL
\i /chemin/vers/database_complete.sql

# Vérifier les tables créées
\dt

# Quitter
\q
```

### 4. Mise à Jour des Mots de Passe avec SHA-256

Les mots de passe dans le script SQL sont en clair. Pour les hacher avec SHA-256:

```sql
-- Se connecter à la base de données
psql -U postgres -d cabinet_medical

-- Mettre à jour les mots de passe (SHA-256 de "password123")
UPDATE utilisateurs SET mot_de_passe = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';

-- Vérifier
SELECT email, mot_de_passe FROM utilisateurs;
```

Le hash SHA-256 de "password123" est: `ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f`

### 5. Configuration de l'Application

Modifier le fichier `src/main/resources/application.properties`:

```properties
# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/cabinet_medical
spring.datasource.username=postgres
spring.datasource.password=postgres

# Si vous avez créé un utilisateur différent:
# spring.datasource.username=cabinet_user
# spring.datasource.password=cabinet_password
```

### 6. Compiler le Backend

```bash
cd backend
mvn clean install
```

### 7. Démarrer le Backend

```bash
mvn spring-boot:run
```

Le serveur démarre sur: **http://localhost:8080**

## Endpoints API

### Authentification
- `POST /api/auth/login` - Connexion
  ```json
  {
    "email": "admin@cabinet.com",
    "password": "password123"
  }
  ```

### Health Check
- `GET /api/health` - Vérifier l'état du serveur

### Patients
- `GET /api/patients` - Liste tous les patients
- `GET /api/patients/{id}` - Obtenir un patient par ID
- `POST /api/patients` - Créer un nouveau patient
- `PUT /api/patients/{id}` - Mettre à jour un patient
- `DELETE /api/patients/{id}` - Supprimer un patient
- `GET /api/patients/search?query={query}` - Rechercher des patients

### Rendez-vous
- `GET /api/rendez-vous` - Liste tous les rendez-vous
- `GET /api/rendez-vous/{id}` - Obtenir un rendez-vous par ID
- `POST /api/rendez-vous` - Créer un rendez-vous
- `PUT /api/rendez-vous/{id}` - Mettre à jour un rendez-vous
- `DELETE /api/rendez-vous/{id}` - Supprimer un rendez-vous
- `GET /api/rendez-vous/medecin/{medecinId}?date={date}` - Rendez-vous par médecin
- `GET /api/rendez-vous/patient/{patientId}` - Rendez-vous d'un patient

### Consultations
- `GET /api/consultations` - Liste toutes les consultations
- `GET /api/consultations/{id}` - Obtenir une consultation par ID
- `POST /api/consultations` - Créer une consultation
- `GET /api/consultations/patient/{patientId}` - Consultations d'un patient

### Ordonnances
- `GET /api/ordonnances` - Liste toutes les ordonnances
- `GET /api/ordonnances/{id}` - Obtenir une ordonnance par ID
- `POST /api/ordonnances` - Créer une ordonnance
- `GET /api/ordonnances/patient/{patientId}` - Ordonnances d'un patient

### Médicaments
- `GET /api/medicaments` - Liste tous les médicaments
- `GET /api/medicaments/{id}` - Obtenir un médicament par ID

## Tester l'API

### Avec curl:

```bash
# Health check
curl http://localhost:8080/api/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cabinet.com","password":"password123"}'

# Liste des patients
curl http://localhost:8080/api/patients

# Créer un patient
curl -X POST http://localhost:8080/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "cin": "XX123456",
    "nom": "Doe",
    "prenom": "John",
    "dateNaissance": "1990-01-01",
    "sexe": "M",
    "numTel": "0612345678",
    "email": "john.doe@example.com",
    "adresse": "123 Rue Example",
    "typeMutuelle": "CNSS"
  }'
```

### Avec Postman ou Insomnia:

1. Importer la collection d'endpoints
2. Configurer l'URL de base: `http://localhost:8080/api`
3. Tester chaque endpoint

## Démarrage Complet de l'Application

### 1. Démarrer PostgreSQL
```bash
sudo systemctl start postgresql
# ou sur macOS:
brew services start postgresql@14
```

### 2. Démarrer le Backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Démarrer le Frontend (dans un autre terminal)
```bash
npm start
```

L'application frontend sera disponible sur: **http://localhost:3000**

## Utilisateurs de Test

Après avoir exécuté le script SQL et mis à jour les mots de passe, utilisez ces comptes:

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@cabinet.com | password123 | ADMINISTRATEUR |
| medecin1@cabinet.com | password123 | MEDECIN |
| medecin2@cabinet.com | password123 | MEDECIN |
| secretaire@cabinet.com | password123 | SECRETAIRE |

## Résolution des Problèmes

### Erreur: "Connection refused"
- Vérifier que PostgreSQL est démarré: `sudo systemctl status postgresql`
- Vérifier le port: `sudo netstat -plnt | grep 5432`

### Erreur: "Password authentication failed"
- Vérifier les credentials dans `application.properties`
- Réinitialiser le mot de passe PostgreSQL si nécessaire

### Erreur: "Port 8080 already in use"
- Modifier le port dans `application.properties`: `server.port=8081`
- Ou arrêter l'application utilisant le port 8080

### Erreur CORS depuis le frontend
- Vérifier que CorsConfig permet `http://localhost:3000`
- Redémarrer le backend après modification

### Les mots de passe ne fonctionnent pas
- S'assurer d'avoir exécuté la commande UPDATE pour hacher les mots de passe
- Le hash SHA-256 de "password123" doit être: `ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f`

## Structure du Projet

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/cabinet/medical/
│   │   │   ├── CabinetMedicalApplication.java
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── WebConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── PatientController.java
│   │   │   │   ├── RendezVousController.java
│   │   │   │   ├── ConsultationController.java
│   │   │   │   ├── OrdonnanceController.java
│   │   │   │   ├── MedicamentController.java
│   │   │   │   └── HealthController.java
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   └── response/
│   │   │   ├── entity/
│   │   │   ├── exception/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   └── util/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## Sécurité

- Les mots de passe sont hachés avec SHA-256
- CORS configuré pour n'accepter que les requêtes de `http://localhost:3000`
- Spring Security configuré en mode stateless
- Les endpoints API sont protégés

## Développement

### Activer le rechargement automatique
```bash
mvn spring-boot:run -Dspring-boot.run.fork=false
```

### Afficher les requêtes SQL
Dans `application.properties`:
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### Mode debug
```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## Logs

Les logs sont affichés dans la console. Pour les configurer:

```properties
# Dans application.properties
logging.level.com.cabinet.medical=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

## Production

Pour déployer en production:

1. Compiler le JAR:
```bash
mvn clean package
```

2. Exécuter le JAR:
```bash
java -jar target/medical-1.0.0.jar
```

3. Configurer un profil de production:
```bash
java -jar target/medical-1.0.0.jar --spring.profiles.active=prod
```

## Support

Pour toute question ou problème:
- Consulter les logs de l'application
- Vérifier la connexion à la base de données
- S'assurer que toutes les dépendances sont installées

## Licence

© 2024 Cabinet Médical. Tous droits réservés.
