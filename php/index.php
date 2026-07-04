<!DOCTYPE html>
<html lang="fr" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suivi Colis Abidjan</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        natural: {
                            bg: "#fcfcf9",
                            sidebar: "#f4f4f0",
                            border: "#e7e7e2",
                            heading: "#1c1c1a",
                            text: "#43433e",
                            primary: "#646654",
                            light: "#fafaf8"
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace']
                    }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <!-- Lucide Icons CDN -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #fcfcf9;
        }
        .font-mono {
            font-family: 'JetBrains Mono', monospace;
        }
        @media print {
            body > :not(.print-container), aside, main, header, .no-print {
                display: none !important;
            }
            .print-container {
                display: block !important;
                visibility: visible !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background-color: white !important;
                color: black !important;
            }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
            20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
            animation: shake 0.5s ease-in-out;
        }
    </style>
</head>
<body class="h-full text-natural-text antialiased bg-natural-bg">

    <!-- LOGIN SCREEN -->
    <div id="login-wrapper" class="min-h-screen w-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative bg-cover bg-center bg-no-repeat overflow-hidden" style="background-image: url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1920')">
        <!-- Soft overlay -->
        <div class="absolute inset-0 bg-[#1A1817]/75 backdrop-blur-[2px] z-0"></div>

        <div class="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
            <!-- Brand/Logo -->
            <div class="flex flex-col items-center">
                <div class="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20 mb-3 overflow-hidden hover:scale-105 transition-all">
                    <img src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=150&h=150" alt="SDW Cargo Logo" class="w-full h-full object-cover">
                </div>
                <h2 class="text-center text-3xl font-extrabold tracking-tight text-white uppercase drop-shadow-md">
                    SDW CARGO
                </h2>
                <p class="mt-2 text-center text-xs font-mono font-bold text-amber-400 uppercase tracking-widest drop-shadow-sm">
                    Logistique Import-Export Pro
                </p>
            </div>

            <!-- Login Form Card -->
            <div id="login-card" class="mt-8 sm:mx-auto sm:w-full sm:max-w-md transition-all duration-300">
                <div class="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl border border-white/20 sm:px-10">
                    <div class="text-center mb-6">
                        <h3 class="text-lg font-extrabold text-[#2B2927]">Gestionnaire de Colis</h3>
                        <p class="text-xs text-[#5C564D] mt-1 font-semibold">Identifiez-vous pour accéder au système de suivi</p>
                    </div>

                    <!-- ERROR MESSAGE -->
                    <div id="login-error" class="hidden p-3.5 bg-red-50 border border-red-100 text-red-800 text-[11px] rounded-xl mb-4 flex items-start gap-2 font-bold animate-shake">
                        <i data-lucide="shield-alert" class="w-4 h-4 shrink-0 text-red-500 mt-0.5"></i>
                        <span id="login-error-text">Identifiants de base de données incorrects.</span>
                    </div>

                    <!-- SUCCESS MESSAGE -->
                    <div id="login-success" class="hidden p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] rounded-xl mb-4 flex items-center gap-2 font-bold">
                        <i data-lucide="check-circle-2" class="w-4.5 h-4.5 shrink-0 text-emerald-600"></i>
                        <span>Connexion réussie ! Chargement...</span>
                    </div>

                    <form id="login-form" onsubmit="handlePhpLogin(event)" class="space-y-5">
                        <div>
                            <label for="login-email" class="block text-xs font-extrabold text-[#5C564D] mb-1.5 uppercase tracking-wider">
                                Adresse Email
                            </label>
                            <div class="relative rounded-xl shadow-xs">
                                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <i data-lucide="mail" class="h-4 w-4 text-[#8C8475]"></i>
                                </div>
                                <input id="login-email" type="email" required placeholder="nom@exemple.com" class="block w-full pl-10 pr-3 py-2.5 border border-[#E5E2DA] rounded-xl text-xs bg-[#FAF9F6] text-[#2B2927] placeholder-[#8C8475] focus:outline-none focus:ring-2 focus:ring-[#646654] focus:border-transparent transition-all">
                            </div>
                        </div>

                        <div>
                            <label for="login-password" class="block text-xs font-extrabold text-[#5C564D] mb-1.5 uppercase tracking-wider">
                                Mot de passe
                            </label>
                            <div class="relative rounded-xl shadow-xs">
                                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <i data-lucide="lock" class="h-4 w-4 text-[#8C8475]"></i>
                                </div>
                                <input id="login-password" type="password" required placeholder="••••••••" class="block w-full pl-10 pr-10 py-2.5 border border-[#E5E2DA] rounded-xl text-xs bg-[#FAF9F6] text-[#2B2927] placeholder-[#8C8475] focus:outline-none focus:ring-2 focus:ring-[#646654] focus:border-transparent transition-all">
                                <button type="button" onclick="togglePhpPassword()" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C8475] hover:text-[#2B2927]">
                                    <i id="toggle-password-icon" data-lucide="eye" class="h-4 w-4"></i>
                                </button>
                            </div>
                        </div>

                        <div>
                            <button id="login-submit-btn" type="submit" class="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-xs font-bold text-white bg-[#646654] hover:bg-[#535546] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646654] shadow-md transition-all cursor-pointer">
                                <span id="login-btn-text">Se connecter</span>
                                <i data-lucide="log-in" class="w-4 h-4 text-white"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- MAIN APP LAYOUT (WRAPPER) -->
    <div id="app-wrapper" class="hidden min-h-screen w-full flex flex-col md:flex-row bg-cover bg-center bg-no-repeat bg-fixed" style="background-image: linear-gradient(rgba(249, 247, 242, 0.15), rgba(249, 247, 242, 0.15)), url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1920')">

    <!-- MOBILE HEADER -->
    <header class="md:hidden flex items-center justify-between px-6 py-4 bg-natural-sidebar border-b border-natural-border">
        <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-natural-primary flex items-center justify-center shadow-sm">
                <i data-lucide="plane" class="w-4.5 h-4.5 text-white"></i>
            </div>
            <div>
                <h1 class="text-xs font-black text-natural-heading tracking-wider uppercase">Abidjan Cargo</h1>
                <p class="text-[9px] text-natural-primary/80 font-mono tracking-tight">GÉRANCE INTERNE</p>
            </div>
        </div>
        <button id="toggle-mobile-menu" class="p-1.5 border border-natural-border rounded-lg bg-white text-natural-heading">
            <i data-lucide="menu" class="w-5 h-5"></i>
        </button>
    </header>

    <!-- SIDEBAR FOR NAVIGATION -->
    <aside id="sidebar" class="hidden md:flex flex-col w-64 bg-natural-sidebar border-r border-natural-border h-screen fixed md:sticky top-0 z-40 shrink-0">
        <!-- Logo Header -->
        <div class="p-6 border-b border-natural-border flex flex-col">
            <h1 class="font-sans font-black text-xl tracking-widest text-natural-heading uppercase">SDW CARGO</h1>
            <p class="text-[9px] text-natural-primary font-mono font-bold tracking-widest uppercase mt-0.5">Suivi Logistique</p>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <button onclick="switchTab('stats')" id="btn-tab-stats" class="tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all bg-natural-border text-natural-heading">
                <i data-lucide="layout-dashboard" class="w-4.5 h-4.5 text-natural-primary"></i>
                Tableau de Bord
            </button>
            <button onclick="switchTab('enregistrer')" id="btn-tab-enregistrer" class="tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all text-natural-text/80 hover:bg-natural-border/50 hover:text-natural-heading">
                <i data-lucide="package-plus" class="w-4.5 h-4.5 text-natural-primary"></i>
                Enregistrer un Colis
            </button>
            <button onclick="switchTab('paiements')" id="btn-tab-paiements" class="tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all text-natural-text/80 hover:bg-natural-border/50 hover:text-natural-heading">
                <i data-lucide="credit-card" class="w-4.5 h-4.5 text-natural-primary"></i>
                Règlements Clients
            </button>
            <button onclick="switchTab('recherche')" id="btn-tab-recherche" class="tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all text-natural-text/80 hover:bg-natural-border/50 hover:text-natural-heading">
                <i data-lucide="search" class="w-4.5 h-4.5 text-natural-primary"></i>
                Recherche & Historique
            </button>
            <button onclick="switchTab('transitaires')" id="btn-tab-transitaires" class="tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all text-natural-text/80 hover:bg-natural-border/50 hover:text-natural-heading">
                <i data-lucide="users" class="w-4.5 h-4.5 text-natural-primary"></i>
                Gérer les Transitaires
            </button>
            
            <button onclick="handlePhpLogout()" id="btn-logout" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer mt-4 border-t border-natural-border/30 pt-4">
                <i data-lucide="log-out" class="w-4.5 h-4.5 text-red-500"></i>
                Se déconnecter
            </button>
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-6 border-t border-natural-border bg-natural-light">
            <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                    <p class="text-[10px] font-bold text-natural-heading uppercase tracking-wide">Système Actif</p>
                    <p class="text-[9px] text-natural-text font-mono">Service Connecté</p>
                </div>
            </div>
        </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="flex-1 flex flex-col min-w-0">
        <!-- Main Top Bar -->
        <div class="hidden md:flex items-center justify-between px-8 py-5 border-b border-natural-border bg-white">
            <div>
                <h2 id="page-title" class="text-sm font-extrabold text-natural-heading tracking-tight uppercase">Tableau de Bord</h2>
                <p id="page-subtitle" class="text-[11px] text-natural-primary">Vue d'ensemble de l'activité d'importation</p>
            </div>
            <div class="flex items-center gap-3">
                <button id="php-print-btn" onclick="printDailyReport()" class="flex items-center gap-1.5 bg-white hover:bg-natural-sidebar text-natural-heading border border-natural-border px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all shadow-xs cursor-pointer">
                    <i data-lucide="printer" class="w-4 h-4 text-natural-accent"></i>
                    <span>Imprimer Rapport PDF des Entrées</span>
                </button>
                <div class="flex items-center gap-3 font-mono text-[11px] bg-natural-light border border-natural-border/80 px-4 py-2 rounded-xl text-natural-primary">
                    <span>LOCAL HOST</span>
                    <span class="text-natural-border">•</span>
                    <span>SERVICE ACTIF</span>
                </div>
            </div>
        </div>

        <!-- Scrollable content wrapper -->
        <div class="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-8">
            
            <!-- ALERTS CONTAINER (DYNAMIQUES) -->
            <div id="alert-container" class="hidden"></div>

            <!-- TAB: STATS / DASHBOARD -->
            <div id="tab-stats" class="tab-content space-y-6">
                <!-- KPI CARDS -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- CARD 1: CA DU -->
                    <div class="bg-white rounded-3xl border border-natural-border p-6 shadow-sm">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-natural-primary">Total Chiffre d'Affaires Dû</span>
                            <div class="p-2 bg-natural-light rounded-xl"><i data-lucide="trending-up" class="w-4 h-4 text-natural-primary"></i></div>
                        </div>
                        <h3 id="stat-ca-du" class="text-2xl font-black text-natural-heading tracking-tight mt-3">0 FCFA</h3>
                        <p class="text-[10px] text-natural-text/70 mt-1">Total facturé aux clients</p>
                    </div>
                    <!-- CARD 2: CA ENCAISSE -->
                    <div class="bg-emerald-50/40 rounded-3xl border border-emerald-100 p-6 shadow-sm">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-emerald-800">Total Encaissé</span>
                            <div class="p-2 bg-emerald-50 rounded-xl"><i data-lucide="credit-card" class="w-4 h-4 text-emerald-600"></i></div>
                        </div>
                        <h3 id="stat-ca-paye" class="text-2xl font-black text-emerald-900 tracking-tight mt-3">0 FCFA</h3>
                        <p class="text-[10px] text-emerald-800/75 mt-1">Montant sécurisé et réglé</p>
                    </div>
                    <!-- CARD 3: CA IMPAYE -->
                    <div class="bg-amber-50/40 rounded-3xl border border-amber-100 p-6 shadow-sm">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-amber-800">Reste à Recouvrer</span>
                            <div class="p-2 bg-amber-50 rounded-xl"><i data-lucide="clock" class="w-4 h-4 text-amber-600"></i></div>
                        </div>
                        <h3 id="stat-ca-impaye" class="text-2xl font-black text-amber-900 tracking-tight mt-3">0 FCFA</h3>
                        <p class="text-[10px] text-amber-800/75 mt-1">Montant restant à payer</p>
                    </div>
                </div>

                <!-- AUXILIARY STATS -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white rounded-3xl border border-natural-border p-6 shadow-sm space-y-4">
                        <h4 class="text-xs font-bold text-natural-heading uppercase tracking-wider flex items-center gap-1.5">
                            <i data-lucide="package" class="w-4 h-4 text-natural-primary"></i>
                            Activité des Colis
                        </h4>
                        <div class="grid grid-cols-2 gap-4 pt-2">
                            <div class="bg-natural-light p-4 rounded-2xl border border-natural-border/50">
                                <span class="text-[10px] font-bold text-natural-primary">Colis Enregistrés</span>
                                <p id="stat-total-colis" class="text-xl font-bold text-natural-heading mt-1">0</p>
                            </div>
                            <div class="bg-natural-light p-4 rounded-2xl border border-natural-border/50">
                                <span class="text-[10px] font-bold text-natural-primary">Poids Cumulé</span>
                                <p id="stat-total-poids" class="text-xl font-bold text-natural-heading mt-1">0.0 kg</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-3xl border border-natural-border p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <h4 class="text-xs font-bold text-natural-heading uppercase tracking-wider flex items-center gap-1.5 mb-3">
                                <i data-lucide="users" class="w-4 h-4 text-natural-primary"></i>
                                Répartition par Transitaire
                            </h4>
                            <div id="transitaires-list-stats" class="space-y-2 max-h-32 overflow-y-auto">
                                <p class="text-xs text-natural-text/60 italic">Aucun colis enregistré pour le moment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB: ENREGISTRER UN COLIS -->
            <div id="tab-enregistrer" class="tab-content hidden space-y-6">
                <div class="bg-white rounded-3xl border border-natural-border shadow-sm p-6 max-w-2xl mx-auto">
                    <h3 class="text-sm font-extrabold text-natural-heading uppercase tracking-wider mb-6 flex items-center gap-2">
                        <i data-lucide="package-plus" class="w-5 h-5 text-natural-primary"></i>
                        Fiche d'Enregistrement de Colis
                    </h3>

                    <form id="colis-form" onsubmit="submitColisForm(event)" class="space-y-6">
                        <!-- Type Selection -->
                        <div>
                            <label class="block text-xs font-bold text-natural-heading mb-2">Type d'Envoi</label>
                            <div class="grid grid-cols-2 gap-3">
                                <label class="border-2 border-natural-primary bg-natural-light/50 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all" id="type-simple-label">
                                    <input type="radio" name="colis_type" value="Simple" checked class="hidden" onchange="toggleColisType('Simple')">
                                    <span class="text-xs font-bold text-natural-heading">Colis Simple</span>
                                </label>
                                <label class="border border-natural-border hover:border-natural-border/80 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all" id="type-mixte-label">
                                    <input type="radio" name="colis_type" value="Mixte" class="hidden" onchange="toggleColisType('Mixte')">
                                    <span class="text-xs font-bold text-natural-heading">Colis Mixte (Partagé)</span>
                                </label>
                            </div>
                        </div>

                        <!-- Info du Colis -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-natural-heading mb-1">Code du Colis</label>
                                <input type="text" id="colis-code" required placeholder="Ex: 115" class="w-full px-3 py-2 text-xs border border-natural-border rounded-xl font-mono font-bold">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-natural-heading mb-1">Transitaire</label>
                                <select id="colis-transitaire" required class="w-full px-3 py-2 text-xs border border-natural-border rounded-xl">
                                    <option value="">-- Choisir --</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-natural-heading mb-1">Date Réception</label>
                                <input type="date" id="colis-date" required class="w-full px-3 py-2 text-xs border border-natural-border rounded-xl">
                            </div>
                        </div>

                        <!-- Poids Total -->
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-xs font-bold text-natural-heading">Poids Total du Colis (kg)</label>
                                <span id="weight-indicator" class="text-xs font-mono font-bold text-natural-primary">0.00 kg</span>
                            </div>
                            <input type="number" id="colis-poids" step="0.01" min="0.1" required oninput="updateWeightIndicator()" class="w-full px-3 py-2 text-xs border border-natural-border rounded-xl">
                        </div>

                        <!-- Parts Clients (Dynamique) -->
                        <div class="border-t border-natural-border pt-4">
                            <div class="flex justify-between items-center mb-3">
                                <h4 class="text-xs font-bold text-natural-heading uppercase tracking-wide">Attribution des Parts Clients</h4>
                                <button type="button" id="add-part-btn" onclick="addClientPartRow()" class="hidden text-[10px] font-bold text-natural-primary border border-natural-border px-2.5 py-1 rounded-lg hover:bg-natural-light flex items-center gap-1">
                                    <i data-lucide="plus" class="w-3.5 h-3.5"></i> Ajouter un client
                                </button>
                            </div>

                            <div id="parts-container" class="space-y-3">
                                <!-- Ligne de part injectée ici par JS -->
                            </div>
                            <datalist id="clients-list"></datalist>
                        </div>

                        <!-- Soumission -->
                        <button type="submit" class="w-full py-3 px-4 bg-natural-primary hover:bg-natural-primary/95 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                            <i data-lucide="save" class="w-4 h-4"></i>
                            Enregistrer le Colis
                        </button>
                    </form>
                </div>
            </div>

            <!-- TAB: RÈGLEMENTS CLIENTS -->
            <div id="tab-paiements" class="tab-content hidden space-y-6">
                <div class="bg-white rounded-3xl border border-natural-border shadow-sm p-6">
                    <h3 class="text-sm font-extrabold text-natural-heading uppercase tracking-wider mb-2 flex items-center gap-2">
                        <i data-lucide="credit-card" class="w-5 h-5 text-natural-primary"></i>
                        Suivi et Enregistrement des Règlements Clients
                    </h3>
                    <p class="text-xs text-natural-primary mb-6">Saisissez les versements de vos clients pour ajuster leur reste à payer.</p>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr class="border-b border-natural-border text-natural-primary font-bold bg-natural-light">
                                    <th class="p-3">Client</th>
                                    <th class="p-3">Colis (Code)</th>
                                    <th class="p-3">Part Poids</th>
                                    <th class="p-3 text-right">Montant Dû</th>
                                    <th class="p-3 text-right">Montant Payé</th>
                                    <th class="p-3 text-right text-amber-800">Reste à Payer</th>
                                    <th class="p-3 text-center">Retrait</th>
                                    <th class="p-3 text-center">Saisir un Règlement</th>
                                </tr>
                            </thead>
                            <tbody id="paiements-table-body">
                                <!-- Injecté par JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- TAB: RECHERCHE & HISTORIQUE -->
            <div id="tab-recherche" class="tab-content hidden space-y-6">
                <!-- Filtres -->
                <div class="bg-white rounded-3xl border border-natural-border shadow-sm p-6">
                    <h3 class="text-sm font-extrabold text-natural-heading uppercase tracking-wider mb-4 flex items-center gap-2">
                        <i data-lucide="search" class="w-5 h-5 text-natural-primary"></i>
                        Filtres de Recherche & Historique
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-[11px] font-bold text-natural-heading mb-1">Code du Colis</label>
                            <input type="text" id="filter-code" oninput="applyFilters()" placeholder="Ex: 115" class="w-full px-3 py-2 text-xs border border-natural-border rounded-xl">
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-natural-heading mb-1">Nom du Client</label>
                            <input type="text" id="filter-client" oninput="applyFilters()" placeholder="Ex: Mamadou" class="w-full px-3 py-2 text-xs border border-natural-border rounded-xl">
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-natural-heading mb-1">Transitaire</label>
                            <select id="filter-transitaire" onchange="applyFilters()" class="w-full px-3 py-2 text-xs border border-natural-border rounded-xl">
                                <option value="">Tous les transitaires</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-natural-heading mb-1">Date</label>
                            <input type="date" id="filter-date" onchange="applyFilters()" class="w-full px-3 py-2 text-xs border border-natural-border rounded-xl">
                        </div>
                    </div>
                </div>

                <!-- Résultats -->
                <div id="recherche-results" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Injecté par JS -->
                </div>
            </div>

            <!-- TAB: GÉRER LES TRANSITAIRES -->
            <div id="tab-transitaires" class="tab-content hidden space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Column 1: Ajouter Transitaire & Vider l'application -->
                    <div class="space-y-6 md:col-span-1">
                        <!-- Ajouter Transitaire Form -->
                        <div class="bg-white rounded-3xl border border-natural-border p-6 shadow-sm h-fit">
                            <h4 class="text-xs font-bold text-natural-heading uppercase tracking-wider mb-4">Ajouter un Transitaire</h4>
                            <form id="transitaire-form" onsubmit="submitTransitaireForm(event)" class="space-y-4">
                                <div>
                                    <label class="block text-[11px] font-bold text-natural-heading mb-1">Nom du Transitaire</label>
                                    <input type="text" id="transitaire-name" required placeholder="Ex: CI Transit Express" class="w-full px-3 py-2 text-xs border border-natural-border rounded-xl">
                                </div>
                                <button type="submit" class="w-full py-2 px-4 bg-natural-primary hover:bg-natural-primary/95 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                                    Ajouter le Transitaire
                                </button>
                            </form>
                        </div>

                        <!-- Réinitialisation de l'application -->
                        <div class="bg-red-50/50 rounded-3xl border border-red-100 p-6 shadow-sm h-fit space-y-3">
                            <h4 class="text-xs font-extrabold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                                <i data-lucide="trash-2" class="w-4 h-4 text-red-600"></i>
                                Vider l'application
                            </h4>
                            <p class="text-[11px] text-red-800 leading-relaxed font-semibold">
                                Cette action supprimera définitivement tous les colis enregistrés ainsi que tous les transitaires sans supprimer la structure des tables.
                            </p>
                            <button onclick="clearAllApplicationData()" class="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer">
                                Réinitialiser toutes les données
                            </button>
                        </div>
                    </div>

                    <!-- Liste des Transitaires -->
                    <div class="md:col-span-2 bg-white rounded-3xl border border-natural-border p-6 shadow-sm">
                        <h4 class="text-xs font-bold text-natural-heading uppercase tracking-wider mb-4">Transitaires Partenaires</h4>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs">
                                <thead>
                                    <tr class="border-b border-natural-border font-bold text-natural-primary">
                                        <th class="py-2.5">Nom</th>
                                        <th class="py-2.5 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="transitaires-table-body">
                                    <!-- Injecté par JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <!-- JS LOGIC CONNECTED TO API.PHP -->
    <script>
        // State
        let transitaires = [];
        let colisList = [];
        let activeTab = 'stats';

        // Toggle mobile menu
        document.getElementById('toggle-mobile-menu').addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('hidden');
        });

        // Switch Tabs
        function switchTab(tabId) {
            activeTab = tabId;
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.getElementById(`tab-${tabId}`).classList.remove('hidden');

            // Update sidebar button classes
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.className = "tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all text-natural-text/80 hover:bg-natural-border/50 hover:text-natural-heading";
            });
            const activeBtn = document.getElementById(`btn-tab-${tabId}`);
            if (activeBtn) {
                activeBtn.className = "tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all bg-natural-border text-natural-heading";
            }

            // Update page titles
            const titleMap = {
                'stats': { title: "Tableau de Bord", subtitle: "Vue d'ensemble de l'activité d'importation" },
                'enregistrer': { title: "Enregistrer un Colis", subtitle: "Saisie de colis simples ou partagés (mixte)" },
                'paiements': { title: "Suivi des Règlements Clients", subtitle: "Saisie des versements et ajustement du solde débiteur" },
                'recherche': { title: "Recherche & Historique", subtitle: "Consulter l'historique et filtrer par code ou par client" },
                'transitaires': { title: "Gestion des Transitaires", subtitle: "Gérez vos partenaires logistiques" }
            };
            
            document.getElementById('page-title').innerText = titleMap[tabId].title.toUpperCase();
            document.getElementById('page-subtitle').innerText = titleMap[tabId].subtitle;

            // Close mobile sidebar on navigation
            if (window.innerWidth < 768) {
                document.getElementById('sidebar').classList.add('hidden');
            }

            // Refresh view
            renderView();
        }

        // Fetch Data from api.php
        async function loadData() {
            try {
                const response = await fetch('api.php?action=get_data');
                const result = await response.json();
                
                if (result.success) {
                    transitaires = result.transitaires || [];
                    colisList = (result.colisList || []).sort((a, b) => b.dateEnregistrement.localeCompare(a.dateEnregistrement));
                    renderView();
                } else if (result.error) {
                    showAlert(result.error + "<br><small>" + (result.details || "") + "</small><br><strong>" + (result.suggestion || "") + "</strong>", "error");
                }
            } catch (err) {
                showAlert("Erreur réseau: impossible de joindre api.php. Assurez-vous que votre serveur PHP tourne bien.", "error");
            }
        }

        // Show Alert Banner
        function showAlert(msg, type = "success") {
            const alertBox = document.getElementById('alert-container');
            alertBox.classList.remove('hidden');
            alertBox.className = `p-4 rounded-2xl text-xs font-bold border ${
                type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`;
            alertBox.innerHTML = msg;
            
            setTimeout(() => {
                alertBox.classList.add('hidden');
            }, 8000);
        }

        // RENDER CENTRAL VIEW BASED ON STATE
        function renderView() {
            // Update Select boxes for transitaires
            const selects = ['colis-transitaire', 'filter-transitaire'];
            selects.forEach(sid => {
                const el = document.getElementById(sid);
                if (el) {
                    const savedValue = el.value;
                    el.innerHTML = sid === 'filter-transitaire' ? '<option value="">Tous les transitaires</option>' : '<option value="">-- Choisir --</option>';
                    transitaires.forEach(t => {
                        el.innerHTML += `<option value="${t.id}">${t.nom}</option>`;
                    });
                    el.value = savedValue;
                }
            });

            // Update clients autocomplete datalist
            const clientListDatalist = document.getElementById('clients-list');
            if (clientListDatalist) {
                const clientNamesSet = new Set();
                colisList.forEach(c => {
                    c.parts.forEach(p => {
                        if (p.nomClient && p.nomClient.trim()) {
                            clientNamesSet.add(p.nomClient.trim());
                        }
                    });
                });
                clientListDatalist.innerHTML = "";
                Array.from(clientNamesSet).sort().forEach(name => {
                    const opt = document.createElement('option');
                    opt.value = name;
                    clientListDatalist.appendChild(opt);
                });
            }

            // 1. STATS TAB
            let totalCaDu = 0;
            let totalCaPaye = 0;
            let totalPoids = 0;
            let totalColis = colisList.length;

            let weightByTransitaire = {};
            transitaires.forEach(t => { weightByTransitaire[t.id] = { nom: t.nom, poids: 0 }; });

            colisList.forEach(c => {
                totalPoids += c.poidsTotal;
                if (weightByTransitaire[c.transitaireId]) {
                    weightByTransitaire[c.transitaireId].poids += c.poidsTotal;
                }
                c.parts.forEach(p => {
                    totalCaDu += p.montantDu;
                    totalCaPaye += p.montantPaye;
                });
            });

            const totalCaImpaye = totalCaDu - totalCaPaye;

            document.getElementById('stat-ca-du').innerText = totalCaDu.toLocaleString() + " FCFA";
            document.getElementById('stat-ca-paye').innerText = totalCaPaye.toLocaleString() + " FCFA";
            document.getElementById('stat-ca-impaye').innerText = totalCaImpaye.toLocaleString() + " FCFA";
            document.getElementById('stat-total-colis').innerText = totalColis;
            document.getElementById('stat-total-poids').innerText = totalPoids.toFixed(2) + " kg";

            // Transitaire list on Stats Card
            const transListDiv = document.getElementById('transitaires-list-stats');
            let transStatsHtml = "";
            let hasActiveTransStats = false;
            
            Object.values(weightByTransitaire).forEach(data => {
                if (data.poids > 0) {
                    hasActiveTransStats = true;
                    const percent = Math.min(100, (data.poids / (totalPoids || 1)) * 100);
                    transStatsHtml += `
                        <div class="space-y-1">
                            <div class="flex justify-between text-[11px] font-bold">
                                <span>${data.nom}</span>
                                <span class="font-mono text-natural-primary">${data.poids.toFixed(1)} kg (${percent.toFixed(0)}%)</span>
                            </div>
                            <div class="w-full bg-natural-border h-1.5 rounded-full overflow-hidden">
                                <div class="bg-natural-primary h-full" style="width: ${percent}%"></div>
                            </div>
                        </div>
                    `;
                }
            });
            transListDiv.innerHTML = hasActiveTransStats ? transStatsHtml : '<p class="text-xs text-natural-text/60 italic">Aucune donnée de transit enregistrée.</p>';

            // 2. ENREGISTRER TAB - INJECT CODES IF NEEDED
            if (activeTab === 'enregistrer') {
                updateColisFormState();
            }

            // 3. PAIEMENTS TAB
            const payBody = document.getElementById('paiements-table-body');
            let payHtml = "";
            let countParts = 0;

            colisList.forEach(c => {
                c.parts.forEach(p => {
                    countParts++;
                    const rest = p.montantDu - p.montantPaye;
                    payHtml += `
                        <tr class="border-b border-natural-border hover:bg-natural-light/60">
                            <td class="p-3 font-semibold text-natural-heading">${p.nomClient}</td>
                            <td class="p-3 font-mono font-bold text-natural-primary">${c.code}</td>
                            <td class="p-3 font-mono">${p.poidsAttribue} kg</td>
                            <td class="p-3 text-right font-mono font-bold">${p.montantDu.toLocaleString()} FCFA</td>
                            <td class="p-3 text-right font-mono text-emerald-700">${p.montantPaye.toLocaleString()} FCFA</td>
                            <td class="p-3 text-right font-mono font-black text-amber-800">${rest.toLocaleString()} FCFA</td>
                            <td class="p-3 text-center">
                                <button onclick="toggleRetrieval(${c.id}, ${p.id}, ${p.estRetire ? 1 : 0})" 
                                        class="px-2 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer inline-flex items-center gap-1 ${
                                            p.estRetire 
                                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                        }">
                                    <i data-lucide="${p.estRetire ? 'package-check' : 'package'}" class="w-3.5 h-3.5"></i>
                                    ${p.estRetire ? 'Retiré' : 'Non retiré'}
                                </button>
                            </td>
                            <td class="p-3 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    ${rest > 0 ? `
                                        <input type="number" id="pay-input-${p.id}" placeholder="Montant" class="w-20 px-2 py-1 border border-natural-border rounded-lg text-xs font-mono text-right">
                                        <button onclick="recordPayment(${c.id}, ${p.id})" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer text-[10px]">
                                            Payer
                                        </button>
                                    ` : `
                                        <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Réglé</span>
                                    `}
                                    ${p.montantPaye > 0 ? `
                                        <button onclick="resetPayment(${c.id}, ${p.id})" class="text-[10px] text-red-500 hover:text-red-700 font-bold ml-1" title="Réinitialiser à zéro">
                                            Vider
                                        </button>
                                    ` : ''}
                                </div>
                            </td>
                        </tr>
                    `;
                });
            });

            payBody.innerHTML = countParts > 0 ? payHtml : '<tr><td colspan="8" class="p-6 text-center text-natural-text/50 italic">Aucune part client en attente de règlement.</td></tr>';

            // 4. RECHÈRCHE & HISTORIQUE TAB
            applyFilters();

            // 5. TRANSITAIRES TAB
            const transBody = document.getElementById('transitaires-table-body');
            let transHtml = "";
            transitaires.forEach(t => {
                transHtml += `
                    <tr class="border-b border-natural-border">
                        <td class="py-3 font-bold text-natural-heading text-xs">${t.nom}</td>
                        <td class="py-3 text-center">
                            <button onclick="deleteTransitaire(${t.id})" class="p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            transBody.innerHTML = transitaires.length > 0 ? transHtml : '<tr><td colspan="2" class="p-4 text-center text-natural-text/50 italic">Aucun transitaire enregistré.</td></tr>';

            // Refresh icons dynamically
            lucide.createIcons();
        }

        // Toggle Colis type
        let currentType = 'Simple';
        function toggleColisType(type) {
            currentType = type;
            const simpleLabel = document.getElementById('type-simple-label');
            const mixteLabel = document.getElementById('type-mixte-label');
            const addBtn = document.getElementById('add-part-btn');

            if (type === 'Simple') {
                simpleLabel.className = "border-2 border-natural-primary bg-natural-light/50 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all";
                mixteLabel.className = "border border-natural-border hover:border-natural-border/80 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all";
                addBtn.classList.add('hidden');
            } else {
                mixteLabel.className = "border-2 border-natural-primary bg-natural-light/50 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all";
                simpleLabel.className = "border border-natural-border hover:border-natural-border/80 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all";
                addBtn.classList.remove('hidden');
            }

            updateColisFormState();
        }

        // Render input parts rows dynamically
        function updateColisFormState() {
            const container = document.getElementById('parts-container');
            const totalWeight = parseFloat(document.getElementById('colis-poids').value) || 0;

            if (currentType === 'Simple') {
                // One single row that matches weight
                container.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 bg-natural-light p-4 rounded-2xl border border-natural-border/60">
                        <div>
                            <label class="block text-[10px] font-bold text-natural-primary mb-1">Nom du Client</label>
                            <input type="text" id="part-client-0" list="clients-list" required placeholder="Ex: Mamadou Koné" class="w-full px-2.5 py-2 text-xs border border-natural-border rounded-lg bg-white">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-natural-primary mb-1">Poids Attribué (kg)</label>
                            <input type="number" id="part-weight-0" readonly value="${totalWeight}" class="w-full px-2.5 py-2 text-xs border border-natural-border rounded-lg bg-natural-sidebar font-mono font-semibold">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-natural-primary mb-1">Montant Dû (FCFA)</label>
                            <input type="number" id="part-money-0" required placeholder="Ex: 45000" class="w-full px-2.5 py-2 text-xs border border-natural-border rounded-lg bg-white">
                        </div>
                    </div>
                `;
            } else {
                // Mixte : Let user add multiple rows. Ensure we have at least one to start.
                if (container.children.length === 0 || container.querySelector('#part-weight-0') && container.querySelector('#part-weight-0').readOnly) {
                    container.innerHTML = "";
                    addClientPartRow();
                    addClientPartRow();
                }
            }
        }

        function updateWeightIndicator() {
            const weight = parseFloat(document.getElementById('colis-poids').value) || 0;
            const ind = document.getElementById('weight-indicator');
            ind.innerText = `${weight.toFixed(2)} kg`;
            
            if (currentType === 'Simple') {
                const singleWeight = document.getElementById('part-weight-0');
                if (singleWeight) {
                    singleWeight.value = weight;
                }
            }
        }

        function addClientPartRow() {
            const container = document.getElementById('parts-container');
            const index = container.children.length;
            
            const row = document.createElement('div');
            row.id = `part-row-${index}`;
            row.className = "grid grid-cols-1 md:grid-cols-4 gap-3 bg-natural-light p-4 rounded-2xl border border-natural-border/60 relative";
            row.innerHTML = `
                <div>
                    <label class="block text-[10px] font-bold text-natural-primary mb-1">Nom du Client</label>
                    <input type="text" class="part-client-name w-full px-2.5 py-2 text-xs border border-natural-border rounded-lg bg-white" list="clients-list" required placeholder="Ex: Koffi Yao">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-natural-primary mb-1">Poids (kg)</label>
                    <input type="number" step="0.01" class="part-client-weight w-full px-2.5 py-2 text-xs border border-natural-border rounded-lg bg-white" required placeholder="Ex: 10.5">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-natural-primary mb-1">Montant Dû (FCFA)</label>
                    <input type="number" class="part-client-money w-full px-2.5 py-2 text-xs border border-natural-border rounded-lg bg-white" required placeholder="Ex: 30000">
                </div>
                <div class="flex items-end justify-center">
                    <button type="button" onclick="removeClientPartRow(${index})" class="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg text-[11px] font-bold transition-colors">
                        Retirer
                    </button>
                </div>
            `;
            container.appendChild(row);
            lucide.createIcons();
        }

        function removeClientPartRow(idx) {
            const row = document.getElementById(`part-row-${idx}`);
            if (row) {
                row.remove();
            }
        }

        // SUBMIT NEW PARCEL (COLIS)
        async function submitColisForm(e) {
            e.preventDefault();

            const code = document.getElementById('colis-code').value.trim();
            const transitaireId = document.getElementById('colis-transitaire').value;
            const date = document.getElementById('colis-date').value;
            const poidsTotal = parseFloat(document.getElementById('colis-poids').value) || 0;

            let parts = [];

            if (currentType === 'Simple') {
                const client = document.getElementById('part-client-0').value.trim();
                const money = parseFloat(document.getElementById('part-money-0').value) || 0;
                
                parts.push({
                    nomClient: client,
                    poidsAttribue: poidsTotal,
                    montantDu: money,
                    montantPaye: 0
                });
            } else {
                const rows = document.getElementById('parts-container').children;
                let sumWeight = 0;

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    const client = row.querySelector('.part-client-name').value.trim();
                    const weight = parseFloat(row.querySelector('.part-client-weight').value) || 0;
                    const money = parseFloat(row.querySelector('.part-client-money').value) || 0;

                    sumWeight += weight;
                    parts.push({
                        nomClient: client,
                        poidsAttribue: weight,
                        montantDu: money,
                        montantPaye: 0
                    });
                }

                // Vérifier la somme des poids
                if (Math.abs(sumWeight - poidsTotal) > 0.01) {
                    showAlert(`⚠️ La somme des poids attribués (${sumWeight.toFixed(2)} kg) doit correspondre exactement au poids total du colis (${poidsTotal.toFixed(2)} kg) !`, "error");
                    return;
                }
            }

            const bodyData = {
                code: code,
                transitaireId: transitaireId,
                dateEnregistrement: date,
                poidsTotal: poidsTotal,
                type: currentType,
                parts: parts
            };

            try {
                const response = await fetch('api.php?action=add_colis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyData)
                });
                const res = await response.json();

                if (res.success) {
                    showAlert("🎉 Colis enregistré avec succès !");
                    document.getElementById('colis-form').reset();
                    document.getElementById('parts-container').innerHTML = "";
                    currentType = 'Simple';
                    toggleColisType('Simple');
                    loadData();
                    switchTab('stats');
                } else {
                    showAlert(res.error || "Une erreur s'est produite", "error");
                }
            } catch (err) {
                showAlert("Erreur réseau: impossible d'enregistrer le colis.", "error");
            }
        }

        // RECORD PAYMENT FOR CLIENT PART
        async function recordPayment(colisId, partId) {
            const input = document.getElementById(`pay-input-${partId}`);
            const amount = parseFloat(input.value) || 0;

            if (amount <= 0) {
                showAlert("Veuillez saisir un montant valide supérieur à 0.", "error");
                return;
            }

            try {
                const response = await fetch('api.php?action=record_payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ partId, amount })
                });
                const res = await response.json();

                if (res.success) {
                    showAlert("Règlement enregistré avec succès !");
                    loadData();
                } else {
                    showAlert(res.error || "Une erreur s'est produite", "error");
                }
            } catch (err) {
                showAlert("Erreur réseau: impossible de saisir le règlement.", "error");
            }
        }

        // RESET PAYMENT
        async function resetPayment(colisId, partId) {
            if (!confirm("Voulez-vous vraiment remettre le montant payé à 0 pour ce client ?")) {
                return;
            }

            try {
                const response = await fetch('api.php?action=reset_payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ partId })
                });
                const res = await response.json();

                if (res.success) {
                    showAlert("Le montant payé a été remis à zéro avec succès !");
                    loadData();
                } else {
                    showAlert(res.error || "Une erreur s'est produite", "error");
                }
            } catch (err) {
                showAlert("Erreur réseau: impossible d'annuler le règlement.", "error");
            }
        }

        // FILTER AND SEARCH PACKAGES
        function applyFilters() {
            const filterCode = document.getElementById('filter-code').value.trim().toLowerCase();
            const filterClient = document.getElementById('filter-client').value.trim().toLowerCase();
            const filterTrans = document.getElementById('filter-transitaire').value;
            const filterDate = document.getElementById('filter-date').value;

            const filtered = colisList.filter(colis => {
                if (filterCode && !colis.code.toLowerCase().includes(filterCode)) return false;
                if (filterTrans && colis.transitaireId !== filterTrans) return false;
                if (filterDate && colis.dateEnregistrement !== filterDate) return false;
                
                if (filterClient) {
                    const hasClient = colis.parts.some(p => p.nomClient.toLowerCase().includes(filterClient));
                    if (!hasClient) return false;
                }
                return true;
            });

            const resultsContainer = document.getElementById('recherche-results');
            let html = "";

            filtered.forEach(c => {
                const trans = transitaires.find(t => t.id === c.transitaireId);
                const transNom = trans ? trans.nom : "Inconnu";

                html += `
                    <div class="bg-white rounded-3xl border border-natural-border p-6 shadow-sm space-y-4">
                        <div class="flex items-center justify-between border-b border-natural-border/50 pb-3">
                            <div class="flex items-center gap-2">
                                <span class="bg-natural-primary/10 text-natural-primary font-mono font-bold px-3 py-1 rounded-xl text-xs">
                                    # ${c.code}
                                </span>
                                <span class="text-[10px] bg-natural-sidebar text-natural-heading px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                                    ${c.type}
                                </span>
                            </div>
                            <span class="text-[10px] text-natural-text font-mono flex items-center gap-1">
                                <i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${c.dateEnregistrement}
                            </span>
                        </div>

                        <div class="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <span class="text-[10px] text-natural-primary block">Transitaire</span>
                                <span class="font-bold text-natural-heading">${transNom}</span>
                            </div>
                            <div>
                                <span class="text-[10px] text-natural-primary block">Poids Total</span>
                                <span class="font-mono font-bold text-natural-heading">${c.poidsTotal} kg</span>
                            </div>
                        </div>

                        <div class="space-y-3 bg-natural-light p-4 rounded-2xl border border-natural-border/40">
                            <h5 class="text-[10px] font-extrabold text-natural-heading uppercase tracking-wider">Parts Clients :</h5>
                            ${c.parts.map(p => {
                                const unpaid = p.montantDu - p.montantPaye;
                                const percent = Math.min(100, (p.montantPaye / (p.montantDu || 1)) * 100);
                                return `
                                    <div class="border-b border-natural-border/30 last:border-0 pb-3 last:pb-0 space-y-1.5">
                                        <div class="flex justify-between items-center text-xs">
                                            <span class="font-semibold text-natural-heading">${p.nomClient} (${p.poidsAttribue} kg)</span>
                                            <span class="font-mono text-natural-primary">${p.montantPaye.toLocaleString()} / ${p.montantDu.toLocaleString()} FCFA</span>
                                        </div>
                                        <div class="w-full bg-natural-border/50 h-2 rounded-full overflow-hidden">
                                            <div class="bg-emerald-600 h-full" style="width: ${percent}%"></div>
                                        </div>
                                        <div class="flex justify-between items-center text-[10px] font-mono mt-1 pt-1 border-t border-natural-border/20">
                                            <span>Règlement : ${percent.toFixed(0)}%</span>
                                            <div class="flex items-center gap-1.5">
                                                <span class="${unpaid > 0 ? 'text-amber-850 font-bold' : 'text-emerald-700 font-bold'} mr-2">
                                                    ${unpaid > 0 ? `Reste : ${unpaid.toLocaleString()} FCFA` : 'Soldé'}
                                                </span>
                                                <button onclick="toggleRetrieval(${c.id}, ${p.id}, ${p.estRetire ? 1 : 0})" 
                                                        class="px-2 py-0.5 text-[9px] font-bold rounded-lg border transition-all cursor-pointer inline-flex items-center gap-0.5 ${
                                                            p.estRetire 
                                                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                                        }">
                                                    <i data-lucide="${p.estRetire ? 'package-check' : 'package'}" class="w-3 h-3"></i>
                                                    ${p.estRetire ? 'Retiré' : 'Non retiré'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            });

            resultsContainer.innerHTML = filtered.length > 0 ? html : '<div class="col-span-2 text-center py-12 text-natural-text/50 italic">Aucun colis ne correspond à ces critères de recherche.</div>';
            lucide.createIcons();
        }

        // ADD NEW TRANSITAIRE
        async function submitTransitaireForm(e) {
            e.preventDefault();
            const nom = document.getElementById('transitaire-name').value.trim();

            if (!nom) return;

            try {
                const response = await fetch('api.php?action=add_transitaire', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nom })
                });
                const res = await response.json();

                if (res.success) {
                    showAlert(`🎉 Transitaire "${nom}" ajouté avec succès !`);
                    document.getElementById('transitaire-form').reset();
                    loadData();
                } else {
                    showAlert(res.error || "Une erreur s'est produite", "error");
                }
            } catch (err) {
                showAlert("Erreur réseau: impossible d'ajouter le transitaire.", "error");
            }
        }

        // DELETE TRANSITAIRE
        async function deleteTransitaire(id) {
            if (!confirm("⚠️ ATTENTION : Supprimer ce transitaire supprimera TOUS les colis et toutes les parts de clients qui lui sont rattachés. Voulez-vous continuer ?")) {
                return;
            }

            try {
                const response = await fetch('api.php?action=delete_transitaire', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                const res = await response.json();

                if (res.success) {
                    showAlert("Transitaire et colis rattachés supprimés de la base de données !");
                    loadData();
                } else {
                    showAlert(res.error || "Une erreur s'est produite", "error");
                }
            } catch (err) {
                showAlert("Erreur réseau: impossible de supprimer le transitaire.", "error");
            }
        }

        // TOGGLE RETRIEVAL STATUS
        async function toggleRetrieval(colisId, partId, currentVal) {
            const nextVal = currentVal ? 0 : 1;
            try {
                const response = await fetch('api.php?action=toggle_retrieval', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ partId, estRetire: nextVal })
                });
                const res = await response.json();

                if (res.success) {
                    showAlert("Statut de retrait mis à jour !");
                    loadData();
                } else {
                    showAlert(res.error || "Une erreur s'est produite", "error");
                }
            } catch (err) {
                showAlert("Erreur réseau: impossible d'ajuster le statut de retrait.", "error");
            }
        }

        // PRINT DAILY ENTRY SUMMARY REPORT
        function printDailyReport() {
            const printContainer = document.getElementById('php-print-container');
            if (!printContainer) return;

            let totalColis = colisList.length;
            let totalPoids = colisList.reduce((sum, c) => sum + c.poidsTotal, 0);
            let totalDue = 0;
            let totalClients = 0;
            
            let partsHtml = "";
            
            colisList.forEach(colis => {
                totalClients += colis.parts.length;
                let colisDue = 0;
                let clientRowsHtml = "";
                
                colis.parts.forEach(p => {
                    totalDue += p.montantDu;
                    colisDue += p.montantDu;
                    clientRowsHtml += `
                        <div class="flex justify-between text-[9px] border-b border-slate-100 last:border-b-0 py-0.5">
                            <span class="font-semibold text-slate-800">${p.nomClient}</span>
                            <span class="text-slate-500 font-mono font-bold">(${p.poidsAttribue} kg | ${p.montantDu.toLocaleString()} F)</span>
                        </div>
                    `;
                });
                
                partsHtml += `
                    <tr class="text-[10px]">
                        <td class="p-2.5 border border-slate-300 font-medium whitespace-nowrap">${colis.dateEnregistrement}</td>
                        <td class="p-2.5 border border-slate-300 font-bold font-mono">${colis.code}</td>
                        <td class="p-2.5 border border-slate-300 font-medium">${transitaires.find(t => t.id == colis.transitaireId)?.nom || 'Inconnu'}</td>
                        <td class="p-2.5 border border-slate-300 font-semibold">${colis.type}</td>
                        <td class="p-2.5 border border-slate-300 font-bold font-mono">${colis.poidsTotal} kg</td>
                        <td class="p-2.5 border border-slate-300">
                            <div class="space-y-1">
                                ${clientRowsHtml}
                            </div>
                        </td>
                        <td class="p-2.5 border border-slate-300 font-bold font-mono text-right whitespace-nowrap">
                            ${colisDue.toLocaleString()} F
                        </td>
                    </tr>
                `;
            });

            if (colisList.length === 0) {
                partsHtml = `
                    <tr>
                        <td colspan="7" class="p-8 text-center text-slate-500 font-semibold text-xs">
                            Aucun colis enregistré pour cette période.
                        </td>
                    </tr>
                `;
            }

            printContainer.innerHTML = `
                <!-- En-tête -->
                <div class="flex justify-between items-center border-b-2 border-slate-950 pb-4 mb-6">
                    <div>
                        <h1 class="text-xl font-extrabold uppercase tracking-tight text-slate-950">Abidjan Cargo</h1>
                        <p class="text-[10px] text-slate-500 font-mono font-bold">IMPORT-EXPORT LOGISTIQUE PRO</p>
                        <p class="text-[9px] text-slate-400 font-medium">Abidjan, Côte d'Ivoire</p>
                    </div>
                    <div class="text-right">
                        <h2 class="text-base font-extrabold text-slate-950">RAPPORT DES ENTRÉES DE COLIS</h2>
                        <p class="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
                            Rapport Global des Entrées de Colis
                        </p>
                        <p class="text-[9px] text-slate-500 mt-0.5">Généré le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
                    </div>
                </div>

                <!-- Statistiques -->
                <div class="grid grid-cols-4 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                        <span class="text-[9px] text-slate-500 uppercase font-extrabold block mb-0.5">Colis Enregistrés</span>
                        <strong class="text-sm text-slate-900 font-extrabold">${totalColis} colis</strong>
                    </div>
                    <div>
                        <span class="text-[9px] text-slate-500 uppercase font-extrabold block mb-0.5">Poids Total Traité</span>
                        <strong class="text-sm text-slate-900 font-extrabold">${totalPoids.toFixed(1)} kg</strong>
                    </div>
                    <div>
                        <span class="text-[9px] text-slate-500 uppercase font-extrabold block mb-0.5">Chiffre d'Affaires Dû</span>
                        <strong class="text-sm text-slate-900 font-extrabold">${totalDue.toLocaleString()} F CFA</strong>
                    </div>
                    <div>
                        <span class="text-[9px] text-slate-500 uppercase font-extrabold block mb-0.5">Nombre de Clients</span>
                        <strong class="text-sm text-slate-900 font-extrabold">${totalClients} clients</strong>
                    </div>
                </div>

                <!-- Tableau principal -->
                <h3 class="text-xs font-extrabold uppercase text-slate-950 mb-3 tracking-wider border-b border-slate-300 pb-1.5">Liste Détaillée des Entrées</h3>
                <table class="w-full text-left border-collapse border border-slate-300 mb-12">
                    <thead>
                        <tr class="bg-slate-100 text-[10px] font-bold text-slate-850 border-b border-slate-300">
                            <th class="p-2.5 border border-slate-300">Date</th>
                            <th class="p-2.5 border border-slate-300">Code Colis</th>
                            <th class="p-2.5 border border-slate-300">Transitaire</th>
                            <th class="p-2.5 border border-slate-300">Type</th>
                            <th class="p-2.5 border border-slate-300">Poids (kg)</th>
                            <th class="p-2.5 border border-slate-300">Clients & Parts d'Expédition</th>
                            <th class="p-2.5 border border-slate-300 text-right">Montant Dû</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                        ${partsHtml}
                    </tbody>
                </table>

                <!-- Signatures -->
                <div class="mt-16 flex justify-between items-center text-center">
                    <div class="w-56">
                        <p class="text-[10px] font-bold text-slate-600 mb-14">Signature de l'Agent de Caisse</p>
                        <div class="border-b border-slate-400 w-full"></div>
                    </div>
                    <div class="w-56">
                        <p class="text-[10px] font-bold text-slate-600 mb-14">Direction de l'Agence Abidjan</p>
                        <div class="border-b border-slate-400 w-full"></div>
                    </div>
                </div>
            `;

            window.print();
        }

        // CLEAR ALL APPLICATION DATA
        async function clearAllApplicationData() {
            if (!confirm("⚠️ Êtes-vous sûr de vouloir supprimer DEFINITIVEMENT toutes les données ? Cette action supprimera tous les colis, parts et transitaires. Les tables resteront intactes.")) {
                return;
            }

            try {
                const response = await fetch('api.php?action=clear_data', {
                    method: 'POST'
                });
                const res = await response.json();

                if (res.success) {
                    showAlert("🎉 Toutes les données ont été vidées de l'application !");
                    loadData();
                    switchTab('stats');
                } else {
                    showAlert(res.error || "Une erreur s'est produite lors du vidage.", "error");
                }
            } catch (err) {
                showAlert("Erreur réseau: impossible de vider l'application.", "error");
            }
        }

        // TOGGLE PASSWORD VISIBILITY IN LOGIN
        function togglePhpPassword() {
            const pwdInput = document.getElementById('login-password');
            const icon = document.getElementById('toggle-password-icon');
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                pwdInput.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            lucide.createIcons();
        }

        // HANDLE DATABASE AUTHENTICATION LOGIN
        async function handlePhpLogin(event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');
            const errorText = document.getElementById('login-error-text');
            const successDiv = document.getElementById('login-success');
            const submitBtn = document.getElementById('login-submit-btn');
            const btnText = document.getElementById('login-btn-text');
            const card = document.getElementById('login-card');

            errorDiv.classList.add('hidden');
            successDiv.classList.add('hidden');
            
            // Loading state
            submitBtn.disabled = true;
            btnText.innerText = "Connexion en cours...";

            try {
                const response = await fetch('api.php?action=login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const res = await response.json();

                if (response.ok && res.success) {
                    successDiv.classList.remove('hidden');
                    localStorage.setItem('abidjan_cargo_authenticated_db', 'true');
                    localStorage.setItem('abidjan_cargo_user_email_db', email);
                    
                    // Success animation delay
                    setTimeout(() => {
                        document.getElementById('login-wrapper').classList.add('hidden');
                        document.getElementById('app-wrapper').classList.remove('hidden');
                        
                        // Load and show icons
                        lucide.createIcons();
                        loadData();
                    }, 1400);
                } else {
                    // Shake animation & Error
                    errorText.innerText = res.error || "Identifiants de base de données incorrects.";
                    errorDiv.classList.remove('hidden');
                    
                    card.classList.add('animate-shake');
                    setTimeout(() => card.classList.remove('animate-shake'), 600);
                    
                    submitBtn.disabled = false;
                    btnText.innerText = "Se connecter";
                }
            } catch (err) {
                errorText.innerText = "Impossible de contacter le serveur de base de données.";
                errorDiv.classList.remove('hidden');
                submitBtn.disabled = false;
                btnText.innerText = "Se connecter";
            }
        }

        // HANDLE LOGOUT
        function handlePhpLogout() {
            if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
                localStorage.removeItem('abidjan_cargo_authenticated_db');
                localStorage.removeItem('abidjan_cargo_user_email_db');
                document.getElementById('app-wrapper').classList.add('hidden');
                document.getElementById('login-wrapper').classList.remove('hidden');
                document.getElementById('login-password').value = '';
            }
        }

        // Initialize App
        document.addEventListener("DOMContentLoaded", () => {
            // Check authentication
            const isAuthenticated = localStorage.getItem('abidjan_cargo_authenticated_db') === 'true';
            if (isAuthenticated) {
                document.getElementById('login-wrapper').classList.add('hidden');
                document.getElementById('app-wrapper').classList.remove('hidden');
                loadData();
            } else {
                document.getElementById('login-wrapper').classList.remove('hidden');
                document.getElementById('app-wrapper').classList.add('hidden');
            }

            // Set date to today
            const dateInput = document.getElementById('colis-date');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.value = today;
            }
            
            // Toggle to Stats Tab by default
            switchTab('stats');
            lucide.createIcons();
        });
    </script>
    </div> <!-- Close app-wrapper -->
    <div id="php-print-container" class="hidden print:block print-container p-8 bg-white text-black text-xs font-sans"></div>
</body>
</html>
