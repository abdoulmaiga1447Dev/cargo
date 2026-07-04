import React, { useState } from "react";
import { Colis, Transitaire, PartColis, PaymentLog } from "../types";
import { Check, Edit2, AlertCircle, Search, DollarSign, ArrowUpRight, TrendingUp, Sparkles, Filter, Package, PackageCheck } from "lucide-react";

interface PaiementsTabProps {
  colisList: Colis[];
  transitaires: Transitaire[];
  onRecordPayment: (colisId: string, partId: string, amount: number) => void;
  onResetPayment: (colisId: string, partId: string) => void;
  onToggleRetrieval: (colisId: string, partId: string) => void;
}

export default function PaiementsTab({
  colisList,
  transitaires,
  onRecordPayment,
  onResetPayment,
  onToggleRetrieval,
}: PaiementsTabProps) {
  const [filterType, setFilterType] = useState<"all" | "unpaid" | "paid">("unpaid");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for recording payment
  const [payingPartId, setPayingPartId] = useState<string | null>(null);
  const [payingColisId, setPayingColisId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // Extract all client parts across all packages
  const clientParts = colisList.flatMap((colis) => {
    const trans = transitaires.find((t) => t.id === colis.transitaireId);
    return colis.parts.map((part) => {
      const reste = part.montantDu - part.montantPaye;
      const progress = part.montantDu > 0 ? (part.montantPaye / part.montantDu) * 100 : 0;
      return {
        colisId: colis.id,
        colisCode: colis.code,
        colisDate: colis.dateEnregistrement,
        transitaireNom: trans?.nom || "Inconnu",
        part,
        reste,
        progress,
      };
    });
  });

  // Apply search and status filters
  const filteredParts = clientParts.filter((item) => {
    const matchesSearch =
      item.part.nomClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.colisCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.transitaireNom.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "unpaid") {
      return item.reste > 0;
    } else if (filterType === "paid") {
      return item.reste === 0 && item.part.montantDu > 0;
    }
    return true; // "all"
  });

  // Calculate statistics for cards
  const totalDue = clientParts.reduce((sum, item) => sum + item.part.montantDu, 0);
  const totalPaid = clientParts.reduce((sum, item) => sum + item.part.montantPaye, 0);
  const totalRemaining = totalDue - totalPaid;
  const unpaidCount = clientParts.filter((item) => item.reste > 0).length;

  const handleOpenPayment = (colisId: string, partId: string, currentReste: number) => {
    setPayingColisId(colisId);
    setPayingPartId(partId);
    setPaymentAmount(currentReste.toString());
    setPaymentError("");
  };

  const handleClosePayment = () => {
    setPayingColisId(null);
    setPayingPartId(null);
    setPaymentAmount("");
    setPaymentError("");
  };

  const handleSavePayment = (colisId: string, partId: string, maxAllowed: number) => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setPaymentError("Veuillez saisir un montant valide supérieur à 0.");
      return;
    }
    if (amount > maxAllowed) {
      setPaymentError(`Le montant ne peut pas dépasser le reste à payer de ${maxAllowed.toLocaleString()} F CFA.`);
      return;
    }

    onRecordPayment(colisId, partId, amount);
    handleClosePayment();
  };

  const handleReset = (colisId: string, partId: string, nomClient: string) => {
    if (window.confirm(`Réinitialiser tous les paiements pour ${nomClient} sur ce colis ?`)) {
      onResetPayment(colisId, partId);
    }
  };

  return (
    <div id="paiements-tab-container" className="space-y-6">
      {/* KPI Cards */}
      <div id="financial-kpi-grid" className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
        <div className="bg-white rounded-3xl border border-natural-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-natural-sidebar text-natural-primary">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-natural-primary block uppercase font-bold tracking-wider">Total des Montants Dus</span>
            <strong className="text-base text-natural-heading font-bold font-mono">{totalDue.toLocaleString()} F CFA</strong>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-natural-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-natural-light text-natural-accent">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-natural-accent block uppercase font-bold tracking-wider">Total Payé</span>
            <strong className="text-base text-natural-accent font-bold font-mono">{totalPaid.toLocaleString()} F CFA</strong>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-natural-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#FFFbeb] text-[#D97706]">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#D97706] block uppercase font-bold tracking-wider">Reste à Recouvrer</span>
            <strong className="text-base text-[#D97706] font-bold font-mono">{totalRemaining.toLocaleString()} F CFA</strong>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-natural-border p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-natural-sidebar text-natural-heading">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-natural-primary block uppercase font-bold tracking-wider">Clients Impayés</span>
            <strong className="text-base text-natural-heading font-bold">{unpaidCount} Clients</strong>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div id="paiements-table-card" className="bg-white rounded-3xl border border-natural-border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-natural-heading">Suivi & Règlement des Clients</h3>
            <p className="text-xs text-natural-primary">Gerez les encaissements par client et visualisez les impayes</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filter Buttons */}
            <div className="inline-flex rounded-xl bg-natural-sidebar p-1">
              <button
                id="filter-unpaid-btn"
                onClick={() => setFilterType("unpaid")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterType === "unpaid" ? "bg-white text-natural-heading shadow-sm" : "text-natural-primary hover:text-natural-heading"
                }`}
              >
                Impayés ({unpaidCount})
              </button>
              <button
                id="filter-paid-btn"
                onClick={() => setFilterType("paid")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterType === "paid" ? "bg-white text-natural-heading shadow-sm" : "text-natural-primary hover:text-natural-heading"
                }`}
              >
                Soldés
              </button>
              <button
                id="filter-all-btn"
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterType === "all" ? "bg-white text-natural-heading shadow-sm" : "text-natural-primary hover:text-natural-heading"
                }`}
              >
                Tous
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-natural-primary" />
              <input
                id="client-payment-search"
                type="text"
                placeholder="Nom client, code colis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs border border-natural-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 bg-natural-light text-natural-heading w-full sm:w-60"
              />
            </div>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto border border-natural-border rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-natural-light border-b border-natural-border">
                <th className="p-4 text-xs font-bold text-natural-heading uppercase tracking-wider">Client / Date</th>
                <th className="p-4 text-xs font-bold text-natural-heading uppercase tracking-wider">Code Colis</th>
                <th className="p-4 text-xs font-bold text-natural-heading uppercase tracking-wider">Transitaire</th>
                <th className="p-4 text-xs font-bold text-natural-heading uppercase tracking-wider">Poids</th>
                <th className="p-4 text-xs font-bold text-natural-heading uppercase tracking-wider">Montant Dû</th>
                <th className="p-4 text-xs font-bold text-natural-heading uppercase tracking-wider">Montant Payé</th>
                <th className="p-4 text-xs font-bold text-natural-heading uppercase tracking-wider">Reste à Payer</th>
                <th className="p-4 text-xs font-bold text-natural-heading uppercase tracking-wider">Retrait</th>
                <th className="p-4 text-xs font-bold text-natural-heading uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-natural-border/40">
              {filteredParts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-natural-primary font-medium">
                    Aucun enregistrement ne correspond à vos critères.
                  </td>
                </tr>
              ) : (
                filteredParts.map((item) => {
                  const isPayingThis = payingPartId === item.part.id && payingColisId === item.colisId;

                  return (
                    <tr
                      id={`row-payment-${item.part.id}`}
                      key={item.part.id}
                      className="hover:bg-natural-light/40 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-bold text-natural-heading">{item.part.nomClient}</div>
                        <div className="text-[10px] text-natural-primary font-bold font-mono">Reçu le : {item.colisDate}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold bg-natural-sidebar text-natural-heading px-2 py-0.5 rounded-lg border border-natural-border text-xs">
                          {item.colisCode}
                        </span>
                      </td>
                      <td className="p-4 text-natural-primary font-semibold">{item.transitaireNom}</td>
                      <td className="p-4 font-bold text-natural-heading font-mono">{item.part.poidsAttribue} kg</td>
                      <td className="p-4 font-mono font-bold text-natural-heading">
                        {item.part.montantDu.toLocaleString()} F
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 w-24">
                          <span className="font-mono text-natural-accent font-bold">
                            {item.part.montantPaye.toLocaleString()} F
                          </span>
                          <div className="w-full bg-natural-sidebar h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-natural-accent h-full"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-1 rounded-lg border ${
                            item.reste > 0 
                              ? "bg-red-50 text-red-600 border-red-100" 
                              : "bg-natural-sidebar text-natural-accent border-natural-border"
                          }`}
                        >
                          {item.reste.toLocaleString()} F
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          id={`toggle-retire-btn-${item.part.id}`}
                          onClick={() => onToggleRetrieval(item.colisId, item.part.id)}
                          className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                            item.part.estRetire
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          }`}
                          title={item.part.estRetire ? "Marquer comme non retiré" : "Marquer comme retiré"}
                        >
                          {item.part.estRetire ? (
                            <>
                              <PackageCheck className="w-3.5 h-3.5" />
                              Retiré
                            </>
                          ) : (
                            <>
                              <Package className="w-3.5 h-3.5" />
                              Non retiré
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        {isPayingThis ? (
                          <div className="flex items-center gap-1.5 justify-end" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col gap-1 items-end">
                              <input
                                id={`amount-input-${item.part.id}`}
                                type="number"
                                placeholder="Montant"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                className="w-24 px-2.5 py-1 text-xs border border-natural-accent rounded-lg focus:ring-2 focus:ring-natural-primary/20 focus:outline-hidden bg-white text-natural-heading font-bold"
                                autoFocus
                              />
                              {paymentError && (
                                <span className="text-[9px] text-red-500 font-semibold max-w-40 leading-tight">
                                  {paymentError}
                                </span>
                              )}
                            </div>
                            <button
                              id={`confirm-payment-${item.part.id}`}
                              onClick={() => handleSavePayment(item.colisId, item.part.id, item.reste)}
                              className="p-1.5 bg-natural-accent hover:bg-natural-accent-hover text-white rounded-lg transition-colors cursor-pointer"
                              title="Valider"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`cancel-payment-${item.part.id}`}
                              onClick={handleClosePayment}
                              className="px-2 py-1.5 text-[10px] text-natural-primary hover:text-natural-heading bg-natural-sidebar hover:bg-natural-border rounded-lg font-bold"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1.5">
                            {item.reste > 0 ? (
                              <button
                                id={`pay-btn-${item.part.id}`}
                                onClick={() => handleOpenPayment(item.colisId, item.part.id, item.reste)}
                                className="px-3 py-1.5 bg-natural-accent hover:bg-natural-accent-hover text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <ArrowUpRight className="w-3 h-3" />
                                Encaisser
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-natural-accent bg-natural-sidebar px-2.5 py-1 rounded-lg border border-natural-border">
                                Réglé
                              </span>
                            )}
                            {item.part.montantPaye > 0 && (
                              <button
                                id={`reset-btn-${item.part.id}`}
                                onClick={() => handleReset(item.colisId, item.part.id, item.part.nomClient)}
                                className="px-2 py-1 text-natural-primary hover:text-red-600 hover:bg-natural-sidebar text-[10px] rounded-lg transition-all font-bold cursor-pointer"
                                title="Réinitialiser"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
