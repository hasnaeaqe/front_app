-- ===========================================
-- MISE À JOUR BASE DE DONNÉES POUR MODULE ADMIN
-- ===========================================

-- Ajouter colonne actif à la table cabinet
ALTER TABLE cabinet ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT true;

-- Ajouter colonnes categorie et fabricant à la table medicament
ALTER TABLE medicament ADD COLUMN IF NOT EXISTS categorie VARCHAR(100);
ALTER TABLE medicament ADD COLUMN IF NOT EXISTS fabricant VARCHAR(255);

-- Ajouter colonnes cabinet_id et specialite_id à la table utilisateurs
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS cabinet_id INTEGER REFERENCES cabinet(id) ON DELETE SET NULL;
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS specialite_id INTEGER REFERENCES specialite(id) ON DELETE SET NULL;

-- Créer table activite_admin pour logger les actions
CREATE TABLE IF NOT EXISTS activite_admin (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_utilisateurs_cabinet ON utilisateurs(cabinet_id);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_specialite ON utilisateurs(specialite_id);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_role ON utilisateurs(role);
CREATE INDEX IF NOT EXISTS idx_cabinet_actif ON cabinet(actif);
CREATE INDEX IF NOT EXISTS idx_activite_admin_date ON activite_admin(date_creation DESC);

-- Mettre à jour les données existantes pour les médicaments (exemples)
UPDATE medicament SET categorie = 'Antibiotique', fabricant = 'Sanofi' WHERE nom LIKE '%Amoxicilline%';
UPDATE medicament SET categorie = 'Antalgique', fabricant = 'Pfizer' WHERE nom LIKE '%Paracétamol%';
UPDATE medicament SET categorie = 'Anti-inflammatoire', fabricant = 'Novartis' WHERE nom LIKE '%Ibuprofène%';

-- Mettre à jour tous les cabinets existants comme actifs
UPDATE cabinet SET actif = true WHERE actif IS NULL;

COMMENT ON TABLE activite_admin IS 'Table pour enregistrer toutes les activités administratives';
COMMENT ON COLUMN cabinet.actif IS 'Indique si le cabinet est actif (true) ou inactif (false)';
COMMENT ON COLUMN medicament.categorie IS 'Catégorie du médicament (Antibiotique, Antalgique, etc.)';
COMMENT ON COLUMN medicament.fabricant IS 'Nom du fabricant du médicament';
COMMENT ON COLUMN utilisateurs.cabinet_id IS 'Référence au cabinet auquel appartient l''utilisateur (pour MEDECIN et SECRETAIRE)';
COMMENT ON COLUMN utilisateurs.specialite_id IS 'Référence à la spécialité du médecin';
