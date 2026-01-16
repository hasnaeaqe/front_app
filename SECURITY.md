# Considérations de Sécurité - Cabinet Médical

Ce document décrit les mesures de sécurité implémentées et les recommandations pour un déploiement en production.

## 🔒 Sécurité Implémentée

### 1. Hachage des Mots de Passe

**Implémentation:**
- Algorithme: SHA-256
- Classe: `PasswordUtil.java`
- Tous les mots de passe en base de données sont hachés

**Code:**
```java
public static String hashPassword(String password) {
    MessageDigest digest = MessageDigest.getInstance("SHA-256");
    byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
    return bytesToHex(hash);
}
```

**Note de Production:**
- ⚠️ SHA-256 seul n'est pas recommandé pour la production
- ✅ Utiliser BCrypt ou Argon2 avec salt pour une meilleure sécurité
- ✅ Implémenter un nombre d'itérations élevé

### 2. Configuration CORS

**Implémentation:**
- Classe: `CorsConfig.java`
- Origine autorisée: `http://localhost:3000`

**Recommandations Production:**
```java
config.setAllowedOrigins(Arrays.asList(
    "https://your-production-domain.com",
    "https://www.your-production-domain.com"
));
```

### 3. Spring Security

**Configuration Actuelle:**
- CSRF: Désactivé (API REST stateless)
- Session: STATELESS
- Tous les endpoints `/api/**` sont ouverts

**Pourquoi CSRF est désactivé:**
- L'API REST ne maintient pas de session
- Utilisation prévue de tokens (Bearer tokens)
- Pas de cookies de session

### 4. Validation des Données

**Implémentation:**
- Annotations Jakarta Validation sur les DTOs
- `@NotBlank`, `@Email`, `@Pattern`, etc.
- Validation automatique avec `@Valid`

### 5. Gestion des Exceptions

**Implémentation:**
- GlobalExceptionHandler avec @ControllerAdvice
- Messages d'erreur en français
- Pas d'exposition de stack traces

## ⚠️ Vulnérabilités Connues (Environnement de Développement)

### 1. Authentification Basique

**Problème:**
- Pas de JWT ou OAuth2
- Token simple retourné dans la réponse
- Pas de refresh token

**Impact:** Faible à Modéré
**Recommandation Production:**
```java
// Implémenter JWT avec Spring Security
@Bean
public JwtDecoder jwtDecoder() {
    return NimbusJwtDecoder.withSecretKey(secretKey).build();
}
```

### 2. Stockage Local (localStorage)

**Problème:**
- Tokens stockés dans localStorage
- Vulnérable aux attaques XSS

**Impact:** Modéré
**Recommandation Production:**
- Utiliser httpOnly cookies
- Implémenter HTTPS
- Ajouter Content Security Policy (CSP)

### 3. Comptes de Test Exposés

**Problème:**
- Credentials de test visibles dans le code
- Affichés dans l'interface (mode développement uniquement)

**Impact:** Faible (développement seulement)
**Résolution:**
- Code utilise `process.env.NODE_ENV === 'development'`
- Supprimer ces comptes en production

### 4. SHA-256 Sans Salt

**Problème:**
- SHA-256 sans salt est vulnérable aux attaques par rainbow tables
- Pas d'itérations multiples

**Impact:** Modéré à Élevé
**Recommandation Production:**
```java
// Utiliser Spring Security BCrypt
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
}
```

### 5. Pas de Rate Limiting

**Problème:**
- Pas de limite sur les tentatives de connexion
- Vulnérable aux attaques par force brute

**Impact:** Modéré
**Recommandation Production:**
- Implémenter Bucket4j ou Spring Cloud Gateway rate limiting
- Limiter les tentatives de login à 5 par minute

## 🛡️ Recommandations pour la Production

### 1. Authentification JWT

**Implémenter:**
```java
@Configuration
@EnableWebSecurity
public class JwtSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMINISTRATEUR")
                .requestMatchers("/api/medecin/**").hasRole("MEDECIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());
        return http.build();
    }
}
```

### 2. HTTPS Obligatoire

**Configuration:**
```properties
# application-prod.properties
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=${SSL_PASSWORD}
server.ssl.key-store-type=PKCS12
```

### 3. Variables d'Environnement

