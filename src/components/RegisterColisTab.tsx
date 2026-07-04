import React, { useState, useEffect } from "react";
import { Transitaire, Colis, PartColis, ColisType } from "../types";
import { Plus, Trash2, Package, Users, Calendar, Weight, DollarSign, AlertCircle, CheckCircle, Info } from "lucide-react";

interface RegisterColisTabProps {
  transitaires: Transitaire[];
  colisList: Colis[];
  onAddColis: (colis: Omit<Colis, "id">) => void;
}

interface TempPart {
  nomClient: string;
  poidsAttribue: string; // string so it can be edited easily
  montantDu: string; // string so it can be edited easily
}

export default function RegisterColisTab({
  transitaires,
  colisList,
  onAddColis,
}: RegisterColisTabProps) {
  // Main form states
  const [transitaireId, setTransitaireId] = useState("");
  const [code, setCode] = useState("");
  const [dateEnregistrement, setDateEnregistrement] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [type, setType] = useState<ColisType>("Simple");
  
  // Simple parcel specific states
  const [simplePoids, setSimplePoids] = useState("");
  const [simpleClient, setSimpleClient] = useState("");
  const [simpleMontantDu, setSimpleMontantDu] = useState("");

  // Mixte parcel specific states (array of parts)
  const [mixteParts, setMixteParts] = useState<TempPart[]>([
    { nomClient: "", poidsAttribue: "", montantDu: "" },
  ]);

  // Validation / Feedback states
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [codeAvailable, setCodeAvailable] = useState<boolean | null>(null);

  // Get unique existing client names for autocompletion
  const existingClientNames = React.useMemo(() => {
    const namesSet = new Set<string>();
    colisList.forEach((c) => {
      c.parts.forEach((p) => {
        if (p.nomClient && p.nomClient.trim()) {
          namesSet.add(p.nomClient.trim());
        }
      });
    });
    return Array.from(namesSet).sort();
  }, [colisList]);

  // Initialize transitaire if none selected
  useEffect(() => {
    if (transitaires.length > 0 && !transitaireId) {
      setTransitaireId(transitaires[0].id);
    }
  }, [transitaires, transitaireId]);

  // Check code uniqueness when input changes
  useEffect(() => {
    if (!code.trim()) {
      setCodeAvailable(null);
      return;
    }
    const exists = colisList.some(
      (c) => c.code.toLowerCase().trim() === code.toLowerCase().trim()
    );
    setCodeAvailable(!exists);
  }, [code, colisList]);

  const handleAddMixtePart = () => {
    setMixteParts([...mixteParts, { nomClient: "", poidsAttribue: "", montantDu: "" }]);
  };

  const handleRemoveMixtePart = (index: number) => {
    if (mixteParts.length <= 1) return;
    const updated = [...mixteParts];
    updated.splice(index, 1);
    setMixteParts(updated);
  };

  const handleMixtePartChange = (index: number, field: keyof TempPart, value: string) => {
    const updated = [...mixteParts];
    updated[index][field] = value;
    setMixteParts(updated);
  };

  // Compute live total weight for mixte parcels
  const calculatedMixtePoidsTotal = mixteParts.reduce((sum, part) => {
    const p = parseFloat(part.poidsAttribue) || 0;
    return sum + p;
  }, 0);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Basic common validations
    if (!transitaireId) {
      setErrorMsg("Veuillez sélectionner un transitaire.");
      return;
    }

    if (!code.trim()) {
      setErrorMsg("Le code du colis est requis.");
      return;
    }

    // Double check code uniqueness
    const codeExists = colisList.some(
      (c) => c.code.toLowerCase().trim() === code.toLowerCase().trim()
    );
    if (codeExists) {
      setErrorMsg(`Le code de colis "${code}" est déjà utilisé. Veuillez en choisir un autre.`);
      return;
    }

    if (!dateEnregistrement) {
      setErrorMsg("La date d'enregistrement est requise.");
      return;
    }

    if (type === "Simple") {
      // Validate Simple Colis
      const poids = parseFloat(simplePoids);
      const client = simpleClient.trim();
      const montantDu = parseFloat(simpleMontantDu);

      if (isNaN(poids) || poids <= 0) {
        setErrorMsg("Le poids total doit être un nombre supérieur à 0.");
        return;
      }

      if (!client) {
        setErrorMsg("Le nom du client est requis.");
        return;
      }

      if (isNaN(montantDu) || montantDu < 0) {
        setErrorMsg("Le montant dû doit être supérieur ou égal à 0.");
        return;
      }

      // Prepare payload
      const parts: PartColis[] = [
        {
          id: `part-${Date.now()}-1`,
          nomClient: client,
          poidsAttribue: poids,
          montantDu: montantDu,
          montantPaye: 0,
        },
      ];

      onAddColis({
        code: code.trim().toUpperCase(),
        transitaireId,
        dateEnregistrement,
        poidsTotal: poids,
        type,
        parts,
      });

      // Clear Form
      setCode("");
      setSimplePoids("");
      setSimpleClient("");
      setSimpleMontantDu("");
      setSuccessMsg("Colis simple enregistré avec succès !");

    } else {
      // Validate Mixte Colis
      if (mixteParts.length === 0) {
        setErrorMsg("Un colis mixte doit contenir au moins une part.");
        return;
      }

      const parts: PartColis[] = [];
      let totalPoids = 0;

      for (let i = 0; i < mixteParts.length; i++) {
        const p = mixteParts[i];
        const clientName = p.nomClient.trim();
        const poidsAttr = parseFloat(p.poidsAttribue);
        const montantDu = parseFloat(p.montantDu);

        if (!clientName) {
          setErrorMsg(`Le nom du client à la ligne ${i + 1} est requis.`);
          return;
        }

        if (isNaN(poidsAttr) || poidsAttr <= 0) {
          setErrorMsg(`Le poids attribué à la ligne ${i + 1} (${clientName}) doit être supérieur à 0.`);
          return;
        }

        if (isNaN(montantDu) || montantDu < 0) {
          setErrorMsg(`Le montant dû à la ligne ${i + 1} (${clientName}) doit être supérieur ou égal à 0.`);
          return;
        }

        parts.push({
          id: `part-${Date.now()}-${i}`,
          nomClient: clientName,
          poidsAttribue: poidsAttr,
          montantDu: montantDu,
          montantPaye: 0,
        });

        totalPoids += poidsAttr;
      }

      onAddColis({
        code: code.trim().toUpperCase(),
        transitaireId,
        dateEnregistrement,
        poidsTotal: parseFloat(totalPoids.toFixed(2)),
        type,
        parts,
      });

      // Clear Form
      setCode("");
      setMixteParts([{ nomClient: "", poidsAttribue: "", montantDu: "" }]);
      setSuccessMsg("Colis mixte enregistré avec succès !");
    }

    // Auto clear success message after 4 seconds
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div id="register-colis-container" className="max-w-4xl mx-auto bg-white rounded-3xl border border-natural-border shadow-md p-6 md:p-8 animate-fade-in">
      <div id="register-colis-header" className="flex items-center gap-3 mb-6 pb-4 border-b border-natural-border">
        <Package className="w-6 h-6 text-natural-primary" />
        <div>
          <h3 className="text-base font-bold text-natural-heading">Enregistrer un Nouveau Colis</h3>
          <p className="text-xs text-natural-primary">Ajouter un colis simple ou partagé (mixte) reçu de vos transitaires</p>
        </div>
      </div>

      {errorMsg && (
        <div id="register-error-alert" className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-900 rounded-r-2xl flex items-start gap-3 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div id="register-success-alert" className="mb-6 p-4 bg-natural-light border-l-4 border-natural-accent text-natural-heading rounded-r-2xl flex items-start gap-3 text-xs font-bold">
          <CheckCircle className="w-5 h-5 shrink-0 text-natural-accent" />
          <span>{successMsg}</span>
        </div>
      )}

      <form id="colis-registration-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Transitaire, Code, Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-natural-heading mb-1 flex items-center gap-1">
              Transitaire <span className="text-red-500">*</span>
            </label>
            <select
              id="colis-transitaire-select"
              value={transitaireId}
              onChange={(e) => setTransitaireId(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-natural-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-natural-light text-natural-heading font-semibold"
              required
            >
              {transitaires.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-natural-heading mb-1 flex items-center gap-1">
              Code Unique Colis <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="colis-code-input"
                type="text"
                placeholder="Ex: 115"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-natural-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-natural-light text-natural-heading font-mono font-bold uppercase"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {codeAvailable === true && (
                  <span className="text-[10px] bg-natural-border text-natural-heading px-2 py-0.5 rounded-md font-bold border border-natural-border">Disponible</span>
                )}
                {codeAvailable === false && (
                  <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-md font-bold">Déjà pris</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-natural-heading mb-1 flex items-center gap-1">
              Date d'Enregistrement <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="colis-date-input"
                type="date"
                value={dateEnregistrement}
                onChange={(e) => setDateEnregistrement(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-natural-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-natural-light text-natural-heading font-semibold"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 2: Colis Type Selection */}
        <div id="colis-type-container">
          <label className="block text-xs font-bold text-natural-heading mb-2">
            Type de Colis <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              id="type-simple-btn"
              type="button"
              onClick={() => setType("Simple")}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                type === "Simple"
                  ? "border-natural-accent bg-natural-light text-natural-heading font-bold ring-2 ring-natural-accent/10"
                  : "border-natural-border bg-white hover:bg-natural-light text-natural-primary"
              }`}
            >
              <div className={`p-2 rounded-lg ${type === "Simple" ? "bg-natural-accent text-white" : "bg-natural-sidebar text-natural-primary"}`}>
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold">Colis Simple</span>
                <span className="block text-[10px] text-natural-primary font-medium mt-0.5">S'applique à un seul client unique</span>
              </div>
            </button>

            <button
              id="type-mixte-btn"
              type="button"
              onClick={() => setType("Mixte")}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                type === "Mixte"
                  ? "border-natural-accent bg-natural-light text-natural-heading font-bold ring-2 ring-natural-accent/10"
                  : "border-natural-border bg-white hover:bg-natural-light text-natural-primary"
              }`}
            >
              <div className={`p-2 rounded-lg ${type === "Mixte" ? "bg-natural-accent text-white" : "bg-natural-sidebar text-natural-primary"}`}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold">Colis Mixte</span>
                <span className="block text-[10px] text-natural-primary font-medium mt-0.5">Partagé entre plusieurs clients</span>
              </div>
            </button>
          </div>
        </div>

        {/* Conditional Layouts */}
        {type === "Simple" ? (
          /* SIMPLE COLIS LAYOUT */
          <div id="simple-colis-fields" className="bg-natural-light rounded-2xl p-5 border border-natural-border grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-natural-heading mb-1 flex items-center gap-1">
                <Weight className="w-3.5 h-3.5 text-natural-primary" />
                Poids Total (kg) <span className="text-red-500">*</span>
              </label>
              <input
                id="simple-poids-input"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Poids du colis"
                value={simplePoids}
                onChange={(e) => setSimplePoids(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-natural-border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-white text-natural-heading font-medium"
                required={type === "Simple"}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-natural-heading mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-natural-primary" />
                Nom du Client <span className="text-red-500">*</span>
              </label>
              <input
                id="simple-client-input"
                type="text"
                placeholder="Ex: Kouamé Koffi"
                value={simpleClient}
                onChange={(e) => setSimpleClient(e.target.value)}
                list="clients-list"
                className="w-full px-3 py-2 text-xs border border-natural-border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-white text-natural-heading font-medium"
                required={type === "Simple"}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-natural-heading mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-natural-primary" />
                Montant Dû (F CFA) <span className="text-red-500">*</span>
              </label>
              <input
                id="simple-montant-input"
                type="number"
                min="0"
                placeholder="Ex: 25000"
                value={simpleMontantDu}
                onChange={(e) => setSimpleMontantDu(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-natural-border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-white text-natural-heading font-mono font-bold"
                required={type === "Simple"}
              />
              <span className="text-[10px] text-natural-accent font-bold mt-1 block">
                Saisi manuellement (non calculé)
              </span>
            </div>
          </div>
        ) : (
          /* MIXTE COLIS LAYOUT */
          <div id="mixte-colis-fields" className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-natural-border">
              <h4 className="text-xs font-bold text-natural-heading flex items-center gap-1.5">
                <Users className="w-4 h-4 text-natural-accent" />
                Répartition des clients (parts)
              </h4>
              <button
                id="add-mixte-part-btn"
                type="button"
                onClick={handleAddMixtePart}
                className="text-xs font-bold text-natural-accent hover:text-natural-accent-hover hover:bg-natural-sidebar px-3 py-1.5 rounded-lg border border-natural-accent transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter un client
              </button>
            </div>

            {/* List of parts */}
            <div className="space-y-3">
              {mixteParts.map((part, index) => (
                <div
                  id={`mixte-part-row-${index}`}
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-natural-light rounded-xl border border-natural-border items-center"
                >
                  <div className="md:col-span-1 text-center md:text-left">
                    <span className="text-xs font-mono font-bold bg-natural-sidebar text-natural-heading px-2.5 py-1 rounded-full border border-natural-border">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-bold text-natural-primary mb-1 md:hidden">Client</label>
                    <input
                      id={`mixte-client-input-${index}`}
                      type="text"
                      placeholder="Nom du client"
                      value={part.nomClient}
                      onChange={(e) => handleMixtePartChange(index, "nomClient", e.target.value)}
                      list="clients-list"
                      className="w-full px-3 py-1.5 text-xs border border-natural-border rounded-lg bg-white text-natural-heading font-medium"
                      required={type === "Mixte"}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-natural-primary mb-1 md:hidden">Poids (kg)</label>
                    <div className="relative">
                      <input
                        id={`mixte-poids-input-${index}`}
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="Poids (kg)"
                        value={part.poidsAttribue}
                        onChange={(e) => handleMixtePartChange(index, "poidsAttribue", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-natural-border rounded-lg bg-white text-natural-heading font-medium"
                        required={type === "Mixte"}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-natural-primary mb-1 md:hidden">Montant Dû</label>
                    <input
                      id={`mixte-montant-input-${index}`}
                      type="number"
                      min="0"
                      placeholder="Montant Dû (F)"
                      value={part.montantDu}
                      onChange={(e) => handleMixtePartChange(index, "montantDu", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-natural-border rounded-lg bg-white font-mono font-bold text-natural-heading"
                      required={type === "Mixte"}
                    />
                  </div>

                  <div className="md:col-span-1 text-center">
                    <button
                      id={`delete-mixte-part-${index}`}
                      type="button"
                      onClick={() => handleRemoveMixtePart(index)}
                      className="p-1.5 text-natural-primary hover:text-red-600 rounded-md hover:bg-white border border-transparent hover:border-natural-border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      disabled={mixteParts.length <= 1}
                      title="Enlever ce client"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Total Weight Calc & Warning Banner */}
            <div id="mixte-poids-indicator" className="p-4 bg-natural-light border border-natural-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-natural-heading">
                <Weight className="w-5 h-5 text-natural-primary" />
                <span className="text-xs font-bold">
                  Poids total calculé automatiquement :{" "}
                  <strong className="text-sm font-bold text-natural-heading font-mono bg-natural-sidebar px-2.5 py-1 rounded-lg border border-natural-border ml-1">
                    {calculatedMixtePoidsTotal.toFixed(2)} kg
                  </strong>
                </span>
              </div>
              
              <span className="text-xs font-bold text-natural-accent bg-natural-sidebar border border-natural-border px-3 py-1.5 rounded-lg">
                Somme des parts
              </span>
            </div>
          </div>
        )}

        {/* Helper info on manually entered amount */}
        <div id="manually-entered-info" className="flex gap-2 items-center text-xs text-[#92400E] bg-[#FEF3C7]/40 p-4 rounded-xl border border-[#F59E0B]/20">
          <Info className="w-4 h-4 text-[#D97406] shrink-0" />
          <span className="font-medium">Note : Le montant dû n'est jamais calculé à partir du poids. Vous devez le saisir manuellement pour chaque client.</span>
        </div>

        {/* Save Button */}
        <div id="save-colis-wrapper" className="pt-4 flex justify-end">
          <button
            id="register-colis-submit-btn"
            type="submit"
            className="px-6 py-3 bg-natural-accent hover:bg-natural-accent-hover text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Enregistrer le Colis
          </button>
        </div>
      </form>

      <datalist id="clients-list">
        {existingClientNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
    </div>
  );
}
