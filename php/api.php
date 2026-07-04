<?php
/**
 * APPLICATION DE GESTION DE COLIS - IMPORT-EXPORT ABIDJAN
 * API BACKEND DE GESTION DES DONNÉES EN BD (REQUÊTES SÉCURISÉES)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// Gérer la requête preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Fonction utilitaire pour lire le JSON envoyé dans la requête POST
function getJsonInput() {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

try {
    switch ($action) {
        
        // 0. AUTHENTIFICATION DE L'UTILISATEUR (REQUÊTE EN BD)
        case 'login':
            $input = getJsonInput();
            $email = isset($input['email']) ? trim($input['email']) : '';
            $password = isset($input['password']) ? $input['password'] : '';
            
            if (empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Email et mot de passe requis."]);
                exit;
            }
            
            $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE LOWER(email) = :email");
            $stmt->execute(['email' => strtolower($email)]);
            $user = $stmt->fetch();
            
            if ($user && $user['mot_de_passe'] === $password) {
                echo json_encode([
                    "success" => true,
                    "user" => [
                        "email" => $user['email'],
                        "nom" => $user['nom']
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["success" => false, "error" => "Identifiants de base de données incorrects."]);
            }
            break;

        // 1. OBTENIR TOUTES LES DONNÉES (TRANSITAIRES + COLIS + PARTS)
        case 'get_data':
            // Récupérer tous les transitaires
            $stmt = $pdo->query("SELECT * FROM transitaire ORDER BY nom ASC");
            $transitaires_rows = $stmt->fetchAll();
            
            $transitaires = [];
            foreach ($transitaires_rows as $row) {
                $transitaires[] = [
                    "id" => (string)$row['id'],
                    "nom" => $row['nom']
                ];
            }
            
            // Récupérer tous les colis
            $stmt = $pdo->query("SELECT * FROM colis ORDER BY date_enregistrement DESC, id DESC");
            $colis_rows = $stmt->fetchAll();
            
            // Récupérer toutes les parts de colis
            $stmt = $pdo->query("SELECT * FROM part_colis ORDER BY id ASC");
            $parts_rows = $stmt->fetchAll();
            
            // Grouper les parts par ID de colis
            $parts_by_colis = [];
            foreach ($parts_rows as $p) {
                $colis_id = $p['colis_id'];
                if (!isset($parts_by_colis[$colis_id])) {
                    $parts_by_colis[$colis_id] = [];
                }
                $parts_by_colis[$colis_id][] = [
                    "id" => (string)$p['id'],
                    "nomClient" => $p['nom_client'],
                    "poidsAttribue" => floatval($p['poids_attribue']),
                    "montantDu" => floatval($p['montant_du']),
                    "montantPaye" => floatval($p['montant_paye']),
                    "estRetire" => isset($p['est_retire']) ? (bool)$p['est_retire'] : false
                ];
            }
            
            // Structurer la liste des colis avec leurs parts
            $colisList = [];
            foreach ($colis_rows as $c) {
                $cid = $c['id'];
                $colisList[] = [
                    "id" => (string)$cid,
                    "code" => $c['code'],
                    "transitaireId" => (string)$c['transitaire_id'],
                    "dateEnregistrement" => $c['date_enregistrement'],
                    "poidsTotal" => floatval($c['poids_total']),
                    "type" => $c['type'],
                    "parts" => isset($parts_by_colis[$cid]) ? $parts_by_colis[$cid] : []
                ];
            }
            
            echo json_encode([
                "success" => true,
                "transitaires" => $transitaires,
                "colisList" => $colisList
            ]);
            break;

        // 2. AJOUTER UN TRANSITAIRE
        case 'add_transitaire':
            $input = getJsonInput();
            $nom = isset($input['nom']) ? trim($input['nom']) : '';
            
            if (empty($nom)) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Le nom du transitaire est requis."]);
                exit;
            }
            
            // Vérifier les doublons
            $stmt = $pdo->prepare("SELECT id FROM transitaire WHERE nom = :nom");
            $stmt->execute(['nom' => $nom]);
            if ($stmt->fetch()) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Un transitaire avec ce nom existe déjà."]);
                exit;
            }
            
            $stmt = $pdo->prepare("INSERT INTO transitaire (nom) VALUES (:nom)");
            $stmt->execute(['nom' => $nom]);
            $newId = $pdo->lastInsertId();
            
            echo json_encode([
                "success" => true,
                "transitaire" => [
                    "id" => (string)$newId,
                    "nom" => $nom
                ]
            ]);
            break;

        // 3. SUPPRIMER UN TRANSITAIRE (Efface les colis associés en CASCADE)
        case 'delete_transitaire':
            $input = getJsonInput();
            $id = isset($input['id']) ? intval($input['id']) : 0;
            
            if ($id <= 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "ID transitaire invalide."]);
                exit;
            }
            
            $stmt = $pdo->prepare("DELETE FROM transitaire WHERE id = :id");
            $stmt->execute(['id' => $id]);
            
            echo json_encode(["success" => true]);
            break;

        // 4. ENREGISTRER UN COLIS AVEC SES PARTS (Transaction)
        case 'add_colis':
            $input = getJsonInput();
            
            $code = isset($input['code']) ? trim($input['code']) : '';
            $transitaireId = isset($input['transitaireId']) ? intval($input['transitaireId']) : 0;
            $dateEnregistrement = isset($input['dateEnregistrement']) ? trim($input['dateEnregistrement']) : date('Y-m-d');
            $poidsTotal = isset($input['poidsTotal']) ? floatval($input['poidsTotal']) : 0.00;
            $type = isset($input['type']) ? trim($input['type']) : 'Simple';
            $parts = isset($input['parts']) ? $input['parts'] : [];
            
            if (empty($code) || $transitaireId <= 0 || $poidsTotal <= 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Code colis, transitaire et poids total sont obligatoires."]);
                exit;
            }
            
            // Vérifier que le code est unique
            $stmt = $pdo->prepare("SELECT id FROM colis WHERE code = :code");
            $stmt->execute(['code' => $code]);
            if ($stmt->fetch()) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Le code colis '$code' est déjà utilisé."]);
                exit;
            }
            
            // Lancer une transaction PDO
            $pdo->beginTransaction();
            
            try {
                // Insérer le colis
                $stmt = $pdo->prepare("
                    INSERT INTO colis (code, transitaire_id, date_enregistrement, poids_total, type)
                    VALUES (:code, :transitaire_id, :date_enregistrement, :poids_total, :type)
                ");
                $stmt->execute([
                    'code' => $code,
                    'transitaire_id' => $transitaireId,
                    'date_enregistrement' => $dateEnregistrement,
                    'poids_total' => $poidsTotal,
                    'type' => $type
                ]);
                $colis_id = $pdo->lastInsertId();
                
                // Insérer les parts associées
                $stmtPart = $pdo->prepare("
                    INSERT INTO part_colis (colis_id, nom_client, poids_attribue, montant_du, montant_paye)
                    VALUES (:colis_id, :nom_client, :poids_attribue, :montant_du, :montant_paye)
                ");
                
                foreach ($parts as $part) {
                    $nomClient = isset($part['nomClient']) ? trim($part['nomClient']) : '';
                    $poidsAttribue = isset($part['poidsAttribue']) ? floatval($part['poidsAttribue']) : 0.00;
                    $montantDu = isset($part['montantDu']) ? floatval($part['montantDu']) : 0.00;
                    $montantPaye = isset($part['montantPaye']) ? floatval($part['montantPaye']) : 0.00;
                    
                    if (empty($nomClient) || $poidsAttribue <= 0) {
                        throw new Exception("Chaque part de colis doit avoir un nom de client et un poids valide.");
                    }
                    
                    $stmtPart->execute([
                        'colis_id' => $colis_id,
                        'nom_client' => $nomClient,
                        'poids_attribue' => $poidsAttribue,
                        'montant_du' => $montantDu,
                        'montant_paye' => $montantPaye
                    ]);
                }
                
                // Tout s'est bien passé
                $pdo->commit();
                echo json_encode(["success" => true]);
                
            } catch (Exception $e) {
                // Annuler en cas d'erreur
                $pdo->rollBack();
                http_response_code(500);
                echo json_encode(["success" => false, "error" => "Erreur d'insertion : " . $e->getMessage()]);
            }
            break;

        // 5. ENREGISTRER UN PAIEMENT DE CLIENT
        case 'record_payment':
            $input = getJsonInput();
            $partId = isset($input['partId']) ? intval($input['partId']) : 0;
            $amount = isset($input['amount']) ? floatval($input['amount']) : 0.00;
            
            if ($partId <= 0 || $amount <= 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Informations de paiement invalides."]);
                exit;
            }
            
            // Récupérer la part
            $stmt = $pdo->prepare("SELECT * FROM part_colis WHERE id = :id");
            $stmt->execute(['id' => $partId]);
            $part = $stmt->fetch();
            
            if (!$part) {
                http_response_code(404);
                echo json_encode(["success" => false, "error" => "La part client n'existe pas."]);
                exit;
            }
            
            $newPaid = min(floatval($part['montant_du']), floatval($part['montant_paye']) + $amount);
            
            $stmtUpdate = $pdo->prepare("UPDATE part_colis SET montant_paye = :new_paid WHERE id = :id");
            $stmtUpdate->execute([
                'new_paid' => $newPaid,
                'id' => $partId
            ]);
            
            echo json_encode(["success" => true]);
            break;

        // 6. RÉINITIALISER LE PAIEMENT D'UN CLIENT À ZÉRO
        case 'reset_payment':
            $input = getJsonInput();
            $partId = isset($input['partId']) ? intval($input['partId']) : 0;
            
            if ($partId <= 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Part client invalide."]);
                exit;
            }
            
            $stmtUpdate = $pdo->prepare("UPDATE part_colis SET montant_paye = 0 WHERE id = :id");
            $stmtUpdate->execute(['id' => $partId]);
            
            echo json_encode(["success" => true]);
            break;
            
        // 6b. MARQUER UN COLIS RETIRÉ OU NON
        case 'toggle_retrieval':
            $input = getJsonInput();
            $partId = isset($input['partId']) ? intval($input['partId']) : 0;
            $estRetire = isset($input['estRetire']) ? (int)$input['estRetire'] : 0;
            
            if ($partId <= 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Part client invalide."]);
                exit;
            }
            
            $stmtUpdate = $pdo->prepare("UPDATE part_colis SET est_retire = :est_retire WHERE id = :id");
            $stmtUpdate->execute([
                'est_retire' => $estRetire,
                'id' => $partId
            ]);
            
            echo json_encode(["success" => true]);
            break;

        // 7. VIDER TOUTES LES DONNÉES DES TABLES SANS SUPPRIMER LES TABLES
        case 'clear_data':
            $pdo->beginTransaction();
            try {
                $pdo->exec("DELETE FROM part_colis");
                $pdo->exec("DELETE FROM colis");
                $pdo->exec("DELETE FROM transitaire");
                
                if (DB_TYPE === 'mysql') {
                    $pdo->exec("ALTER TABLE part_colis AUTO_INCREMENT = 1");
                    $pdo->exec("ALTER TABLE colis AUTO_INCREMENT = 1");
                    $pdo->exec("ALTER TABLE transitaire AUTO_INCREMENT = 1");
                }
                
                $pdo->commit();
                echo json_encode(["success" => true]);
            } catch (Exception $e) {
                $pdo->rollBack();
                http_response_code(500);
                echo json_encode(["success" => false, "error" => "Erreur lors du vidage des tables : " . $e->getMessage()]);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(["success" => false, "error" => "Action non reconnue."]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Erreur serveur : " . $e->getMessage()]);
}
