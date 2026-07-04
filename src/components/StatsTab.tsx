import React, { useState } from "react";
import { Colis, Transitaire, PartColis } from "../types";
import { Scale, TrendingUp, AlertCircle, Sparkles, User, Calendar, Landmark, BookOpen, Clock, ChevronRight, Printer } from "lucide-react";

interface StatsTabProps {
  colisList: Colis[];
  transitaires: Transitaire[];
}

export default function StatsTab({ colisList, transitaires }: StatsTabProps) {
  // Client selection for "Vue par client"
  const [selectedClient, setSelectedClient] = useState("");
  const [dateFilterMode, setDateFilterMode] = useState<"all" | "today" | "period">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Get unique list of clients across all colis parts for the select/dropdown list
  const allClientsSet = new Set<string>();
  colisList.forEach((c) => {
    c.parts.forEach((p) => {
      if (p.nomClient.trim()) {
        allClientsSet.add(p.nomClient.trim());
      }
    });
  });
  const allClients = Array.from(allClientsSet).sort();

  // Filter colis by selected date period
  const getFilteredColisList = () => {
    return colisList.filter((colis) => {
      if (dateFilterMode === "today") {
        const todayStr = new Date().toISOString().split("T")[0];
        return colis.dateEnregistrement === todayStr;
      }
      if (dateFilterMode === "period") {
        if (startDate && colis.dateEnregistrement < startDate) return false;
        if (endDate && colis.dateEnregistrement > endDate) return false;
      }
      return true;
    });
  };

  const filteredColisList = getFilteredColisList();

  // Aggregate numbers
  const totalColisCount = filteredColisList.length;
  
  // Sum of total weight in kg
  const totalKilos = filteredColisList.reduce((sum, c) => sum + c.poidsTotal, 0);

  // Financial aggregation
  let totalDue = 0;
  let totalPaid = 0;
  
  filteredColisList.forEach((c) => {
    c.parts.forEach((p) => {
      totalDue += p.montantDu;
      totalPaid += p.montantPaye;
    });
  });

  const totalRemaining = totalDue - totalPaid;

  // Aggregate stats per Transitaire
  const transitaireStats = transitaires.map((t) => {
    const parcels = filteredColisList.filter((c) => c.transitaireId === t.id);
    const kilos = parcels.reduce((sum, c) => sum + c.poidsTotal, 0);
    
    let due = 0;
    let paid = 0;
    parcels.forEach((c) => {
      c.parts.forEach((p) => {
        due += p.montantDu;
        paid += p.montantPaye;
      });
    });

    return {
      id: t.id,
      nom: t.nom,
      count: parcels.length,
      kilos,
      due,
      paid,
      remaining: due - paid,
    };
  });

  // Client Details ("Vue par client")
  const getClientData = () => {
    if (!selectedClient) return null;

    // find all parts matching this client name
    const clientHistory: { colisCode: string; date: string; transitaire: string; type: string; part: PartColis }[] = [];
    
    colisList.forEach((c) => {
      const trans = transitaires.find((t) => t.id === c.transitaireId)?.nom || "Inconnu";
      c.parts.forEach((p) => {
        if (p.nomClient.toLowerCase().trim() === selectedClient.toLowerCase().trim()) {
          clientHistory.push({
            colisCode: c.code,
            date: c.dateEnregistrement,
            transitaire: trans,
            type: c.type,
            part: p,
          });
        }
      });
    });

    // Sort history by date descending
    clientHistory.sort((a, b) => b.date.localeCompare(a.date));

    const clientTotalKilos = clientHistory.reduce((sum, item) => sum + item.part.poidsAttribue, 0);
    const clientTotalDue = clientHistory.reduce((sum, item) => sum + item.part.montantDu, 0);
    const clientTotalPaid = clientHistory.reduce((sum, item) => sum + item.part.montantPaye, 0);
    const clientTotalRemaining = clientTotalDue - clientTotalPaid;

    return {
      name: selectedClient,
      history: clientHistory,
      totalKilos,
      totalDue: clientTotalDue,
      totalPaid: clientTotalPaid,
      totalRemaining: clientTotalRemaining,
    };
  };

  const clientData = getClientData();

  return (
    <div id="stats-tab-container" className="space-y-6">
      {/* SECTION IMPRIMABLE PDF (UNIQUEMENT LES ENTRÉES) */}
      <div className="hidden print:block print-container p-8 bg-white text-black text-xs font-sans">
        {/* En-tête */}
        <div className="flex justify-between items-center border-b-2 border-slate-950 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-950">Abidjan Cargo</h1>
            <p className="text-[10px] text-slate-500 font-mono font-bold">IMPORT-EXPORT LOGISTIQUE PRO</p>
            <p className="text-[9px] text-slate-400 font-medium">Abidjan, Côte d'Ivoire</p>
          </div>
          <div className="text-right">
            <h2 className="text-base font-extrabold text-slate-950">RAPPORT DES ENTRÉES DE COLIS</h2>
            <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
              Période : {dateFilterMode === "today" ? "Aujourd'hui" : dateFilterMode === "period" ? `Du ${startDate || '?'} au ${endDate || '?'}` : "Historique Global"}
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5">Généré le : {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
        </div>

        {/* Statistiques de la période */}
        <div className="grid grid-cols-4 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-extrabold block mb-0.5">Colis Enregistrés</span>
            <strong className="text-sm text-slate-900 font-extrabold">{totalColisCount} colis</strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-extrabold block mb-0.5">Poids Total Traité</span>
            <strong className="text-sm text-slate-900 font-extrabold">{totalKilos.toFixed(1)} kg</strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-extrabold block mb-0.5">Chiffre d'Affaires Dû</span>
            <strong className="text-sm text-slate-900 font-extrabold">{totalDue.toLocaleString()} F CFA</strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-extrabold block mb-0.5">Nombre de Clients</span>
            <strong className="text-sm text-slate-900 font-extrabold">
              {filteredColisList.reduce((sum, c) => sum + c.parts.length, 0)} clients
            </strong>
          </div>
        </div>

        {/* Tableau principal des entrées */}
        <h3 className="text-xs font-extrabold uppercase text-slate-950 mb-3 tracking-wider border-b border-slate-300 pb-1.5">Liste Détaillée des Entrées</h3>
        <table className="w-full text-left border-collapse border border-slate-300 mb-12">
          <thead>
            <tr className="bg-slate-100 text-[10px] font-bold text-slate-850 border-b border-slate-300">
              <th className="p-2.5 border border-slate-300">Date</th>
              <th className="p-2.5 border border-slate-300">Code Colis</th>
              <th className="p-2.5 border border-slate-300">Transitaire</th>
              <th className="p-2.5 border border-slate-300">Type</th>
              <th className="p-2.5 border border-slate-300">Poids (kg)</th>
              <th className="p-2.5 border border-slate-300">Clients & Parts d'Expédition</th>
              <th className="p-2.5 border border-slate-300 text-right">Montant Dû</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredColisList.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold text-xs">
                  Aucun colis enregistré pour cette période.
                </td>
              </tr>
            ) : (
              filteredColisList.map((colis) => (
                <tr key={colis.id} className="text-[10px]">
                  <td className="p-2.5 border border-slate-300 font-medium whitespace-nowrap">{colis.dateEnregistrement}</td>
                  <td className="p-2.5 border border-slate-300 font-bold font-mono">{colis.code}</td>
                  <td className="p-2.5 border border-slate-300 font-medium">{transitaires.find(t => t.id === colis.transitaireId)?.nom || 'Inconnu'}</td>
                  <td className="p-2.5 border border-slate-300 font-semibold">{colis.type}</td>
                  <td className="p-2.5 border border-slate-300 font-bold font-mono">{colis.poidsTotal} kg</td>
                  <td className="p-2.5 border border-slate-300">
                    <div className="space-y-1">
                      {colis.parts.map((p) => (
                        <div key={p.id} className="flex justify-between text-[9px] border-b border-slate-100 last:border-b-0 py-0.5">
                          <span className="font-semibold text-slate-800">{p.nomClient}</span>
                          <span className="text-slate-500 font-mono font-bold">({p.poidsAttribue} kg | {p.montantDu.toLocaleString()} F)</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-2.5 border border-slate-300 font-bold font-mono text-right whitespace-nowrap">
                    {colis.parts.reduce((sum, p) => sum + p.montantDu, 0).toLocaleString()} F
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Signatures */}
        <div className="mt-16 flex justify-between items-center text-center">
          <div className="w-56">
            <p className="text-[10px] font-bold text-slate-600 mb-14">Signature de l'Agent de Caisse</p>
            <div className="border-b border-slate-400 w-full"></div>
          </div>
          <div className="w-56">
            <p className="text-[10px] font-bold text-slate-600 mb-14">Direction de l'Agence Abidjan</p>
            <div className="border-b border-slate-400 w-full"></div>
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div id="stats-filter-card" className="bg-white rounded-3xl border border-natural-border shadow-xs p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-natural-heading">Période d'Analyse des Statistiques</h3>
          <p className="text-xs text-natural-primary">Sélectionnez la période pour filtrer les chiffres ci-dessous</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end w-full md:w-auto">
          {/* Period Selection Tabs */}
          <div className="inline-flex rounded-xl bg-natural-sidebar p-1 shrink-0">
            <button
              id="period-all-btn"
              onClick={() => setDateFilterMode("all")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                dateFilterMode === "all" ? "bg-white text-natural-heading shadow-xs" : "text-natural-text/70 hover:text-natural-heading"
              }`}
            >
              Historique Global
            </button>
            <button
              id="period-today-btn"
              onClick={() => setDateFilterMode("today")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                dateFilterMode === "today" ? "bg-white text-natural-heading shadow-xs" : "text-natural-text/70 hover:text-natural-heading"
              }`}
            >
              Aujourd'hui
            </button>
            <button
              id="period-custom-btn"
              onClick={() => setDateFilterMode("period")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                dateFilterMode === "period" ? "bg-white text-natural-heading shadow-xs" : "text-natural-text/70 hover:text-natural-heading"
              }`}
            >
              Période Personnalisée
            </button>
          </div>

          {/* Date Inputs for Custom Period */}
          {dateFilterMode === "period" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                id="stats-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 text-xs border border-natural-border rounded-xl bg-natural-light text-natural-text focus:outline-hidden focus:ring-2 focus:ring-natural-primary/30"
              />
              <span className="text-xs text-natural-primary">à</span>
              <input
                id="stats-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 text-xs border border-natural-border rounded-xl bg-natural-light text-natural-text focus:outline-hidden focus:ring-2 focus:ring-natural-primary/30"
              />
            </div>
          )}

          {/* Export PDF Button */}
          <button
            id="print-pdf-report-btn"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-natural-primary hover:bg-natural-accent hover:text-white border border-natural-border px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer text-natural-heading"
            title="Imprimer / Enregistrer en PDF le résumé des entrées"
          >
            <Printer className="w-4 h-4 text-natural-accent" />
            <span>Rapport PDF des Entrées ({filteredColisList.length})</span>
          </button>
        </div>
      </div>

      {/* Global Performance Cards */}
      <div id="stats-kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl border border-natural-border p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-natural-primary uppercase tracking-wider block mb-2">Colis du Jour</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-natural-heading">{totalColisCount}</span>
            <span className="text-xs text-natural-primary">colis</span>
          </div>
          <div className="w-full bg-natural-sidebar h-1 rounded-full mt-4"></div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-3xl border border-natural-border p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-natural-primary uppercase tracking-wider block mb-2">Poids Total Traité</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-natural-heading">{totalKilos.toFixed(1)}</span>
            <span className="text-sm font-normal text-natural-primary ml-1">kg</span>
          </div>
          <p className="text-[10px] text-natural-primary mt-2 font-medium">Moyenne : {totalColisCount > 0 ? (totalKilos / totalColisCount).toFixed(1) : 0} kg / colis</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl border border-natural-border p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-natural-primary uppercase tracking-wider block mb-2">Total Dû (CFA)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-natural-primary">
              {totalDue > 0 ? ((totalPaid / totalDue) * 100).toFixed(0) : 0}%
            </span>
            <span className="text-xs text-natural-primary font-medium">encaissé</span>
          </div>
          <div className="w-full bg-natural-sidebar h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-natural-accent h-full"
              style={{ width: `${totalDue > 0 ? (totalPaid / totalDue) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-3xl border border-natural-border p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block mb-2">Restant à Percevoir</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-[#D97706]">{totalRemaining.toLocaleString()}</span>
            <span className="text-[10px] text-[#D97706]/80 font-bold uppercase ml-1">CFA</span>
          </div>
          <p className="text-[10px] text-[#D97706]/70 mt-2 font-medium">Sur un total dû de {totalDue.toLocaleString()} F</p>
        </div>
      </div>

      {/* Grid: Left - Stats per Transitaire, Right - Client Lookup */}
      <div id="stats-split-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Transitaires Stats (8 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-natural-border shadow-sm p-6 flex flex-col">
          <h4 className="text-sm font-bold text-natural-heading mb-4 flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-natural-primary" />
            Statistiques par Transitaire
          </h4>

          <div className="space-y-4 flex-1">
            {transitaireStats.map((stat) => {
              const paymentPct = stat.due > 0 ? (stat.paid / stat.due) * 100 : 0;
              return (
                <div
                  id={`trans-stat-card-${stat.id}`}
                  key={stat.id}
                  className="p-4 rounded-2xl border border-natural-border hover:bg-natural-light/50 transition-all space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-natural-heading block">{stat.nom}</span>
                      <span className="text-xs text-natural-primary">
                        {stat.count} colis enregistré(s) • {stat.kilos.toFixed(1)} kg traités
                      </span>
                    </div>
                    <span className="text-xs font-bold bg-natural-sidebar text-natural-heading px-2.5 py-1 rounded-full font-mono">
                      {stat.kilos.toFixed(1)} kg
                    </span>
                  </div>

                  {/* Financial mini-bar per transitaire */}
                  <div className="pt-2 border-t border-natural-border grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-natural-primary block uppercase font-bold">Chiffre Dû</span>
                      <span className="font-bold text-natural-heading font-mono">{stat.due.toLocaleString()} F</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-natural-primary block uppercase font-bold">Montant Payé</span>
                      <span className="font-bold text-natural-accent font-mono">{stat.paid.toLocaleString()} F</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-natural-primary block uppercase font-bold">Reste</span>
                      <span className={`font-bold font-mono ${stat.remaining > 0 ? "text-[#D97706]" : "text-natural-accent"}`}>
                        {stat.remaining.toLocaleString()} F
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-natural-primary font-medium">
                      <span>Règlement :</span>
                      <span className="font-bold text-natural-heading">{paymentPct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-natural-sidebar h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-natural-accent h-full"
                        style={{ width: `${paymentPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Client Statement ("Vue par client") (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-natural-border shadow-sm p-6 flex flex-col">
          <h4 className="text-sm font-bold text-natural-heading mb-4 flex items-center gap-1.5">
            <User className="w-4 h-4 text-natural-primary" />
            Vue d'ensemble par Client
          </h4>

          {/* Client select dropdown */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold text-natural-primary mb-1.5">Sélectionner un client</label>
            <select
              id="client-lookup-select"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-natural-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-natural-primary/30 bg-natural-light text-natural-heading font-medium"
            >
              <option value="">-- Choisir un client dans la liste --</option>
              {allClients.map((clientName) => (
                <option key={clientName} value={clientName}>
                  {clientName}
                </option>
              ))}
            </select>
          </div>

          {/* Client Statement Details */}
          <div className="flex-1">
            {clientData ? (
              <div id="client-statement-view" className="space-y-4">
                <div className="p-4 bg-natural-light rounded-2xl border border-natural-border">
                  <span className="text-[10px] text-natural-primary block uppercase font-bold tracking-wider">Fiche de Compte</span>
                  <span className="text-base font-extrabold text-natural-heading block mt-0.5">{clientData.name}</span>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-natural-border text-xs">
                    <div>
                      <span className="text-[10px] text-natural-primary block font-medium">Kilos Totaux Reçus</span>
                      <strong className="text-sm text-natural-heading">{clientData.totalKilos.toFixed(1)} kg</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-natural-primary block font-medium">Nombre d'expéditions</span>
                      <strong className="text-sm text-natural-heading">{clientData.history.length} colis</strong>
                    </div>
                  </div>
                </div>

                {/* Financial Statement */}
                <div className="space-y-2">
                  <h5 className="text-[11px] font-bold text-natural-primary uppercase tracking-wider">Solde Financier</h5>
                  
                  <div className="p-4 bg-white border border-natural-border rounded-2xl space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-natural-primary font-medium">Montant total dû :</span>
                      <strong className="text-natural-heading font-mono">{clientData.totalDue.toLocaleString()} F</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-natural-primary font-medium">Montant payé :</span>
                      <strong className="text-natural-accent font-mono">{clientData.totalPaid.toLocaleString()} F</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-2.5 border-t border-natural-border">
                      <span className="font-bold text-natural-heading">Reste à payer :</span>
                      <strong className={`font-mono font-bold text-sm ${clientData.totalRemaining > 0 ? "text-[#D97706]" : "text-natural-accent"}`}>
                        {clientData.totalRemaining.toLocaleString()} F CFA
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Shipping History List */}
                <div className="space-y-2">
                  <h5 className="text-[11px] font-bold text-natural-primary uppercase tracking-wider">Historique des colis</h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {clientData.history.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-natural-light/60 hover:bg-natural-light border border-natural-border rounded-xl text-xs flex justify-between items-center"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold bg-natural-sidebar text-natural-heading px-1.5 py-0.2 text-[10px] rounded-sm">{item.colisCode}</span>
                            <span className="font-bold text-natural-heading">{item.transitaire}</span>
                          </div>
                          <span className="text-[10px] text-natural-primary mt-1 block">{item.date} • {item.part.poidsAttribue} kg</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-natural-heading block">{item.part.montantDu.toLocaleString()} F</span>
                          <span className={`text-[9px] font-bold ${item.part.montantDu - item.part.montantPaye > 0 ? "text-[#D97706]" : "text-natural-accent"}`}>
                            {item.part.montantDu - item.part.montantPaye > 0 ? "Impayé" : "Réglé"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div id="no-client-statement-view" className="text-center py-16 text-natural-primary flex flex-col items-center justify-center gap-3 border border-dashed border-natural-border rounded-2xl bg-natural-light/30">
                <User className="w-10 h-10 text-natural-border" />
                <p className="text-xs max-w-xs leading-relaxed text-natural-primary/80">
                  Sélectionnez un client ci-dessus pour afficher l'historique complet de ses expéditions, ses paiements, et son solde débiteur.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
