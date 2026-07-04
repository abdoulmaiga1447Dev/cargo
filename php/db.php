<?php
/**
 * APPLICATION DE GESTION DE COLIS - IMPORT-EXPORT ABIDJAN
 * FICHIER DE CONNEXION À LA BASE DE DONNÉES EN LOCAL (PDO)
 */

// --- CONFIGURATION DE LA BASE DE DONNÉES ---
define('DB_TYPE', 'pgsql');       // 'mysql' pour WAMP/XAMPP, 'pgsql' pour PostgreSQL
define('DB_HOST', 'localhost');    // Serveur de base de données (généralement localhost)
define('DB_PORT', '5432');         // Port de la base de données (3306 pour MySQL, 5432 pour PostgreSQL)
define('DB_NAME', 'import_export_abidjan'); // Nom de la base de données créée dans phpMyAdmin / pgAdmin
define('DB_USER', 'postgres');         // Utilisateur (par défaut 'root' sous MySQL)
define('DB_PASS', '12345678');             // Mot de passe (vide par défaut sous WAMP/XAMPP)

try {
    if (DB_TYPE === 'mysql') {
        // Connexion sécurisée MySQL en UTF-8
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } else {
        // Connexion sécurisée PostgreSQL
        $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    
    // Auto-migrate: add est_retire column if it doesn't exist
    try {
        $pdo->exec("ALTER TABLE part_colis ADD COLUMN est_retire INT NOT NULL DEFAULT 0");
    } catch (PDOException $ex) {
        // Silent catch: column likely already exists or table doesn't exist yet
    }

    // Auto-migrate: create utilisateurs table if it doesn't exist
    try {
        $idType = (DB_TYPE === 'pgsql') ? 'SERIAL PRIMARY KEY' : 'INT AUTO_INCREMENT PRIMARY KEY';
        $pdo->exec("CREATE TABLE IF NOT EXISTS utilisateurs (
            id $idType,
            email VARCHAR(150) NOT NULL UNIQUE,
            mot_de_passe VARCHAR(255) NOT NULL,
            nom VARCHAR(100) DEFAULT 'Administrateur'
        )");

        // Insert a default admin if none exists
        $stmtCheck = $pdo->query("SELECT COUNT(*) FROM utilisateurs");
        if ($stmtCheck && $stmtCheck->fetchColumn() == 0) {
            $pdo->exec("INSERT INTO utilisateurs (email, mot_de_passe, nom) VALUES ('admin@abidjancargo.com', 'admin', 'Administrateur')");
        }
    } catch (PDOException $ex) {
        // Silent catch
    }
} catch (PDOException $e) {
    // Si la base de données n'est pas connectée, renvoyer une erreur JSON explicite pour l'application
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        "error" => "Impossible de se connecter à la base de données local.",
        "details" => $e->getMessage(),
        "suggestion" => "1. Assurez-vous d'avoir démarré WAMP/XAMPP/MAMP ou PostgreSQL.\n2. Créez une base de données nommée '" . DB_NAME . "' dans votre outil d'administration.\n3. Importez le fichier 'schema.sql' pour créer les tables.\n4. Vérifiez les identifiants de connexion dans le fichier 'db.php'."
    ]);
    exit;
}
