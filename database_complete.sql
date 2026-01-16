-- ===========================================
-- CABINET MÉDICAL - BASE DE DONNÉES COMPLÈTE
-- ===========================================

-- ===========================================
-- SUPPRESSION DES TABLES EXISTANTES (si nécessaire)
-- ===========================================

DROP TABLE IF EXISTS ordonnance_medicament CASCADE;
DROP TABLE IF EXISTS ordonnance CASCADE;
DROP TABLE IF EXISTS consultation CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS document CASCADE;
DROP TABLE IF EXISTS facture CASCADE;
DROP TABLE IF EXISTS rendez_vous CASCADE;
DROP TABLE IF EXISTS dossier_medical CASCADE;
DROP TABLE IF EXISTS notification CASCADE;
DROP TABLE IF EXISTS password_reset_token CASCADE;
DROP TABLE IF EXISTS patient CASCADE;
DROP TABLE IF EXISTS medicament CASCADE;
DROP TABLE IF EXISTS specialite CASCADE;
DROP TABLE IF EXISTS cabinet CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

-- ===========================================
-- CRÉATION DES TABLES
-- ===========================================

-- Table des utilisateurs
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    dtype VARCHAR(50) NOT NULL DEFAULT 'Utilisateur',
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMINISTRATEUR', 'MEDECIN', 'SECRETAIRE')),
    num_tel VARCHAR(20),
    signature TEXT,
    actif BOOLEAN DEFAULT true,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table du cabinet
