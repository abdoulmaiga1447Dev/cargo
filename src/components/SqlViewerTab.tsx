import React, { useState } from "react";
import { Transitaire, Colis } from "../types";
import { generateSqlScript, downloadSqlFile, downloadJsonBackup } from "../utils/sqlExporter";
import { Database, FileCode, Download, Copy, Check, ShieldAlert, Upload, Sparkles } from "lucide-react";

interface SqlViewerTabProps {
  transitaires: Transitaire[];
  colisList: Colis[];
  onImportBackup: (transitaires: Transitaire[], colisList: Colis[]) => void;
}

export default function SqlViewerTab({
  transitaires,
  colisList,
  onImportBackup,
}: SqlViewerTabProps) {
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");

  const sqlScript = generateSqlScript(transitaires, colisList);

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError("");
    setImportSuccess("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);

        if (!data.transitaires || !Array.isArray(data.transitaires) || !data.colisList || !Array.isArray(data.colisList)) {
          throw new Error("Format de sauvegarde JSON invalide.");
        }

        if (window.confirm("Êtes-vous sûr de vouloir importer cette sauvegarde ? Cela écrasera vos données actuelles.")) {
          onImportBackup(data.transitaires, data.colisList);
          setImportSuccess("La sauvegarde a été importée et restaurée avec succès !");
          e.target.value = ""; // reset file input
        }
      } catch (err) {
        setImportError("Erreur d'importation : le fichier sélectionné est corrompu ou invalide.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="sql-viewer-tab-container" className="space-y-6">
      {/* DB Overview & Export banner */}
      <div id="sql-export-hero" className="bg-[#2D3A3A] rounded-3xl p-6 text-white border border-[#3E4F4F] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-natural-light">
            <Database className="w-6 h-6 text-natural-accent" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">PostgreSQL Local Integration</span>
          </div>
          <h3 className="text-base font-bold tracking-tight">Exportateur de Base de Données & Sauvegardes</h3>
          <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
            Cette application fonctionne localement dans votre navigateur, mais vous pouvez exporter votre schéma relationnel et toutes vos données réelles directement sous forme de script SQL compatible avec PostgreSQL pour votre serveur PHP local !
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            id="download-sql-btn"
            onClick={() => downloadSqlFile(transitaires, colisList)}
            className="px-4 py-2.5 bg-natural-accent hover:bg-natural-accent-hover text-white rounded-xl text-xs font-bold font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            Télécharger .SQL
          </button>

          <button
            id="download-json-btn"
            onClick={() => downloadJsonBackup(transitaires, colisList)}
            className="px-4 py-2.5 bg-[#3E4F4F] hover:bg-[#4E6262] text-[#DCE5E7] rounded-xl text-xs font-bold font-mono transition-colors border border-[#4E6262] flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileCode className="w-4 h-4" />
            Backup JSON
          </button>
        </div>
      </div>

      {/* Grid: Left: SQL Schema Code, Right: Backup and JSON restoration */}
      <div id="sql-tools-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SQL Live Script Preview */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-natural-border shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-natural-border/60 mb-4">
            <div>
              <h4 className="text-sm font-bold text-natural-heading">Script SQL Généré Dynamiquement</h4>
              <p className="text-xs text-natural-primary font-medium">Contient la structure DDL et les INSERTs de vos {colisList.length} colis actuels</p>
            </div>
            
            <button
              id="copy-sql-btn"
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-natural-sidebar hover:bg-natural-border border border-natural-border text-natural-heading rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-natural-accent" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-natural-primary" />
                  Copier le code
                </>
              )}
            </button>
          </div>

          <div id="sql-code-block" className="bg-[#2D3A3A] text-slate-100 rounded-xl p-4 text-xs font-mono overflow-auto max-h-[400px] leading-relaxed shadow-inner">
            <pre>{sqlScript}</pre>
          </div>
        </div>

        {/* Local Storage & Backup Restoration */}
        <div className="lg:col-span-4 space-y-6">
          {/* JSON Restore Box */}
          <div className="bg-white rounded-3xl border border-natural-border shadow-sm p-6">
            <h4 className="text-sm font-bold text-natural-heading mb-2 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-natural-primary" />
              Restaurer une Sauvegarde
            </h4>
            <p className="text-xs text-natural-primary mb-4 font-medium">
              Sélectionnez un fichier <code className="font-mono text-natural-accent bg-natural-sidebar px-1 rounded-sm">.json</code> précédemment sauvegardé pour restaurer tous vos transitaires, colis et états de paiement.
            </p>

            {importError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-800 text-[11px] rounded-xl mb-3 flex items-start gap-1.5 font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                <span>{importError}</span>
              </div>
            )}

            {importSuccess && (
              <div className="p-3 bg-natural-sidebar border border-natural-border text-natural-accent text-[11px] rounded-xl mb-3 flex items-start gap-1.5 font-bold">
                <Check className="w-4 h-4 shrink-0 text-natural-accent" />
                <span>{importSuccess}</span>
              </div>
            )}

            <div className="relative border-2 border-dashed border-natural-border hover:border-natural-accent rounded-2xl p-4 text-center cursor-pointer transition-colors bg-natural-light hover:bg-natural-sidebar/30">
              <input
                id="json-file-input"
                type="file"
                accept=".json"
                onChange={handleJsonUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileCode className="w-8 h-8 text-natural-primary mx-auto mb-2" />
              <span className="block text-xs font-bold text-natural-heading">Choisir le fichier JSON</span>
              <span className="block text-[10px] text-natural-primary mt-1 font-bold">Glissez-déposez ou cliquez pour parcourir</span>
            </div>
          </div>

          {/* Database Integration Tips */}
          <div className="bg-natural-sidebar rounded-3xl border border-natural-border/60 p-6 space-y-3">
            <h4 className="text-xs font-extrabold text-natural-heading uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-natural-accent" />
              Guide d'intégration PHP local
            </h4>
            <ul className="space-y-2.5 text-xs text-natural-text leading-relaxed list-disc list-inside font-semibold">
              <li>
                Installez PostgreSQL ou utilisez un serveur distant.
              </li>
              <li>
                Créez une base de données vide nommée <code className="font-mono bg-white px-1 border border-natural-border rounded-sm">import_export_abidjan</code>.
              </li>
              <li>
                Téléchargez le fichier <strong className="font-bold text-natural-heading">.sql</strong> généré ci-dessus.
              </li>
              <li>
                Exécutez ce script sur votre base pour créer instantanément les tables et insérer vos données réelles de test.
              </li>
              <li>
                Dans votre code PHP, utilisez PDO ou pg_connect pour lier votre code PHP local au serveur PostgreSQL.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
