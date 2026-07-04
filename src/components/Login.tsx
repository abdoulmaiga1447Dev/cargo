import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, Info, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShake, setIsShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Try to authenticate against the live PHP + PostgreSQL backend
      const response = await fetch("/php/api.php?action=login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.setItem("abidjan_cargo_authenticated", "true");
          localStorage.setItem("abidjan_cargo_user_email", email.trim().toLowerCase());
          setIsLoading(false);
          setIsSuccess(true);
          
          setTimeout(() => {
            onLogin();
          }, 1400);
          return;
        }
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Identifiants de base de données incorrects.");
        setIsLoading(false);
        setIsShake(true);
        setTimeout(() => setIsShake(false), 600);
        return;
      }
    } catch (err) {
      // Fallback check for offline preview / local development without PHP server running
      console.log("PHP backend not running or accessible, trying default demo credentials:", err);
      
      const allowedEmail = "admin@abidjancargo.com";
      const allowedPassword = "admin";

      if (email.trim().toLowerCase() === allowedEmail && password === allowedPassword) {
        localStorage.setItem("abidjan_cargo_authenticated", "true");
        localStorage.setItem("abidjan_cargo_user_email", email.trim().toLowerCase());
        setIsLoading(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          onLogin();
        }, 1400);
        return;
      }
    }

    setError("Identifiants incorrects. Veuillez entrer les identifiants de votre base de données pgAdmin4.");
    setIsLoading(false);
    setIsShake(true);
    
    // Reset shake state
    setTimeout(() => {
      setIsShake(false);
    }, 600);
  };

  return (
    <div 
      id="login-page-container" 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1920')" }}
    >
      {/* Soft overlay with subtle blur to ensure readability and dramatic look */}
      <div id="login-overlay" className="absolute inset-0 bg-[#1A1817]/75 backdrop-blur-[2px] z-0"></div>

      <motion.div 
        className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Brand/Logo */}
        <div className="flex flex-col items-center">
          <motion.div 
            className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20 mb-3 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              id="login-brand-logo"
              src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=150&h=150" 
              alt="Abidjan Cargo Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <h2 className="text-center text-3xl font-display font-extrabold tracking-tight text-white uppercase drop-shadow-md">
            Abidjan Cargo
          </h2>
          <p className="mt-2 text-center text-xs font-mono font-bold text-amber-400 uppercase tracking-widest drop-shadow-sm">
            Logistique Import-Export Pro
          </p>
        </div>
      </motion.div>

      <div className="mt-8 relative z-10 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div 
          id="login-card-motion"
          className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl border border-white/20 rounded-3xl sm:px-10 overflow-hidden relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: isShake ? [-12, 12, -8, 8, -4, 4, 0] : 0,
            borderColor: isShake ? "rgb(239, 68, 68)" : "rgba(255, 255, 255, 0.2)"
          }}
          transition={{ 
            type: "spring",
            stiffness: isShake ? 400 : 100,
            damping: isShake ? 15 : 20,
            y: { duration: 0.8, ease: "easeOut" }
          }}
        >
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Card Banner Image of shipping dock */}
                <div className="w-full h-36 rounded-2xl overflow-hidden mb-6 relative shadow-inner border border-neutral-200">
                  <img 
                    id="login-card-banner"
                    src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600" 
                    alt="Abidjan Port Cargo Operations" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                      Hub Côte d'Ivoire
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      Réseau de transit international
                    </h4>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#2B2927] mb-6 text-center">
                  Connexion au Tableau de Bord
                </h3>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      key="error-msg"
                      className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2.5"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="font-bold text-red-900 shrink-0">Erreur :</span>
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="block text-[10px] font-bold text-[#5C564D] uppercase tracking-wider mb-1.5">
                      Adresse Email
                    </label>
                    <div className="relative rounded-lg shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-[#8C8475]" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@abidjancargo.com"
                        className="block w-full pl-10 pr-3 py-2.5 text-xs border border-[#D5D0C3] rounded-xl bg-[#FAF9F6] text-[#2B2927] placeholder-[#A49E93] focus:outline-hidden focus:ring-1 focus:ring-[#8C8475] focus:border-[#8C8475] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-[10px] font-bold text-[#5C564D] uppercase tracking-wider mb-1.5">
                      Mot de Passe
                    </label>
                    <div className="relative rounded-lg shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-[#8C8475]" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full pl-10 pr-10 py-2.5 text-xs border border-[#D5D0C3] rounded-xl bg-[#FAF9F6] text-[#2B2927] placeholder-[#A49E93] focus:outline-hidden focus:ring-1 focus:ring-[#8C8475] focus:border-[#8C8475] transition-all"
                      />
                      <button
                        type="button"
                        id="toggle-password-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C8475] hover:text-[#2B2927] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      id="login-submit-btn"
                      className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-xs font-bold text-white bg-[#2B2927] hover:bg-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#2B2927] transition-all shadow-md disabled:opacity-75 cursor-pointer relative overflow-hidden"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          Se connecter
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-screen"
                className="py-12 flex flex-col items-center justify-center text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <motion.div 
                  className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6 border-4 border-emerald-500/20"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                >
                  <CheckCircle2 className="w-12 h-12" />
                </motion.div>
                
                <motion.h3 
                  className="text-xl font-bold text-[#2B2927]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Connexion Réussie !
                </motion.h3>
                
                <motion.p 
                  className="text-xs text-[#5C564D] mt-2 max-w-xs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Préparation de votre espace de transit personnalisé...
                </motion.p>
                
                <div className="mt-8 flex items-center gap-1 justify-center">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
