/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Transitaire, Colis, PartColis } from "./types";
import { DEFAULT_TRANSITAIRES, DEFAULT_COLIS } from "./data/defaultData";

// Components
import StatsTab from "./components/StatsTab";
import TransitairesTab from "./components/TransitairesTab";
import RegisterColisTab from "./components/RegisterColisTab";
import PaiementsTab from "./components/PaiementsTab";
import RechercheTab from "./components/RechercheTab";
import SqlViewerTab from "./components/SqlViewerTab";
import Login from "./components/Login";
import Dock from "./components/Dock";

// Icons
import {
  LayoutDashboard,
  Users,
  PackagePlus,
  CreditCard,
  Search,
  Database,
  Menu,
  X,
  MapPin,
  Plane,
  Ship,
  TrendingUp,
  Scale,
  LogOut
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("stats");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Core database states
  const [transitaires, setTransitaires] = useState<Transitaire[]>([]);
  const [colisList, setColisList] = useState<Colis[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("abidjan_cargo_authenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }

    const savedTransitaires = localStorage.getItem("colis_abidjan_transitaires");
    const savedColis = localStorage.getItem("colis_abidjan_colis");

    let finalTrans: Transitaire[] = [];
    let finalColis: Colis[] = [];

    if (savedTransitaires) {
      try {
        const parsed = JSON.parse(savedTransitaires);
        finalTrans = parsed.filter((t: Transitaire) => t.id !== "t-1" && t.id !== "t-2");
      } catch (e) {
        console.error("Failed to parse saved transitaires", e);
      }
    }

    if (savedColis) {
      try {
        const parsed = JSON.parse(savedColis);
        finalColis = parsed.filter((c: Colis) => c.id !== "c-1" && c.id !== "c-2");
      } catch (e) {
        console.error("Failed to parse saved colis", e);
      }
    }

    setTransitaires(finalTrans);
    setColisList(finalColis);
    localStorage.setItem("colis_abidjan_transitaires", JSON.stringify(finalTrans));
    localStorage.setItem("colis_abidjan_colis", JSON.stringify(finalColis));
  }, []);

  // Save to local storage whenever states change
  const saveToLocalStorage = (newTrans: Transitaire[], newColis: Colis[]) => {
    localStorage.setItem("colis_abidjan_transitaires", JSON.stringify(newTrans));
    localStorage.setItem("colis_abidjan_colis", JSON.stringify(newColis));
  };

  // Add a Transitaire
  const handleAddTransitaire = (nom: string) => {
    const newT: Transitaire = {
      id: `t-${Date.now()}`,
      nom,
    };
    const updated = [...transitaires, newT];
    setTransitaires(updated);
    saveToLocalStorage(updated, colisList);
  };

  // Edit a Transitaire's Name
  const handleEditTransitaire = (id: string, nuevoNom: string) => {
    const updated = transitaires.map((t) => (t.id === id ? { ...t, nom: nuevoNom } : t));
    setTransitaires(updated);
    saveToLocalStorage(updated, colisList);
  };

  // Delete a Transitaire
  const handleDeleteTransitaire = (id: string) => {
    // Delete the transitaire
    const updatedTrans = transitaires.filter((t) => t.id !== id);
    setTransitaires(updatedTrans);

    // Delete all linked colis
    const updatedColis = colisList.filter((c) => c.transitaireId !== id);
    setColisList(updatedColis);

    saveToLocalStorage(updatedTrans, updatedColis);
  };

  // Register a new parcel
  const handleAddColis = (colisData: Omit<Colis, "id">) => {
    const newColis: Colis = {
      ...colisData,
      id: `colis-${Date.now()}`,
    };
    const updated = [newColis, ...colisList];
    setColisList(updated);
    saveToLocalStorage(transitaires, updated);
  };

  // Record a payment for a specific client part
  const handleRecordPayment = (colisId: string, partId: string, amount: number) => {
    const updatedColisList = colisList.map((c) => {
      if (c.id === colisId) {
        return {
          ...c,
          parts: c.parts.map((p) => {
            if (p.id === partId) {
              const newPaid = Math.min(p.montantDu, p.montantPaye + amount);
              return { ...p, montantPaye: newPaid };
            }
            return p;
          }),
        };
      }
      return c;
    });

    setColisList(updatedColisList);
    saveToLocalStorage(transitaires, updatedColisList);
  };

  // Reset payments for a specific client part
  const handleResetPayment = (colisId: string, partId: string) => {
    const updatedColisList = colisList.map((c) => {
      if (c.id === colisId) {
        return {
          ...c,
          parts: c.parts.map((p) => {
            if (p.id === partId) {
              return { ...p, montantPaye: 0 };
            }
            return p;
          }),
        };
      }
      return c;
    });

    setColisList(updatedColisList);
    saveToLocalStorage(transitaires, updatedColisList);
  };
  
  // Toggle retrieved status for a specific client part
  const handleToggleRetrieval = (colisId: string, partId: string) => {
    const updatedColisList = colisList.map((c) => {
      if (c.id === colisId) {
        return {
          ...c,
          parts: c.parts.map((p) => {
            if (p.id === partId) {
              return { ...p, estRetire: !p.estRetire };
            }
            return p;
          }),
        };
      }
      return c;
    });

    setColisList(updatedColisList);
    saveToLocalStorage(transitaires, updatedColisList);
  };

  // Import dynamic JSON backup
  const handleImportBackup = (importedTransitaires: Transitaire[], importedColisList: Colis[]) => {
    setTransitaires(importedTransitaires);
    setColisList(importedColisList);
    saveToLocalStorage(importedTransitaires, importedColisList);
  };

  const handleLogout = () => {
    localStorage.removeItem("abidjan_cargo_authenticated");
    localStorage.removeItem("abidjan_cargo_user_email");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const dockItems = [
    {
      id: "stats",
      icon: <LayoutDashboard size={20} />,
      label: "Tableau de Bord",
      onClick: () => {
        setActiveTab("stats");
        setIsSidebarOpen(false);
      }
    },
    {
      id: "enregistrer",
      icon: <PackagePlus size={20} />,
      label: "Enregistrer un Colis",
      onClick: () => {
        setActiveTab("enregistrer");
        setIsSidebarOpen(false);
      }
    },
    {
      id: "paiements",
      icon: <CreditCard size={20} />,
      label: "Règlements Clients",
      onClick: () => {
        setActiveTab("paiements");
        setIsSidebarOpen(false);
      }
    },
    {
      id: "recherche",
      icon: <Search size={20} />,
      label: "Recherche & Historique",
      onClick: () => {
        setActiveTab("recherche");
        setIsSidebarOpen(false);
      }
    },
    {
      id: "transitaires",
      icon: <Users size={20} />,
      label: "Gérer les Transitaires",
      onClick: () => {
        setActiveTab("transitaires");
        setIsSidebarOpen(false);
      }
    },
    {
      id: "logout",
      icon: <LogOut size={20} />,
      label: "Se déconnecter",
      onClick: () => {
        if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
          handleLogout();
        }
      },
      className: "text-red-600 border-red-200/50 hover:bg-red-500 hover:text-white hover:border-red-500"
    }
  ];

  return (
    <div 
      id="app-root" 
      className="min-h-screen bg-natural-bg flex flex-col md:flex-row antialiased bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "linear-gradient(rgba(249, 247, 242, 0.15), rgba(249, 247, 242, 0.15)), url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1920')"
      }}
    >
      
      {/* Sidebar for navigation */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-28 bg-natural-sidebar text-natural-text transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col border-r border-natural-border shadow-md`}
      >
        {/* Sidebar Header */}
        <div id="sidebar-header" className="p-4 border-b border-natural-border flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center">
            <h1 className="font-display font-black text-base tracking-widest text-natural-heading uppercase">
              SDW
            </h1>
            <p className="text-[8px] text-natural-primary font-mono font-bold uppercase tracking-widest mt-0.5">
              CARGO
            </p>
          </div>
          
          <button
            id="close-sidebar-btn"
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden mt-2 p-1 text-natural-text hover:text-natural-heading rounded-lg hover:bg-natural-border/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (Mac Dock Style) */}
        <div className="flex-1 flex flex-col justify-center items-center py-4 px-2">
          <Dock items={dockItems} activeTab={activeTab} />
        </div>

        {/* Sidebar Footer */}
        <div id="sidebar-footer" className="p-4 border-t border-natural-border bg-natural-sidebar flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-[9px] text-natural-primary font-bold">
            <MapPin className="w-3 h-3 text-natural-accent animate-bounce" />
            <span>ABJ</span>
          </div>
          <div className="text-[8px] text-natural-text/50 font-mono mt-1 text-center">v1.0</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col md:pl-28 min-w-0">
        
        {/* Top Navbar */}
        <header id="main-header" className="sticky top-0 z-40 bg-natural-light border-b border-natural-border px-8 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              id="open-sidebar-btn"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-natural-text hover:text-natural-heading hover:bg-natural-border/50 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div>
              <h2 className="text-2xl font-display font-bold tracking-tight text-natural-heading">
                {activeTab === "stats" && "Tableau de Bord & Statistiques"}
                {activeTab === "transitaires" && "Gestion des Transitaires"}
                {activeTab === "enregistrer" && "Enregistrement de Colis"}
                {activeTab === "paiements" && "Suivi des Règlements Clients"}
                {activeTab === "recherche" && "Moteur de Recherche de Colis"}
              </h2>
              <p className="text-xs text-natural-primary mt-0.5">
                {activeTab === "stats" && "Vue d'ensemble de l'activité d'importation"}
                {activeTab === "transitaires" && "Enregistrez et gérez vos prestataires logistiques"}
                {activeTab === "enregistrer" && "Saisie de colis simples ou partagés (mixte)"}
                {activeTab === "paiements" && "Suivi du chiffre d'affaires dû, encaissé et impayé"}
                {activeTab === "recherche" && "Historique des réceptions et recherche par client"}
              </p>
            </div>
          </div>

          {/* Quick status badge */}
          <div id="quick-status-badge" className="hidden sm:flex items-center gap-2 bg-[#F0EDE4] border border-[#E5E0D5] px-3.5 py-1.5 rounded-full text-xs font-semibold text-natural-text">
            <span className="w-2 h-2 rounded-full bg-natural-accent animate-pulse"></span>
            <span>Système Connecté (Local)</span>
          </div>
        </header>

        {/* Tab content space */}
        <div id="tab-content-wrapper" className="p-8 flex-1 overflow-y-auto">
          {activeTab === "stats" && (
            <StatsTab colisList={colisList} transitaires={transitaires} />
          )}

          {activeTab === "transitaires" && (
            <TransitairesTab
              transitaires={transitaires}
              colisList={colisList}
              onAddTransitaire={handleAddTransitaire}
              onEditTransitaire={handleEditTransitaire}
              onDeleteTransitaire={handleDeleteTransitaire}
            />
          )}

          {activeTab === "enregistrer" && (
            <RegisterColisTab
              transitaires={transitaires}
              colisList={colisList}
              onAddColis={handleAddColis}
            />
          )}

          {activeTab === "paiements" && (
            <PaiementsTab
              colisList={colisList}
              transitaires={transitaires}
              onRecordPayment={handleRecordPayment}
              onResetPayment={handleResetPayment}
              onToggleRetrieval={handleToggleRetrieval}
            />
          )}

          {activeTab === "recherche" && (
            <RechercheTab
              colisList={colisList}
              transitaires={transitaires}
              onRecordPayment={handleRecordPayment}
              onToggleRetrieval={handleToggleRetrieval}
            />
          )}
        </div>
      </main>

      {/* Background Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          id="mobile-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        ></div>
      )}
    </div>
  );
}
