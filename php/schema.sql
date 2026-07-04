-- =====================================================================
-- APPLICATION DE GESTION DE COLIS - IMPORT-EXPORT ABIDJAN
-- FICHIER SQL DE CONFIGURATION ET DE REMISE À ZÉRO (MYSQL & POSTGRESQL)
-- =====================================================================

-- =====================================================================
-- SECTION 1 : CRÉATION DU SCHÉMA DES TABLES (S'IL N'EXISTE PAS ENCORE)
-- =====================================================================

-- -------------------------------------------------------------
-- VERSION A : POUR MYSQL / MARIADB (Le plus commun en PHP/XAMPP)
-- -------------------------------------------------------------
/*
CREATE TABLE IF NOT EXISTS transitaire (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS colis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    transitaire_id INT NOT NULL,
    date_enregistrement DATE NOT NULL,
    poids_total DECIMAL(5, 2) NOT NULL,
    type VARCHAR(10) NOT NULL,
    FOREIGN KEY (transitaire_id) REFERENCES transitaire(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS part_colis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    colis_id INT NOT NULL,
    nom_client VARCHAR(150) NOT NULL,
    poids_attribue DECIMAL(5, 2) NOT NULL,
    montant_du DECIMAL(12, 2) NOT NULL,
    montant_paye DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (colis_id) REFERENCES colis(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
*/

-- -------------------------------------------------------------
-- VERSION B : POUR POSTGRESQL
-- -------------------------------------------------------------
/*
CREATE TABLE IF NOT EXISTS transitaire (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS colis (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    transitaire_id INT NOT NULL,
    date_enregistrement DATE NOT NULL DEFAULT CURRENT_DATE,
    poids_total NUMERIC(5, 2) NOT NULL,
    type VARCHAR(10) NOT NULL,
    CONSTRAINT fk_transitaire FOREIGN KEY (transitaire_id) REFERENCES transitaire(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS part_colis (
    id SERIAL PRIMARY KEY,
    colis_id INT NOT NULL,
    nom_client VARCHAR(150) NOT NULL,
    poids_attribue NUMERIC(5, 2) NOT NULL,
    montant_du NUMERIC(12, 2) NOT NULL,
    montant_paye NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_colis FOREIGN KEY (colis_id) REFERENCES colis(id) ON DELETE CASCADE
);
*/


-- =====================================================================
-- SECTION 2 : REQUÊTES POUR VIDER / EFFACER LE CONTENU DES TABLES
-- (Supprime les données sans supprimer la structure des tables !)
-- =====================================================================

-- --- OPTION 1 : SÉCURISÉ POUR MYSQL ---
-- Cette méthode désactive temporairement les vérifications des clés étrangères
-- pour vider les tables et réinitialiser les compteurs AUTO_INCREMENT à zéro (0).

-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE part_colis;
-- TRUNCATE TABLE colis;
-- TRUNCATE TABLE transitaire;
-- SET FOREIGN_KEY_CHECKS = 1;


-- --- OPTION 2 : SÉCURISÉ POUR POSTGRESQL ---
-- Cette méthode vide les tables et réinitialise les compteurs de séquences en cascade.

-- TRUNCATE TABLE part_colis, colis, transitaire RESTART IDENTITY CASCADE;


-- --- OPTION 3 : SUPPRESSION SIMPLE AVEC DELETE (FONCTIONNE PARTOUT) ---
-- Supprime les lignes une par une en respectant l'ordre des clés étrangères.
-- Note : Cette méthode ne remet pas à zéro les compteurs d'auto-incrément (ID),
-- mais vide parfaitement toutes les données.

-- DELETE FROM part_colis;
-- DELETE FROM colis;
-- DELETE FROM transitaire;
