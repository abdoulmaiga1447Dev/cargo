import React, { useState } from "react";
import { Colis, Transitaire, PartColis } from "../types";
import { Search, Calendar, Landmark, Package, PackageCheck, User, ChevronDown, ChevronUp, Clock, Weight, Scale } from "lucide-react";

interface RechercheTabProps {
  colisList: Colis[];
  transitaires: Transitaire[];
  onRecordPayment: (colisId: string, partId: string, amount: number) => void;
  onToggleRetrieval: (colisId: string, partId: string) => void;
}

export default function RechercheTab({
  colisList,
  transitaires,
  onRecordPayment,
  onToggleRetrieval,
}: RechercheTabProps) {
  const [searchCode, setSearchCode] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [filterTransitaireId, setFilterTransitaireId] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [expandedColisId, setExpandedColisId] = useState<string | null>(null);

  // Filter logic and sorted by date descending (newest first)
  const filteredColis = colisList
    .filter((colis) => {
      // 1. Filter by parcel code
      if (searchCode.trim() && !colis.code.toLowerCase().includes(searchCode.trim().toLowerCase())) {
        return false;
      }

      // 2. Filter by client name
      if (searchClient.trim()) {
        const hasMatchingClient = colis.parts.some((part) =>
          part.nomClient.toLowerCase().includes(searchClient.trim().toLowerCase())
        );
        if (!hasMatchingClient) return false;
      }

      // 3. Filter by transitaire
      if (filterTransitaireId && colis.transitaireId !== filterTransitaireId) {
        return false;
      }

      // 4. Filter by date
      if (filterDate && colis.dateEnregistrement !== filterDate) {
        return false;
      }

      return true;
    })
    .sort((a, b) => b.dateEnregistrement.localeCompare(a.dateEnregistrement));

  const toggleExpand = (id: string) => {
    setExpandedColisId(expandedColisId === id ? null : id);
  };

  const getTransitaireNom = (id: string) => {
    return transitaires.find((t) => t.id === id)?.nom || "Inconnu";
  };

  return (
    <div id="recherche-tab-container" className="space-y-6">
      {/* Search Filters Card */}
      <div id="search-filters-card" className="bg-white rounded-3xl border border-natural-border shadow-sm p-6 animate-fade-in">
        <h3 className="text-base font-bold text-natural-heading mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-natural-primary" />
          Filtres de Recherche & Historique
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Code Colis */}
          <div>
            <label className="block text-xs font-bold text-natural-heading mb-1 flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-natural-primary" />
              Code du Colis
            </label>
            <input
              id="search-code-colis"
              type="text"
              placeholder="Ex: 115"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-natural-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-natural-light text-natural-heading font-mono font-bold"
            />
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-xs font-bold text-natural-heading mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-natural-primary" />
              Nom du Client
            </label>
            <input
              id="search-nom-client"
              type="text"
              placeholder="Ex: Mamadou..."
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-natural-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-natural-light text-natural-heading font-semibold"
            />
          </div>

          {/* Transitaire */}
          <div>
            <label className="block text-xs font-bold text-natural-heading mb-1 flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-natural-primary" />
              Filtrer par Transitaire
            </label>
            <select
              id="search-filter-transitaire"
              value={filterTransitaireId}
              onChange={(e) => setFilterTransitaireId(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-natural-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-natural-light text-natural-heading font-semibold"
            >
              <option value="">Tous les transitaires</option>
              {transitaires.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-natural-heading mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-natural-primary" />
              Filtrer par Date
            </label>
            <input
              id="search-filter-date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-natural-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-natural-light text-natural-heading font-semibold"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchCode || searchClient || filterTransitaireId || filterDate) && (
          <div className="mt-4 flex justify-end">
            <button
              id="clear-filters-btn"
              onClick={() => {
                setSearchCode("");
                setSearchClient("");
                setFilterTransitaireId("");
                setFilterDate("");
              }}
              className="text-xs font-bold text-natural-accent hover:text-natural-accent-hover bg-natural-sidebar hover:bg-natural-border border border-natural-border px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Results Container */}
      <div id="search-results-card" className="bg-white rounded-3xl border border-natural-border shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-natural-heading">
            Résultats de la recherche ({filteredColis.length} colis trouvés)
          </h4>
          <span className="text-xs text-natural-primary font-medium">Cliquez sur un colis pour voir les parts et paiements</span>
        </div>

        {filteredColis.length === 0 ? (
          <div id="no-results-view" className="text-center py-12 text-natural-primary font-medium">
            Aucun colis ne correspond à vos filtres de recherche.
          </div>
        ) : (
          <div id="results-accordion" className="space-y-3">
            {filteredColis.map((colis) => {
              const isExpanded = expandedColisId === colis.id;
              const totalDue = colis.parts.reduce((sum, p) => sum + p.montantDu, 0);
              const totalPaid = colis.parts.reduce((sum, p) => sum + p.montantPaye, 0);
              const totalRemaining = totalDue - totalPaid;
              const transitaireNom = getTransitaireNom(colis.transitaireId);

              return (
                <div
                  id={`colis-row-${colis.id}`}
                  key={colis.id}
                  className={`border rounded-2xl overflow-hidden transition-all ${
                    isExpanded ? "border-natural-primary/40 bg-natural-light/20" : "border-natural-border/30 bg-white hover:bg-natural-light/20"
                  }`}
                >
                  {/* Accordion Trigger */}
                  <div
                    id={`trigger-${colis.id}`}
                    onClick={() => toggleExpand(colis.id)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-natural-sidebar border border-natural-border text-natural-heading font-mono font-bold text-xs shrink-0">
                        {colis.code}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-natural-heading">{transitaireNom}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              colis.type === "Simple"
                                ? "bg-natural-sidebar text-natural-heading border border-natural-border"
                                : "bg-[#D5E0E5] text-slate-700 border border-slate-200"
                            }`}
                          >
                            {colis.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-natural-primary mt-1 font-bold font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-natural-primary" />
                            {colis.dateEnregistrement}
                          </span>
                          <span className="flex items-center gap-1">
                            <Weight className="w-3.5 h-3.5 text-natural-primary" />
                            {colis.poidsTotal} kg
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side sums info */}
                    <div className="flex items-center gap-6 justify-between md:justify-end">
                      <div className="grid grid-cols-3 gap-4 text-left text-xs">
                        <div>
                          <span className="text-[10px] text-natural-primary block font-bold uppercase tracking-wider">TOTAL DÛ</span>
                          <span className="font-mono font-bold text-natural-heading">{totalDue.toLocaleString()} F</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-natural-primary block font-bold uppercase tracking-wider">PAYÉ</span>
                          <span className="font-mono font-bold text-natural-accent">{totalPaid.toLocaleString()} F</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-natural-primary block font-bold uppercase tracking-wider">RESTANT</span>
                          <span
                            className={`font-mono font-bold ${
                              totalRemaining > 0 ? "text-[#D97706]" : "text-natural-accent"
                            }`}
                          >
                            {totalRemaining.toLocaleString()} F
                          </span>
                        </div>
                      </div>

                      <div className="p-1.5 rounded-full hover:bg-natural-sidebar text-natural-primary shrink-0 transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Section */}
                  {isExpanded && (
                    <div id={`details-${colis.id}`} className="border-t border-natural-border bg-white p-4">
                      <h5 className="text-[10px] font-bold text-natural-primary uppercase tracking-wider mb-3">
                        Détail des parts & règlements clients
                      </h5>

                      <div className="space-y-3">
                        {colis.parts.map((p, pIndex) => {
                          const restPart = p.montantDu - p.montantPaye;
                          const pct = p.montantDu > 0 ? (p.montantPaye / p.montantDu) * 100 : 0;
                          return (
                            <div
                              id={`part-details-${colis.id}-${p.id}`}
                              key={p.id}
                              className="p-3.5 rounded-xl border border-natural-border bg-natural-light flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1 items-center">
                                <div>
                                  <span className="text-[10px] text-natural-primary block font-bold uppercase">Client</span>
                                  <span className="font-bold text-natural-heading text-xs">{p.nomClient}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-natural-primary block font-bold uppercase">Poids Attribué</span>
                                  <span className="font-bold text-natural-heading text-xs font-mono">{p.poidsAttribue} kg</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-natural-primary block font-bold uppercase">Reste à recouvrer</span>
                                  <span
                                    className={`text-xs font-bold ${
                                      restPart > 0 ? "text-[#D97706]" : "text-natural-accent"
                                    }`}
                                  >
                                    {restPart.toLocaleString()} F CFA
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 justify-between md:justify-end shrink-0">
                                <div className="text-right text-xs">
                                  <div className="flex justify-between items-center gap-4 text-[10px] font-bold text-natural-primary mb-1">
                                    <span>Dû: <strong className="text-natural-heading font-mono">{p.montantDu.toLocaleString()} F</strong></span>
                                    <span>Payé: <strong className="text-natural-accent font-mono">{p.montantPaye.toLocaleString()} F</strong></span>
                                  </div>
                                  <div className="w-40 bg-natural-sidebar h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-natural-accent h-full"
                                      style={{ width: `${pct}%` }}
                                    ></div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                      restPart > 0
                                        ? "bg-red-50 text-red-800 border-red-100"
                                        : "bg-natural-sidebar text-natural-accent border-natural-border"
                                    }`}
                                  >
                                    {restPart > 0 ? "Impayé" : "Réglé"}
                                  </span>

                                  <button
                                    id={`search-toggle-retire-${colis.id}-${p.id}`}
                                    onClick={() => onToggleRetrieval(colis.id, p.id)}
                                    className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full border transition-all cursor-pointer ${
                                      p.estRetire
                                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                    }`}
                                  >
                                    {p.estRetire ? (
                                      <>
                                        <PackageCheck className="w-3 h-3" />
                                        Retiré
                                      </>
                                    ) : (
                                      <>
                                        <Package className="w-3 h-3" />
                                        Non retiré
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