CREATE TABLE cabinet (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse VARCHAR(500),
    num_tel VARCHAR(20),
    email VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des spécialités
CREATE TABLE specialite (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des médicaments
CREATE TABLE medicament (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    posologie VARCHAR(500),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des patients
CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    cin VARCHAR(20) UNIQUE NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL,
    sexe CHAR(1) CHECK (sexe IN ('M', 'F')),
    num_tel VARCHAR(20),
    email VARCHAR(255),
    adresse TEXT,
    type_mutuelle VARCHAR(100),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des dossiers médicaux
CREATE TABLE dossier_medical (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patient(id) ON DELETE CASCADE,
    medecin_id INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    diagnostic TEXT,
    traitement TEXT,
    observations TEXT,
    ant_medicaux TEXT,
    ant_chirurgicaux TEXT,
    allergies TEXT,
    habitudes TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    nom_fichier VARCHAR(255) NOT NULL,
    type_fichier VARCHAR(100),
    chemin_fichier VARCHAR(500) NOT NULL,
    taille_fichier BIGINT,
    description VARCHAR(500),
    patient_id INTEGER REFERENCES patient(id) ON DELETE CASCADE,
    dossier_id INTEGER REFERENCES dossier_medical(id) ON DELETE CASCADE,
    uploade_par VARCHAR(200),
    date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des rendez-vous
CREATE TABLE rendez_vous (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patient(id) ON DELETE CASCADE,
    medecin_id INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    date_rdv DATE NOT NULL,
    heure_rdv TIME NOT NULL,
    motif TEXT,
    statut VARCHAR(50) DEFAULT 'EN_ATTENTE' CHECK (statut IN ('EN_ATTENTE', 'CONFIRME', 'ANNULE', 'TERMINE')),
    notes TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des consultations
CREATE TABLE consultation (
    id SERIAL PRIMARY KEY,
    rendez_vous_id INTEGER REFERENCES rendez_vous(id) ON DELETE SET NULL,
    patient_id INTEGER REFERENCES patient(id) ON DELETE CASCADE,
    medecin_id INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    diagnostic TEXT,
    traitement TEXT,
    observations TEXT,
    date_consultation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duree INTEGER
);

-- Table des ordonnances
CREATE TABLE ordonnance (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultation(id) ON DELETE SET NULL,
    patient_id INTEGER REFERENCES patient(id) ON DELETE CASCADE,
    medecin_id INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    instructions TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valide_jusqu_a DATE
);

-- Table des médicaments dans les ordonnances
CREATE TABLE ordonnance_medicament (
    id SERIAL PRIMARY KEY,
    ordonnance_id INTEGER REFERENCES ordonnance(id) ON DELETE CASCADE,
    medicament_id INTEGER REFERENCES medicament(id) ON DELETE CASCADE,
    posologie VARCHAR(500),
    duree VARCHAR(100),
    quantite INTEGER
);

-- Table des factures
CREATE TABLE facture (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    patient_id INTEGER REFERENCES patient(id) ON DELETE CASCADE,
    consultation_id INTEGER REFERENCES consultation(id) ON DELETE SET NULL,
    montant DECIMAL(10,2) NOT NULL,
    statut_paiement VARCHAR(50) DEFAULT 'EN_ATTENTE' CHECK (statut_paiement IN ('EN_ATTENTE', 'PAYE', 'REMBOURSE')),
    date_emission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_paiement TIMESTAMP,
    date_echeance DATE,
    notes TEXT
);

-- Table des notifications
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO' CHECK (type IN ('INFO', 'WARNING', 'ERROR', 'SUCCESS')),
    destinataire_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
    lu BOOLEAN DEFAULT false,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_lecture TIMESTAMP
);

-- Table des tokens de réinitialisation de mot de passe
CREATE TABLE password_reset_token (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    utilisateur_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
    expiry_date TIMESTAMP NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- INSERTION DES DONNÉES DE TEST
-- ===========================================

-- 1. Insérer le cabinet
INSERT INTO cabinet (nom, adresse, num_tel, email) VALUES
('Cabinet Médical Central', '123 Avenue Mohammed V, Casablanca', '0522123456', 'contact@cabinetcentral.ma');

-- 2. Insérer les spécialités
INSERT INTO specialite (nom, description) VALUES
('Médecine Générale', 'Médecine générale et prévention'),
('Cardiologie', 'Spécialiste des maladies cardiovasculaires'),
('Pédiatrie', 'Médecine des enfants'),
('Dermatologie', 'Spécialiste de la peau'),
('Ophtalmologie', 'Spécialiste des yeux'),
('Gynécologie', 'Médecine de la femme');

-- 3. Insérer les médicaments
INSERT INTO medicament (nom, description, posologie) VALUES
('Paracétamol', 'Antalgique et antipyrétique', '500mg toutes les 6 heures'),
('Ibuprofène', 'Anti-inflammatoire non stéroïdien', '400mg toutes les 8 heures'),
('Amoxicilline', 'Antibiotique', '500mg trois fois par jour'),
('Oméprazole', 'Anti-acide', '20mg une fois par jour'),
('Loratadine', 'Antihistaminique', '10mg une fois par jour'),
('Salbutamol', 'Bronchodilatateur', '100mcg par inhalation');

-- 4. Insérer les utilisateurs (CRITIQUE : Insérer d'abord assez de médecins)
-- Note : Les mots de passe sont en clair pour le test (sans BCrypt)
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, num_tel) VALUES
-- Administrateur
('Admin', 'System', 'admin@cabinet.com', 'password123', 'ADMINISTRATEUR', '0522000001'),
-- Médecins (4 médecins pour correspondre aux données)
('Benjelloun', 'Karim', 'medecin1@cabinet.com', 'password123', 'MEDECIN', '0522000002'),
('El Fassi', 'Hassan', 'medecin2@cabinet.com', 'password123', 'MEDECIN', '0522000003'),
('Berrada', 'Fatima', 'medecin3@cabinet.com', 'password123', 'MEDECIN', '0522000004'),
('Alami', 'Mehdi', 'medecin4@cabinet.com', 'password123', 'MEDECIN', '0522000005'),
-- Secrétaire
('Idrissi', 'Leila', 'secretaire@cabinet.com', 'password123', 'SECRETAIRE', '0522000006');

-- 5. Insérer les patients
INSERT INTO patient (cin, nom, prenom, date_naissance, sexe, num_tel, email, adresse, type_mutuelle) VALUES
('AB123456', 'El Amrani', 'Ahmed', '1985-03-15', 'M', '0612345678', 'ahmed.elamrani@gmail.com', '45 Rue Ibn Sina, Casablanca', 'CNOPS'),
('CD789012', 'Bennani', 'Samira', '1992-07-22', 'F', '0623456789', 'samira.bennani@hotmail.com', '12 Avenue Hassan II, Rabat', 'CNSS'),
('EF345678', 'Khalil', 'Mohammed', '1978-11-05', 'M', '0634567890', 'm.khalil@gmail.com', '78 Boulevard Mohammed V, Marrakech', 'RAMED'),
('GH901234', 'Zahra', 'Amina', '2005-02-28', 'F', '0645678901', 'amina.zahra@yahoo.com', '33 Rue de la Liberté, Fès', 'CNOPS'),
('IJ567890', 'Chakir', 'Yassin', '1995-09-14', 'M', '0656789012', 'y.chakir@gmail.com', '21 Avenue des FAR, Tanger', 'CNSS'),
('KL123890', 'Tazi', 'Nadia', '1982-12-10', 'F', '0667890123', 'nadia.tazi@hotmail.com', '67 Rue Palestine, Agadir', 'Privée');

-- 6. Insérer les dossiers médicaux (MAINTENANT avec des IDs de médecins valides)
INSERT INTO dossier_medical (patient_id, medecin_id, diagnostic, traitement, observations) VALUES
(1, 2, 'Hypertension artérielle', 'Traitement antihypertenseur, régime sans sel', 'Surveillance tensionnelle mensuelle'),
(2, 3, 'Diabète type 2', 'Insuline, régime diabétique', 'Contrôle glycémique hebdomadaire'),
(3, 2, 'Asthme allergique', 'Corticoïdes inhalés, bronchodilatateurs', 'Éviter les allergènes connus'),
(4, 3, 'Anémie ferriprive', 'Supplémentation en fer', 'Contrôle hémogramme dans 3 mois'),
(5, 2, 'Lombalgie chronique', 'Antalgiques, kinésithérapie', 'Éviter le port de charges lourdes'),
(6, 4, 'Migraines', 'Traitement de crise et préventif', 'Tenir un agenda des crises');

-- 7. Insérer les rendez-vous
INSERT INTO rendez_vous (patient_id, medecin_id, date_rdv, heure_rdv, motif, statut) VALUES
(1, 2, '2024-01-15', '09:00:00', 'Contrôle tension artérielle', 'CONFIRME'),
(2, 3, '2024-01-15', '10:30:00', 'Suivi diabète', 'CONFIRME'),
(3, 2, '2024-01-16', '11:00:00', 'Crise asthmatique', 'EN_ATTENTE'),
(4, 3, '2024-01-16', '14:30:00', 'Bilan annuel', 'CONFIRME'),
(5, 5, '2024-01-17', '16:00:00', 'Douleurs lombaires', 'ANNULE'),
(6, 4, '2024-01-17', '17:30:00', 'Migraine persistante', 'EN_ATTENTE');

-- 8. Insérer les consultations
INSERT INTO consultation (rendez_vous_id, patient_id, medecin_id, diagnostic, traitement, observations, duree) VALUES
(1, 1, 2, 'HTA bien contrôlée', 'Continuer traitement actuel', 'Tension: 125/80 mmHg', 20),
(2, 2, 3, 'Glycémie équilibrée', 'Ajustement dose insuline', 'HbA1c: 6.8%', 25),
(4, 4, 3, 'Anémie corrigée', 'Arrêt supplémentation fer', 'Hémoglobine normale', 15);

-- 9. Insérer les ordonnances
INSERT INTO ordonnance (consultation_id, patient_id, medecin_id, instructions, valide_jusqu_a) VALUES
(1, 1, 2, 'Prendre avant les repas', '2024-04-15'),
(2, 2, 3, 'Adapter selon glycémie', '2024-04-15'),
(3, 4, 3, 'Une fois par jour', '2024-04-16');

-- 10. Insérer les détails des ordonnances
INSERT INTO ordonnance_medicament (ordonnance_id, medicament_id, posologie, duree, quantite) VALUES
(1, 4, '20mg le matin', '3 mois', 90),
(2, 1, '500mg si douleur', '1 mois', 30),
(2, 3, '500mg 3x/jour', '7 jours', 21),
(3, 5, '10mg le soir', '1 mois', 30);

-- 11. Insérer les factures
INSERT INTO facture (numero, patient_id, consultation_id, montant, statut_paiement, date_emission, date_echeance) VALUES
('FAC-2024-001', 1, 1, 300.00, 'PAYE', '2024-01-15', '2024-02-15'),
('FAC-2024-002', 2, 2, 350.00, 'EN_ATTENTE', '2024-01-15', '2024-02-15'),
('FAC-2024-003', 4, 3, 250.00, 'PAYE', '2024-01-16', '2024-02-16');

-- 12. Insérer les documents
INSERT INTO documents (nom_fichier, type_fichier, chemin_fichier, taille_fichier, patient_id, dossier_id, uploade_par) VALUES
('Analyse_sang.pdf', 'Laboratoire', '/documents/analyses/1.pdf', 1048576, 1, 1, 'System'),
('Radiographie.jpg', 'Imagerie', '/documents/imagerie/3.jpg', 2097152, 3, 3, 'Karim Benjelloun'),
('Echographie.pdf', 'Imagerie', '/documents/imagerie/6.pdf', 3145728, 6, 6, 'Fatima Berrada');

-- 13. Insérer les notifications
INSERT INTO notification (titre, message, type, destinataire_id, lu) VALUES
('Nouveau rendez-vous', 'M. Ahmed El Amrani a pris rendez-vous pour demain', 'INFO', 2, false),
('Paiement reçu', 'Paiement de la facture FAC-2024-001 reçu', 'SUCCESS', 1, true),
('Rendez-vous annulé', 'M. Yassin Chakir a annulé son rendez-vous', 'WARNING', 5, false),
('Rappel consultation', 'Consultation avec Dr. Karim Benjelloun dans 2 heures', 'INFO', 2, false);

-- 14. Insérer les tokens de réinitialisation (exemple)
INSERT INTO password_reset_token (token, utilisateur_id, expiry_date) VALUES
('reset_token_12345', 1, '2024-02-01 12:00:00'),
('reset_token_67890', 2, '2024-02-01 12:00:00');

-- ===========================================
-- CRÉATION DES INDEX POUR LA PERFORMANCE
-- ===========================================

CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);
CREATE INDEX idx_utilisateurs_role ON utilisateurs(role);
CREATE INDEX idx_patient_cin ON patient(cin);
CREATE INDEX idx_patient_nom ON patient(nom);
CREATE INDEX idx_patient_date_creation ON patient(date_creation);
CREATE INDEX idx_rendez_vous_date ON rendez_vous(date_rdv);
CREATE INDEX idx_rendez_vous_statut ON rendez_vous(statut);
CREATE INDEX idx_rendez_vous_medecin ON rendez_vous(medecin_id);
CREATE INDEX idx_facture_numero ON facture(numero);
CREATE INDEX idx_facture_statut ON facture(statut_paiement);
CREATE INDEX idx_facture_patient ON facture(patient_id);
CREATE INDEX idx_dossier_patient ON dossier_medical(patient_id);
CREATE INDEX idx_dossier_medecin ON dossier_medical(medecin_id);
CREATE INDEX idx_consultation_date ON consultation(date_consultation);
CREATE INDEX idx_consultation_patient ON consultation(patient_id);
CREATE INDEX idx_notification_destinataire ON notification(destinataire_id);
CREATE INDEX idx_notification_lu ON notification(lu);
CREATE INDEX idx_documents_patient ON documents(patient_id);
CREATE INDEX idx_documents_dossier ON documents(dossier_id);

-- ===========================================
-- CRÉATION DES VUES POUR LES RAPPORTS
-- ===========================================

-- Vue pour le résumé des rendez-vous
CREATE OR REPLACE VIEW vue_rendez_vous_resume AS
SELECT 
    r.id,
    p.nom || ' ' || p.prenom AS patient_nom,
    u.nom || ' ' || u.prenom AS medecin_nom,
    r.date_rdv,
    r.heure_rdv,
    r.statut,
    r.motif
FROM rendez_vous r
JOIN patient p ON r.patient_id = p.id
LEFT JOIN utilisateurs u ON r.medecin_id = u.id AND u.role = 'MEDECIN'
ORDER BY r.date_rdv DESC, r.heure_rdv DESC;

-- Vue pour l'historique médical
CREATE OR REPLACE VIEW vue_historique_medical AS
SELECT 
    p.id AS patient_id,
    p.nom || ' ' || p.prenom AS patient_nom,
    d.diagnostic,
    d.traitement,
    d.date_creation AS date_dossier,
    u.nom || ' ' || u.prenom AS medecin_nom
FROM dossier_medical d
JOIN patient p ON d.patient_id = p.id
LEFT JOIN utilisateurs u ON d.medecin_id = u.id
ORDER BY d.date_creation DESC;

-- Vue pour le résumé financier
CREATE OR REPLACE VIEW vue_resume_financier AS
SELECT 
    DATE_TRUNC('month', f.date_emission) AS mois,
    COUNT(*) AS nombre_factures,
    SUM(f.montant) AS total_montant,
    SUM(CASE WHEN f.statut_paiement = 'PAYE' THEN f.montant ELSE 0 END) AS montant_paye,
    SUM(CASE WHEN f.statut_paiement = 'EN_ATTENTE' THEN f.montant ELSE 0 END) AS montant_en_attente,
    SUM(CASE WHEN f.statut_paiement = 'REMBOURSE' THEN f.montant ELSE 0 END) AS montant_rembourse
FROM facture f
GROUP BY DATE_TRUNC('month', f.date_emission)
ORDER BY mois DESC;

-- Vue pour les statistiques patients
CREATE OR REPLACE VIEW vue_stats_patients AS
SELECT 
    COUNT(*) as total_patients,
    COUNT(*) FILTER (WHERE date_creation >= CURRENT_DATE - INTERVAL '30 days') as nouveaux_30jours,
    COUNT(*) FILTER (WHERE sexe = 'M') as hommes,
    COUNT(*) FILTER (WHERE sexe = 'F') as femmes,
    ROUND(AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_naissance))), 1) as age_moyen
FROM patient;

-- ===========================================
-- FONCTIONS ET TRIGGERS
-- ===========================================

-- Fonction pour mettre à jour date_modification
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour automatiquement date_modification
CREATE TRIGGER update_patient_modtime
BEFORE UPDATE ON patient
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_dossier_modtime
BEFORE UPDATE ON dossier_medical
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_rendezvous_modtime
BEFORE UPDATE ON rendez_vous
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_utilisateur_modtime
BEFORE UPDATE ON utilisateurs
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- ===========================================
-- DONNÉES DE VÉRIFICATION
-- ===========================================

-- Vérifier le nombre d'enregistrements dans chaque table
DO $$
DECLARE
    table_rec RECORD;
    sql_query TEXT;
    row_count INTEGER;
BEGIN
    RAISE NOTICE '=== VÉRIFICATION DES DONNÉES ===';
    
    FOR table_rec IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename
    LOOP
        sql_query := 'SELECT COUNT(*) FROM ' || table_rec.tablename;
        EXECUTE sql_query INTO row_count;
        RAISE NOTICE 'Table % : % enregistrements', table_rec.tablename, row_count;
    END LOOP;
END $$;

-- ===========================================
-- REQUÊTES UTILES POUR VÉRIFICATION
-- ===========================================

-- Vérifier les médecins disponibles
SELECT id, nom, prenom, email, role FROM utilisateurs WHERE role = 'MEDECIN' ORDER BY id;

-- Vérifier les patients
SELECT id, cin, nom, prenom, date_naissance, sexe FROM patient ORDER BY nom;

-- Vérifier les dossiers médicaux
SELECT d.id, p.nom || ' ' || p.prenom as patient, 
       u.nom || ' ' || u.prenom as medecin, d.diagnostic
FROM dossier_medical d
JOIN patient p ON d.patient_id = p.id
LEFT JOIN utilisateurs u ON d.medecin_id = u.id
ORDER BY d.date_creation DESC;

-- Vérifier les rendez-vous à venir
SELECT r.id, p.nom || ' ' || p.prenom as patient,
       r.date_rdv, r.heure_rdv, r.statut, r.motif
FROM rendez_vous r
JOIN patient p ON r.patient_id = p.id
WHERE r.date_rdv >= CURRENT_DATE
ORDER BY r.date_rdv, r.heure_rdv;

-- ===========================================
-- FIN DU SCRIPT
-- ===========================================
