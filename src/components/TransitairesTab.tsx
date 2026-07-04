import React, { useState } from "react";
import { Transitaire, Colis } from "../types";
import { Plus, Edit2, Trash2, Package, Search, Landmark, FileText, AlertTriangle } from "lucide-react";

interface TransitairesTabProps {
  transitaires: Transitaire[];
  colisList: Colis[];
  onAddTransitaire: (nom: string) => void;
  onEditTransitaire: (id: string, nouveauNom: string) => void;
  onDeleteTransitaire: (id: string) => void;
}

export default function TransitairesTab({
  transitaires,
  colisList,
  onAddTransitaire,
  onEditTransitaire,
  onDeleteTransitaire,
}: TransitairesTabProps) {
  const [selectedTransitaireId, setSelectedTransitaireId] = useState<string | null>(
    transitaires.length > 0 ? transitaires[0].id : null
  );
  
  const [newNom, setNewNom] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNom, setEditingNom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransitaires = transitaires.filter((t) =>
    t.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Colis for the selected transitaire, sorted by date descending (newest first)
  const selectedTransitaireColis = colisList
    .filter((c) => c.transitaireId === selectedTransitaireId)
    .sort((a, b) => b.dateEnregistrement.localeCompare(a.dateEnregistrement));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNom.trim()) return;
    onAddTransitaire(newNom.trim());
    setNewNom("");
  };

  const handleStartEdit = (t: Transitaire) => {
    setEditingId(t.id);
    setEditingNom(t.nom);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingNom.trim()) return;
    onEditTransitaire(id, editingNom.trim());
    setEditingId(null);
  };

  const handleDeleteClick = (id: string, nom: string) => {
    const linkedColisCount = colisList.filter((c) => c.transitaireId === id).length;
    if (linkedColisCount > 0) {
      if (
        window.confirm(
          `Attention ! Le transitaire "${nom}" a ${linkedColisCount} colis enregistré(s). La suppression supprimera également tous ces colis et leurs paiements. Voulez-vous continuer ?`
        )
      ) {
        onDeleteTransitaire(id);
        if (selectedTransitaireId === id) {
          const remaining = transitaires.filter((t) => t.id !== id);
          setSelectedTransitaireId(remaining.length > 0 ? remaining[0].id : null);
        }
      }
    } else {
      if (window.confirm(`Voulez-vous vraiment supprimer le transitaire "${nom}" ?`)) {
        onDeleteTransitaire(id);
        if (selectedTransitaireId === id) {
          const remaining = transitaires.filter((t) => t.id !== id);
          setSelectedTransitaireId(remaining.length > 0 ? remaining[0].id : null);
        }
      }
    }
  };

  return (
    <div id="transitaires-tab-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Columns - Transitaires List */}
      <div id="transitaires-list-card" className="lg:col-span-1 bg-white rounded-3xl border border-natural-border shadow-sm p-6 flex flex-col h-full">
        <h3 id="transitaires-title" className="text-base font-bold text-natural-heading mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-natural-primary" />
          Liste des Transitaires
        </h3>

        {/* Add Transitaire Form */}
        <form id="add-transitaire-form" onSubmit={handleCreate} className="mb-5">
          <div className="flex gap-2">
            <input
              id="new-transitaire-input"
              type="text"
              placeholder="Nom du nouveau transitaire..."
              value={newNom}
              onChange={(e) => setNewNom(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs border border-natural-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-natural-light text-natural-heading placeholder:text-natural-primary/60 font-medium"
              required
            />
            <button
              id="add-transitaire-btn"
              type="submit"
              className="px-4 py-2.5 bg-natural-accent hover:bg-natural-accent-hover text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </form>

        {/* Search */}
        <div id="search-transitaire-wrapper" className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-natural-primary" />
          <input
            id="search-transitaire-input"
            type="text"
            placeholder="Rechercher un transitaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs border border-natural-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-natural-light text-natural-heading placeholder:text-natural-primary/60"
          />
        </div>

        {/* Transitaires List */}
        <div id="transitaires-list-scroll" className="space-y-2 max-h-[400px] overflow-y-auto pr-1 flex-1">
          {filteredTransitaires.length === 0 ? (
            <p id="no-transitaire-msg" className="text-xs text-natural-primary text-center py-6 font-medium">Aucun transitaire trouvé.</p>
          ) : (
            filteredTransitaires.map((t) => {
              const count = colisList.filter((c) => c.transitaireId === t.id).length;
              const isSelected = selectedTransitaireId === t.id;
              const isEditing = editingId === t.id;

              return (
                <div
                  id={`transitaire-item-${t.id}`}
                  key={t.id}
                  onClick={() => !isEditing && setSelectedTransitaireId(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected && !isEditing
                      ? "bg-natural-border border-natural-border text-natural-heading font-bold shadow-xs"
                      : "border-natural-border/30 hover:bg-natural-light text-natural-text"
                  } ${!isEditing ? "cursor-pointer" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {isEditing ? (
                      <input
                        id={`edit-transitaire-input-${t.id}`}
                        type="text"
                        value={editingNom}
                        onChange={(e) => setEditingNom(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs border border-natural-border rounded-lg bg-white text-natural-heading focus:ring-2 focus:ring-natural-primary/20 focus:outline-hidden font-medium"
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    ) : (
                      <span id={`transitaire-name-${t.id}`} className="truncate block flex-1 text-xs font-semibold">
                        {t.nom}
                      </span>
                    )}

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {isEditing ? (
                        <button
                          id={`save-transitaire-btn-${t.id}`}
                          onClick={() => handleSaveEdit(t.id)}
                          className="px-3 py-1 bg-natural-accent hover:bg-natural-accent-hover text-white text-[10px] rounded-lg font-bold"
                        >
                          Sauver
                        </button>
                      ) : (
                        <>
                          <span id={`transitaire-colis-count-${t.id}`} className="text-[10px] font-mono bg-natural-sidebar text-natural-primary px-2 py-0.5 rounded-full mr-1 font-bold">
                            {count} colis
                          </span>
                          <button
                            id={`edit-transitaire-btn-${t.id}`}
                            onClick={() => handleStartEdit(t)}
                            className="p-1 text-natural-primary hover:text-natural-heading rounded-md hover:bg-natural-sidebar transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-transitaire-btn-${t.id}`}
                            onClick={() => handleDeleteClick(t.id, t.nom)}
                            className="p-1 text-natural-primary hover:text-red-600 rounded-md hover:bg-natural-sidebar transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column - Parcels of Selected Transitaire */}
      <div id="transitaire-colis-card" className="lg:col-span-2 bg-white rounded-3xl border border-natural-border shadow-sm p-6 flex flex-col">
        {selectedTransitaireId ? (
          <>
            <div id="transitaire-colis-header" className="flex items-center justify-between mb-4 pb-3 border-b border-natural-border">
              <div>
                <h4 id="transitaire-detail-title" className="text-base font-bold text-natural-heading">
                  {transitaires.find((t) => t.id === selectedTransitaireId)?.nom}
                </h4>
                <p id="transitaire-detail-subtitle" className="text-xs text-natural-primary mt-0.5">
                  Liste des colis reçus de ce transitaire
                </p>
              </div>
              <span id="transitaire-detail-badge" className="text-xs font-bold bg-natural-sidebar text-natural-heading border border-natural-border px-3 py-1.5 rounded-xl">
                {selectedTransitaireColis.length} Colis Enregistrés
              </span>
            </div>

            <div id="transitaire-colis-scroll" className="flex-1 overflow-y-auto max-h-[460px]">
              {selectedTransitaireColis.length === 0 ? (
                <div id="no-colis-view" className="text-center py-16 text-natural-primary flex flex-col items-center gap-2">
                  <Package className="w-12 h-12 text-natural-border" />
                  <p className="text-sm font-medium">Aucun colis n'est enregistré pour ce transitaire.</p>
                </div>
              ) : (
                <div id="transitaire-colis-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTransitaireColis.map((colis) => {
                    const totalDue = colis.parts.reduce((sum, p) => sum + p.montantDu, 0);
                    const totalPaid = colis.parts.reduce((sum, p) => sum + p.montantPaye, 0);
                    const remaining = totalDue - totalPaid;

                    return (
                      <div
                        id={`colis-card-${colis.id}`}
                        key={colis.id}
                        className="p-5 rounded-2xl border border-natural-border hover:border-natural-primary/40 hover:shadow-sm transition-all bg-white"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-mono font-bold text-natural-heading bg-natural-sidebar px-2 py-0.5 rounded-sm">
                              {colis.code}
                            </span>
                            <span className="ml-2 text-xs text-natural-primary font-bold font-mono">
                              {colis.dateEnregistrement}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              colis.type === "Simple"
                                ? "bg-natural-sidebar text-natural-heading border border-natural-border"
                                : "bg-[#D5E0E5] text-slate-700 border border-slate-200"
                            }`}
                          >
                            {colis.type}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 my-3 text-xs border-y border-natural-border py-2">
                          <div>
                            <span className="text-natural-primary block text-[10px] uppercase font-bold">Poids Total</span>
                            <span className="font-bold text-natural-heading text-sm">{colis.poidsTotal} kg</span>
                          </div>
                          <div>
                            <span className="text-natural-primary block text-[10px] uppercase font-bold">Destinataire(s)</span>
                            <span className="font-semibold text-natural-heading block truncate">
                              {colis.type === "Simple"
                                ? colis.parts[0]?.nomClient
                                : `${colis.parts.length} personnes`}
                            </span>
                          </div>
                        </div>

                        {/* Financial Mini-Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-natural-primary font-medium">
                            <span>Dû: <strong className="text-natural-heading font-mono">{totalDue.toLocaleString()} F</strong></span>
                            <span>Payé: <strong className="text-natural-accent font-mono">{totalPaid.toLocaleString()} F</strong></span>
                          </div>
                          
                          {/* Mini Progress Bar */}
                          <div className="w-full bg-natural-sidebar h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-natural-accent h-full transition-all"
                              style={{ width: `${totalDue > 0 ? (totalPaid / totalDue) * 100 : 0}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center pt-1.5">
                            <span className="text-[10px] text-natural-primary">Reste à payer :</span>
                            <span className={`text-xs font-bold ${remaining > 0 ? "text-[#D97706]" : "text-natural-accent"}`}>
                              {remaining.toLocaleString()} F CFA
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div id="no-transitaire-selected" className="text-center py-20 text-natural-primary flex flex-col items-center justify-center gap-3">
            <Landmark className="w-16 h-16 text-natural-border" />
            <h4 className="text-md font-bold text-natural-heading">Aucun transitaire sélectionné</h4>
            <p className="text-xs max-w-sm text-natural-primary/80 leading-relaxed">
              Ajoutez un transitaire ou sélectionnez-en un dans la liste de gauche pour voir ses détails et ses colis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
