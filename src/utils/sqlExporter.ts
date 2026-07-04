import { Transitaire, Colis } from "../types";

export function generateSqlScript(transitaires: Transitaire[], colisList: Colis[]): string {
  let sql = `-- =====================================================================\n`;
  sql += `-- APPLICATION DE GESTION DE COLIS - IMPORT-EXPORT ABIDJAN\n`;
  sql += `-- SCRIPT D'EXPORTATION DES DONNÉES DE L'APPLICATION\n`;
  sql += `-- Généré le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}\n`;
  sql += `-- =====================================================================\n\n`;

  sql += `-- 1. RECRÉATION DU SCHÉMA\n`;
  sql += `DROP TABLE IF EXISTS part_colis CASCADE;\n`;
  sql += `DROP TABLE IF EXISTS colis CASCADE;\n`;
  sql += `DROP TABLE IF EXISTS transitaire CASCADE;\n\n`;

  sql += `CREATE TABLE transitaire (\n`;
  sql += `    id SERIAL PRIMARY KEY,\n`;
  sql += `    nom VARCHAR(100) NOT NULL UNIQUE\n`;
  sql += `);\n\n`;

  sql += `CREATE TABLE colis (\n`;
  sql += `    id SERIAL PRIMARY KEY,\n`;
  sql += `    code VARCHAR(50) NOT NULL UNIQUE,\n`;
  sql += `    transitaire_id INT NOT NULL,\n`;
  sql += `    date_enregistrement DATE NOT NULL DEFAULT CURRENT_DATE,\n`;
  sql += `    poids_total NUMERIC(5, 2) NOT NULL,\n`;
  sql += `    type VARCHAR(10) NOT NULL,\n`;
  sql += `    CONSTRAINT fk_transitaire FOREIGN KEY (transitaire_id) REFERENCES transitaire(id) ON DELETE CASCADE,\n`;
  sql += `    CONSTRAINT chk_type CHECK (type IN ('Simple', 'Mixte')),\n`;
  sql += `    CONSTRAINT chk_poids_max CHECK (poids_total <= 32.00)\n`;
  sql += `);\n\n`;

  sql += `CREATE TABLE part_colis (\n`;
  sql += `    id SERIAL PRIMARY KEY,\n`;
  sql += `    colis_id INT NOT NULL,\n`;
  sql += `    nom_client VARCHAR(150) NOT NULL,\n`;
  sql += `    poids_attribue NUMERIC(5, 2) NOT NULL,\n`;
  sql += `    montant_du NUMERIC(12, 2) NOT NULL,\n`;
  sql += `    montant_paye NUMERIC(12, 2) NOT NULL DEFAULT 0.00,\n`;
  sql += `    CONSTRAINT fk_colis FOREIGN KEY (colis_id) REFERENCES colis(id) ON DELETE CASCADE,\n`;
  sql += `    CONSTRAINT chk_poids_positif CHECK (poids_attribue > 0),\n`;
  sql += `    CONSTRAINT chk_montant_du_positif CHECK (montant_du >= 0),\n`;
  sql += `    CONSTRAINT chk_montant_paye_positif CHECK (montant_paye >= 0),\n`;
  sql += `    CONSTRAINT chk_poids_part_max CHECK (poids_attribue <= 32.00)\n`;
  sql += `);\n\n`;

  sql += `-- Index pour accélérer les requêtes\n`;
  sql += `CREATE INDEX idx_colis_code ON colis(code);\n`;
  sql += `CREATE INDEX idx_part_nom_client ON part_colis(nom_client);\n\n`;

  sql += `-- 2. INSERTION DES TRANSITAIRES\n`;
  
  // Create a mapping of frontend IDs to SQL generated serial IDs
  const transitaireIdMap: Record<string, number> = {};
  transitaires.forEach((t, index) => {
    const dbId = index + 1;
    transitaireIdMap[t.id] = dbId;
    // escape single quotes
    const escapedNom = t.nom.replace(/'/g, "''");
    sql += `INSERT INTO transitaire (id, nom) VALUES (${dbId}, '${escapedNom}');\n`;
  });
  
  // Reset serial sequence for transitaire
  if (transitaires.length > 0) {
    sql += `SELECT setval('transitaire_id_seq', ${transitaires.length});\n\n`;
  } else {
    sql += `\n`;
  }

  sql += `-- 3. INSERTION DES COLIS ET LEURS PARTS\n`;
  
  let currentPartSqlId = 1;
  colisList.forEach((c, cIndex) => {
    const colisDbId = cIndex + 1;
    const transDbId = transitaireIdMap[c.transitaireId] || 1;
    const escapedCode = c.code.replace(/'/g, "''");
    
    sql += `-- Colis ${escapedCode} (${c.type})\n`;
    sql += `INSERT INTO colis (id, code, transitaire_id, date_enregistrement, poids_total, type) VALUES (${colisDbId}, '${escapedCode}', ${transDbId}, '${c.dateEnregistrement}', ${c.poidsTotal}, '${c.type}');\n`;
    
    c.parts.forEach((p) => {
      const escapedClient = p.nomClient.replace(/'/g, "''");
      sql += `  INSERT INTO part_colis (id, colis_id, nom_client, poids_attribue, montant_du, montant_paye) VALUES (${currentPartSqlId}, ${colisDbId}, '${escapedClient}', ${p.poidsAttribue}, ${p.montantDu}, ${p.montantPaye});\n`;
      currentPartSqlId++;
    });
    sql += `\n`;
  });

  // Reset serial sequences for colis and part_colis
  if (colisList.length > 0) {
    sql += `SELECT setval('colis_id_seq', ${colisList.length});\n`;
  }
  if (currentPartSqlId > 1) {
    sql += `SELECT setval('part_colis_id_seq', ${currentPartSqlId - 1});\n`;
  }

  sql += `\n-- =====================================================================\n`;
  sql += `-- FIN DE SCRIPT D'EXPORTATION\n`;
  sql += `-- =====================================================================\n`;

  return sql;
}

export function downloadSqlFile(transitaires: Transitaire[], colisList: Colis[]): void {
  const sqlContent = generateSqlScript(transitaires, colisList);
  const blob = new Blob([sqlContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `gestion_colis_abidjan_${new Date().toISOString().slice(0, 10)}.sql`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJsonBackup(transitaires: Transitaire[], colisList: Colis[]): void {
  const backupData = {
    version: "1.0",
    date: new Date().toISOString(),
    transitaires,
    colisList
  };
  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `backup_gestion_colis_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