**Ne jamais hardcoder:**
```properties
# ❌ Mauvais
spring.datasource.password=postgres

# ✅ Bon
spring.datasource.password=${DB_PASSWORD}
```

### 4. Audit et Logging

**Implémenter:**
```java
@Aspect
@Component
public class AuditAspect {
    
    @AfterReturning("@annotation(Audited)")
    public void logAudit(JoinPoint joinPoint) {
        // Log user actions
        logger.info("Action: {} by user: {}", 
            joinPoint.getSignature(), 
            SecurityContextHolder.getContext().getAuthentication().getName()
        );
    }
}
```

### 5. Validation Renforcée

**Ajouter:**
- Validation des dates (pas dans le futur pour date de naissance)
- Validation des formats (CIN, téléphone)
- Sanitization des entrées HTML
- Protection XSS

### 6. Headers de Sécurité

**Ajouter:**
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) {
    http
        .headers(headers -> headers
            .contentSecurityPolicy(csp -> 
                csp.policyDirectives("default-src 'self'"))
            .frameOptions(FrameOptionsConfig::deny)
            .xssProtection(XssConfig::enable)
        );
    return http.build();
}
```

### 7. Base de Données

**Sécuriser:**
- Utiliser un utilisateur PostgreSQL dédié avec permissions minimales
- Chiffrer les connexions avec SSL
- Sauvegardes régulières et chiffrées
- Auditer les accès

### 8. Gestion des Secrets

**Utiliser:**
- Spring Cloud Config Server
- HashiCorp Vault
- AWS Secrets Manager
- Azure Key Vault

### 9. Rate Limiting

**Implémenter:**
```java
@Bean
public RateLimiter rateLimiter() {
    return RateLimiter.create(10.0); // 10 requêtes/seconde
}
```

### 10. Monitoring et Alertes

**Mettre en place:**
- Spring Boot Actuator
- Prometheus + Grafana
- Alertes sur tentatives de connexion échouées
- Alertes sur erreurs 500

## 📋 Checklist de Sécurité pour Production

### Avant le Déploiement

- [ ] Remplacer SHA-256 par BCrypt/Argon2
- [ ] Implémenter JWT avec refresh tokens
- [ ] Configurer HTTPS
- [ ] Remplacer localStorage par httpOnly cookies
- [ ] Ajouter rate limiting sur login
- [ ] Configurer CORS pour domaine de production
- [ ] Externaliser les secrets
- [ ] Ajouter headers de sécurité
- [ ] Activer les audits
- [ ] Configurer les logs de sécurité
- [ ] Supprimer les comptes de test
- [ ] Mettre en place la surveillance
- [ ] Tester la sécurité (OWASP Top 10)
- [ ] Configurer les sauvegardes

### Configuration Réseau

- [ ] Firewall configuré (ports 80, 443 uniquement)
- [ ] Base de données non exposée à Internet
- [ ] VPC/Network segmentation
- [ ] WAF (Web Application Firewall)
- [ ] DDoS protection

### Compliance

- [ ] RGPD: Droit à l'oubli implémenté
- [ ] Chiffrement des données sensibles
- [ ] Politique de rétention des données
- [ ] Logs d'audit conformes
- [ ] Consentement utilisateur

## 🔍 Tests de Sécurité

### Tests Recommandés

1. **OWASP ZAP** - Scan automatique des vulnérabilités
2. **Burp Suite** - Tests manuels approfondis
3. **SQLMap** - Test d'injection SQL
4. **JMeter** - Tests de charge et DDoS
5. **SonarQube** - Analyse statique du code

### Commandes de Test

```bash
# Scan avec OWASP ZAP
zap-cli quick-scan http://localhost:8080

# Test d'injection SQL
sqlmap -u "http://localhost:8080/api/patients/1"

# Scan de vulnérabilités avec npm
npm audit

# Scan de dépendances Maven
mvn dependency-check:check
```

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/)

## 💡 Conclusion

Cette application est conçue pour un **environnement de développement** et nécessite des améliorations significatives pour un déploiement en production. Les principales priorités sont:

1. **Authentification JWT** - Remplacer le système actuel
2. **BCrypt** - Remplacer SHA-256
3. **HTTPS** - Obligatoire en production
4. **Rate Limiting** - Protection contre les attaques
5. **Audit** - Traçabilité complète

Pour toute question de sécurité, consulter un expert en sécurité informatique avant le déploiement en production.
