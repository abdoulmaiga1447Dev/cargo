-- =====================================================================
-- APPLICATION DE GESTION DE COLIS - IMPORT-EXPORT ABIDJAN
-- FICHIER SQL DE CRÉATION DE LA BASE DE DONNÉES EN LOCAL (POSTGRESQL)
-- =====================================================================

-- 1. Suppression des tables si elles existent (attention : efface les données !)
DROP TABLE IF EXISTS part_colis CASCADE;
DROP TABLE IF EXISTS colis CASCADE;
DROP TABLE IF EXISTS transitaire CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

-- 1.5 Création de la table des Utilisateurs
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(100) DEFAULT 'Administrateur'
);

-- Insertion de l'administrateur par défaut
INSERT INTO utilisateurs (email, mot_de_passe, nom) 
VALUES ('admin@abidjancargo.com', 'admin', 'Administrateur');

-- 2. Création de la table des Transitaires
CREATE TABLE transitaire (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

-- 3. Création de la table des Colis
CREATE TABLE colis (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    transitaire_id INT NOT NULL,
    date_enregistrement DATE NOT NULL DEFAULT CURRENT_DATE,
    poids_total NUMERIC(5, 2) NOT NULL,
    type VARCHAR(10) NOT NULL,
    
    CONSTRAINT fk_transitaire FOREIGN KEY (transitaire_id) 
        REFERENCES transitaire(id) ON DELETE CASCADE,
    CONSTRAINT chk_type CHECK (type IN ('Simple', 'Mixte')),
    CONSTRAINT chk_poids_max CHECK (poids_total <= 32.00)
);

-- Index pour accélérer la recherche par code de colis
CREATE INDEX idx_colis_code ON colis(code);

-- 4. Création de la table des Parts de colis (un client par part)
CREATE TABLE part_colis (
    id SERIAL PRIMARY KEY,
    colis_id INT NOT NULL,
    nom_client VARCHAR(150) NOT NULL,
    poids_attribue NUMERIC(5, 2) NOT NULL,
    montant_du NUMERIC(12, 2) NOT NULL,
    montant_paye NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    est_retire INT NOT NULL DEFAULT 0,
    
    CONSTRAINT fk_colis FOREIGN KEY (colis_id) 
        REFERENCES colis(id) ON DELETE CASCADE,
    CONSTRAINT chk_poids_positif CHECK (poids_attribue > 0),
    CONSTRAINT chk_montant_du_positif CHECK (montant_du >= 0),
    CONSTRAINT chk_montant_paye_positif CHECK (montant_paye >= 0),
    -- La validation "reste_a_payer" est calculée dynamiquement en SQL ou via l'application : (montant_du - montant_paye)
    CONSTRAINT chk_poids_part_max CHECK (poids_attribue <= 32.00)
);

-- Index pour accélérer la recherche par nom de client
CREATE INDEX idx_part_nom_client ON part_colis(nom_client);

-- 5. Insertion des données initiales (Les 2 transitaires de départ)
INSERT INTO transitaire (nom) VALUES ('CI Transit Express');
INSERT INTO transitaire (nom) VALUES ('Abidjan Cargo Service');

-- 6. Exemple d'insertion d'un colis simple
-- Supposons que le transitaire 'CI Transit Express' a l'ID 1
-- INSERT INTO colis (code, transitaire_id, date_enregistrement, poids_total, type) 
-- VALUES ('C-101', 1, '2026-07-03', 15.5, 'Simple');

-- INSERT INTO part_colis (colis_id, nom_client, poids_attribue, montant_du, montant_paye) 
-- VALUES (1, 'Mamadou Koné', 15.5, 45000, 30000);

-- 7. Exemple d'insertion d'un colis mixte
-- Supposons que 'Abidjan Cargo Service' a l'ID 2
-- INSERT INTO colis (code, transitaire_id, date_enregistrement, poids_total, type) 
-- VALUES ('C-102', 2, '2026-07-03', 28.0, 'Mixte');

-- INSERT INTO part_colis (colis_id, nom_client, poids_attribue, montant_du, montant_paye) 
-- VALUES (2, 'Awa Touré', 10.0, 30000, 30000);
-- INSERT INTO part_colis (colis_id, nom_client, poids_attribue, montant_du, montant_paye) 
-- VALUES (2, 'Koffi Yao', 18.0, 54000, 20000);

-- =====================================================================
-- REQUÊTE UTILE : Vue d'ensemble des impayés (Reste à payer > 0)
-- =====================================================================
-- SELECT 
--     c.code AS code_colis,
--     t.nom AS transitaire,
--     p.nom_client,
--     p.poids_attribue,
--     p.montant_du,
--     p.montant_paye,
--     (p.montant_du - p.montant_paye) AS reste_a_payer
-- FROM part_colis p
-- JOIN colis c ON p.colis_id = c.id
-- JOIN transitaire t ON c.transitaire_id = t.id
-- WHERE (p.montant_du - p.montant_paye) > 0;
