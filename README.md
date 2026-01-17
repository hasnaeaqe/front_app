# Cabinet Médical - Application de Gestion

Application complète de gestion de cabinet médical avec backend Spring Boot et frontend React.

## 🏥 Description

Système de gestion complet pour cabinets médicaux permettant la gestion des patients, rendez-vous, consultations, ordonnances, et dossiers médicaux. Interface utilisateur moderne et intuitive avec authentification sécurisée multi-rôles.

## 💻 Technologies Utilisées

**Backend:**
- Java 17
- Spring Boot 3.2.1
- Spring Data JPA
- Spring Security
- PostgreSQL
- Maven

**Frontend:**
- React 19
- Axios
- React Router
- Tailwind CSS
- Lucide Icons

**Base de données:**
- PostgreSQL 12+

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Java 17+** - [Télécharger Java](https://adoptium.net/)
- **Maven 3.6+** - [Télécharger Maven](https://maven.apache.org/download.cgi)
- **PostgreSQL 12+** - [Télécharger PostgreSQL](https://www.postgresql.org/download/)
- **Node.js 16+** - [Télécharger Node.js](https://nodejs.org/)

## 🚀 Installation et Configuration

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/hasnaeaqe/front_app.git
cd front_app
```

### Étape 2 : Configurer la base de données

```bash
# Démarrer PostgreSQL
sudo systemctl start postgresql  # Linux
# ou brew services start postgresql@14  # macOS

# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE cabinet_medical;

# Créer un utilisateur (optionnel)
CREATE USER cabinet_user WITH PASSWORD 'cabinet_password';
GRANT ALL PRIVILEGES ON DATABASE cabinet_medical TO cabinet_user;

# Quitter
\q

# Importer la base de données
psql -U postgres -d cabinet_medical -f database.sql
```

### Étape 3 : Configurer le Backend

```bash
cd backend

# Modifier src/main/resources/application.properties
# Ajuster les credentials PostgreSQL si nécessaire :
spring.datasource.url=jdbc:postgresql://localhost:5432/cabinet_medical
spring.datasource.username=postgres
spring.datasource.password=votre_mot_de_passe

# Compiler et installer
mvn clean install

# Démarrer le serveur backend
mvn spring-boot:run
```

Backend accessible sur : **http://localhost:8080**

### Étape 4 : Configurer le Frontend

```bash
# Retourner à la racine du projet
cd ..

# Installer les dépendances
npm install

# Démarrer l'application React
npm start
```

Frontend accessible sur : **http://localhost:3000**

## 🔑 Comptes de Test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@cabinet.com | password123 | ADMINISTRATEUR |
| medecin1@cabinet.com | password123 | MEDECIN |
| medecin2@cabinet.com | password123 | MEDECIN |
| secretaire@cabinet.com | password123 | SECRETAIRE |

## 🏗️ Architecture du Projet

```
front_app/
├── backend/                 # Backend Spring Boot
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
├── src/                     # Frontend React
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.js
├── public/
├── database.sql            # Script SQL complet
├── package.json
└── README.md
```

## 📚 Technologies

### Backend
- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Data JPA** - Accès aux données
- **Spring Security** - Authentification et autorisation
- **PostgreSQL** - Base de données relationnelle
- **Maven** - Gestion des dépendances

### Frontend
- **React 19** - Framework JavaScript
- **Axios** - Client HTTP
- **React Router** - Navigation
- **Tailwind CSS** - Framework CSS
- **Lucide Icons** - Icônes

### Base de données
- **PostgreSQL 12+** - Système de gestion de base de données

## 🔌 API REST Principale

### Authentification
```
POST /api/auth/login         # Connexion utilisateur
```

### Health Check
```
GET /api/health              # Vérification de l'état du serveur
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

## 🛠️ Commandes Utiles

### Backend

```bash
cd backend
mvn clean install          # Compiler
mvn spring-boot:run        # Démarrer
mvn test                   # Tests
```

### Frontend

```bash
npm install                # Installer dépendances
npm start                  # Démarrer en mode dev
npm run build              # Build production
npm test                   # Tests
```

## 🐛 Dépannage

### Problème : Backend ne démarre pas

- Vérifier que PostgreSQL est démarré
- Vérifier les credentials dans application.properties
- Vérifier que le port 8080 est libre

### Problème : Frontend ne se connecte pas

- Vérifier que le backend est démarré sur le port 8080
- Vérifier la configuration CORS
- Consulter la console du navigateur

### Problème : Erreur de base de données

- Vérifier que PostgreSQL est démarré
- Vérifier que la base cabinet_medical existe
- Vérifier que le script database.sql a été exécuté

## 📖 Documentation Détaillée

- [Documentation Backend](backend/README_BACKEND.md) - Configuration détaillée du backend
- [Composants UI](src/components/UI/README.md) - Documentation des composants React
- [Pages Patients](src/pages/Patients/README.md) - Documentation du module patients

## ✨ Fonctionnalités

- ✅ Authentification sécurisée (SHA-256)
- ✅ Gestion des patients (CRUD)
- ✅ Gestion des rendez-vous
- ✅ Consultations médicales
- ✅ Ordonnances et prescriptions
- ✅ Dossiers médicaux
- ✅ Facturation
- ✅ Documents médicaux
- ✅ Interface responsive
- ✅ Multi-rôles (Admin, Médecin, Secrétaire)

## 📄 Licence

© 2026 Cabinet Médical. Tous droits réservés.

## 👥 Support

Pour toute question :
- Consulter la documentation détaillée
- Vérifier les logs de l'application
- Ouvrir une issue sur GitHub

---

**Note** : Cette application est conçue pour un environnement de développement. Pour un déploiement en production, des mesures de sécurité supplémentaires sont recommandées.

