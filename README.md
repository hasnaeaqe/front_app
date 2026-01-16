# Cabinet Médical - Application de Gestion

Application complète de gestion de cabinet médical avec backend Spring Boot et frontend React.

## 🚀 Démarrage Rapide

### Prérequis

- **Java 17+** - [Télécharger Java](https://adoptium.net/)
- **Maven 3.6+** - [Télécharger Maven](https://maven.apache.org/download.cgi)
- **PostgreSQL 12+** - [Télécharger PostgreSQL](https://www.postgresql.org/download/)
- **Node.js 14+** - [Télécharger Node.js](https://nodejs.org/)

### Installation Complète

#### 1. Cloner le Projet

```bash
git clone https://github.com/hasnaeaqe/front_app.git
cd front_app
```

#### 2. Configurer la Base de Données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE cabinet_medical;

# Quitter
\q

# Importer le schéma et les données
psql -U postgres -d cabinet_medical -f database_complete.sql
```

#### 3. Démarrer le Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Le backend sera accessible sur: **http://localhost:8080**

#### 4. Démarrer le Frontend

Dans un nouveau terminal:

```bash
# Installer les dépendances
npm install

# Démarrer l'application React
npm start
```

Le frontend sera accessible sur: **http://localhost:3000**

### Comptes de Test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@cabinet.com | password123 | ADMINISTRATEUR |
| medecin1@cabinet.com | password123 | MEDECIN |
| medecin2@cabinet.com | password123 | MEDECIN |
| secretaire@cabinet.com | password123 | SECRETAIRE |

## 📚 Documentation

- **[Documentation Backend](backend/README_BACKEND.md)** - Configuration détaillée du backend Spring Boot
- **[API REST](#api-rest)** - Liste des endpoints disponibles

## 🏗️ Architecture

### Backend (Spring Boot)

- **Framework**: Spring Boot 3.2.1
- **Java**: 17
- **Base de données**: PostgreSQL
- **Sécurité**: Spring Security + SHA-256
- **Architecture**: REST API

**Structure:**
```
backend/
├── src/main/java/com/cabinet/medical/
│   ├── config/          # Configuration (CORS, Security)
│   ├── controller/      # REST Controllers
│   ├── dto/             # Data Transfer Objects
│   ├── entity/          # JPA Entities
│   ├── exception/       # Exception Handlers
│   ├── repository/      # Spring Data Repositories
│   ├── service/         # Business Logic
│   └── util/            # Utilities
└── src/main/resources/
    └── application.properties
```

### Frontend (React)

- **Framework**: React 19
- **HTTP Client**: Axios
- **Style**: CSS-in-JS

**Structure:**
```
src/
├── components/          # React Components
│   ├── Login.js
│   └── PatientList.js
├── services/            # API Services
│   ├── api.js
│   ├── authService.js
│   ├── patientService.js
│   └── ...
└── App.js
```

## 🔌 API REST

### Authentification

```
POST /api/auth/login
```

### Health Check

```
GET /api/health
```

### Patients

```
GET    /api/patients              # Liste tous les patients
GET    /api/patients/{id}         # Obtenir un patient
POST   /api/patients              # Créer un patient
PUT    /api/patients/{id}         # Modifier un patient
DELETE /api/patients/{id}         # Supprimer un patient
GET    /api/patients/search?query={query}  # Rechercher
```

### Rendez-vous

```
GET    /api/rendez-vous                     # Liste tous les RDV
GET    /api/rendez-vous/{id}                # Obtenir un RDV
POST   /api/rendez-vous                     # Créer un RDV
PUT    /api/rendez-vous/{id}                # Modifier un RDV
DELETE /api/rendez-vous/{id}                # Supprimer un RDV
GET    /api/rendez-vous/medecin/{id}        # RDV par médecin
GET    /api/rendez-vous/patient/{id}        # RDV d'un patient
```

### Consultations

```
GET    /api/consultations                   # Liste toutes les consultations
GET    /api/consultations/{id}              # Obtenir une consultation
POST   /api/consultations                   # Créer une consultation
GET    /api/consultations/patient/{id}      # Consultations d'un patient
```

### Ordonnances

```
GET    /api/ordonnances                     # Liste toutes les ordonnances
GET    /api/ordonnances/{id}                # Obtenir une ordonnance
POST   /api/ordonnances                     # Créer une ordonnance
GET    /api/ordonnances/patient/{id}        # Ordonnances d'un patient
```

### Médicaments

```
GET    /api/medicaments                     # Liste tous les médicaments
GET    /api/medicaments/{id}                # Obtenir un médicament
```

## 🔒 Sécurité

- Mots de passe hachés avec **SHA-256**
- CORS configuré pour `http://localhost:3000`
- Spring Security en mode stateless
- Validation des données côté serveur

## 🧪 Tests

### Tester le Backend

```bash
cd backend
mvn test
```

### Tester le Frontend

```bash
npm test
```

### Tester l'API avec curl

```bash
# Health check
curl http://localhost:8080/api/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cabinet.com","password":"password123"}'

# Liste des patients
curl http://localhost:8080/api/patients
```

## 🛠️ Développement

### Démarrer en mode développement

Backend avec hot reload:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.fork=false
```

Frontend avec hot reload:
```bash
npm start
```

### Build pour la production

Backend:
```bash
cd backend
mvn clean package
java -jar target/medical-1.0.0.jar
```

Frontend:
```bash
npm run build
```

## 📝 Scripts Disponibles

### Frontend

- `npm start` - Démarre le serveur de développement
- `npm test` - Lance les tests
- `npm run build` - Build pour la production
- `npm run eject` - Eject la configuration

### Backend

- `mvn clean install` - Compile et installe
- `mvn spring-boot:run` - Démarre le serveur
- `mvn test` - Lance les tests
- `mvn package` - Créé le JAR

## 🐛 Résolution des Problèmes

### Backend ne démarre pas

1. Vérifier que PostgreSQL est démarré
2. Vérifier les credentials dans `application.properties`
3. Vérifier que le port 8080 est libre

### Frontend ne se connecte pas au Backend

1. Vérifier que le backend est démarré sur le port 8080
2. Vérifier la configuration CORS dans `CorsConfig.java`
3. Ouvrir la console du navigateur pour voir les erreurs

### Erreur de connexion à la base de données

1. Vérifier que PostgreSQL est démarré
2. Vérifier que la base `cabinet_medical` existe
3. Vérifier les credentials dans `application.properties`

## 📦 Fonctionnalités

- ✅ Authentification sécurisée (SHA-256)
- ✅ Gestion des patients (CRUD complet)
- ✅ Gestion des rendez-vous
- ✅ Gestion des consultations
- ✅ Gestion des ordonnances
- ✅ Catalogue de médicaments
- ✅ Recherche de patients
- ✅ Interface utilisateur responsive
- ✅ API REST complète
- ✅ Documentation complète

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

© 2024 Cabinet Médical. Tous droits réservés.

## 👥 Support

Pour toute question ou problème, consultez:
- [Documentation Backend](backend/README_BACKEND.md)
- Issues GitHub

---

**Note**: Cette application est conçue pour un environnement de développement. Pour un déploiement en production, des mesures de sécurité supplémentaires doivent être mises en place.

