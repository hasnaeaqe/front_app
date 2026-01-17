# Guide de Démarrage des Serveurs

## Backend (Spring Boot)

Le backend doit être démarré en premier pour que l'application frontend puisse se connecter à l'API.

### Méthode 1: Démarrer avec le JAR compilé (Recommandé)

```powershell
# 1. Compiler le projet (si nécessaire)
cd backend
mvn clean package -DskipTests

# 2. Démarrer le serveur
java -jar target\medical-1.0.0.jar
```

Le serveur backend démarre sur **http://localhost:8080**

### Méthode 2: Démarrer avec Maven

```powershell
cd backend
mvn spring-boot:run
```

## Frontend (React)

Une fois le backend démarré, lancez le frontend dans un nouveau terminal :

```powershell
npm start
```

Le frontend démarre sur **http://localhost:3000**

## Vérification

Pour vérifier que le backend fonctionne correctement :

```powershell
curl http://localhost:8080/api/patients/search?query=test
```

Ou ouvrez votre navigateur à l'adresse : http://localhost:8080

## Résolution des Problèmes

### Erreur "Erreur lors de la recherche des patients"

Cette erreur apparaît quand le backend n'est pas démarré. Assurez-vous de :

1. **Démarrer le backend d'abord** avant le frontend
2. Vérifier que PostgreSQL est en cours d'exécution
3. Vérifier que le port 8080 n'est pas utilisé par une autre application

### Backend ne démarre pas

- Vérifiez que Java 17+ est installé : `java -version`
- Vérifiez que PostgreSQL est accessible
- Consultez les logs pour identifier l'erreur

### Frontend ne peut pas se connecter au backend

- Vérifiez que le backend est bien démarré sur le port 8080
- Vérifiez l'URL de l'API dans `src/services/api.js` (devrait être `http://localhost:8080/api`)
- Vérifiez les paramètres CORS dans le backend

## Ordre de Démarrage Recommandé

1. **PostgreSQL** (Base de données)
2. **Backend** (Spring Boot sur port 8080)
3. **Frontend** (React sur port 3000)

## Notes

- Le backend doit être démarré et complètement initialisé avant d'utiliser le frontend
- Les logs du backend vous indiqueront quand il est prêt avec le message : "Started CabinetMedicalApplication"
