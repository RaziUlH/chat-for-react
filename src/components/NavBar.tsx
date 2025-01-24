import React from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import GeminiSettingsModal from "./GeminiSettingsModal";
import { useNavBar } from "../hooks/useChatHooks";

export const NavBar: React.FC = () => {
  const {
    user,
    isAuthenticated,
    soundEnabled,
    toggleSound,
    firestoreConnected,
    messageCount,
    geminiModalOpen,
    toggleGeminiModal,
    geminiApiKeyInput,
    setGeminiApiKeyInput,
    geminiModel,
    setGeminiModelPreference,
    saveGeminiApiKey,
    keyTestStatus,
    keyTestError,
    testApiKey,
    hasGeminiKey,
    signInWithGoogle,
    signOut,
  } = useNavBar();

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between bg-slate-900/90 backdrop-blur-md border-b border-white/10 z-40 gap-4 shrink-0">
      {/* Left: Brand & Channel Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent whitespace-nowrap">React Chat</span>
            {!isAuthenticated && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 whitespace-nowrap hidden sm:inline-block">
                Realtime
              </span>
            )}
          </div>
        </div>

        {/* Unified Channel Info in Main Navbar when logged in */}
        {isAuthenticated && (
          <div className="hidden sm:flex items-center gap-3 min-w-0">
            <div className="w-px h-7 bg-white/10 mx-1 shrink-0" />
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm" title="Channel: general-developers">
              <span>#</span>
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-sm font-semibold text-slate-100 tracking-tight whitespace-nowrap truncate">general-developers</span>
              <span className="text-xs text-slate-400 whitespace-nowrap truncate max-w-[200px] lg:max-w-xs">React, Webpack, State Management & Design discussion</span>
            </div>
          </div>
        )}
      </div>

      {/* Right: Channel Badges, Gemini Button, Sound Toggle, User Profile / Auth */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-3 pr-3 border-r border-white/10 shrink-0">
            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${firestoreConnected ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/30"}`}>
              <span className={`w-2 h-2 rounded-full ${firestoreConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"}`}></span>
              <span>{firestoreConnected ? "Live Cloud Sync" : "Local Sync Mode"}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium whitespace-nowrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>{messageCount} messages</span>
            </div>
          </div>
        )}

        {/* Gemini AI Bot modal button */}
        <button
          onClick={toggleGeminiModal}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all ${
            hasGeminiKey
              ? "bg-purple-600/25 border border-purple-500/40 text-purple-300 hover:bg-purple-600/35"
              : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
          }`}
          type="button"
          id="geminiModalBtn"
          title="Gemini AI Bot (mention @gemini in chat)"
          aria-label="Gemini AI Settings"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" />
            <path d="M18 16L19.2 18.8L22 20L19.2 21.2L18 24L16.8 21.2L14 20L16.8 18.8L18 16Z" opacity="0.7" />
          </svg>
          <span className="hidden sm:inline">Gemini AI</span>
        </button>

        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          className={`w-9 h-9 rounded-full flex items-center justify-center border cursor-pointer transition-all ${
            soundEnabled
              ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/40 hover:bg-indigo-500/30"
              : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-300"
          }`}
          type="button"
          id="soundToggleBtn"
          title={soundEnabled ? "Mute notification sounds" : "Enable notification sounds"}
          aria-label={soundEnabled ? "Mute notification sounds" : "Enable notification sounds"}
        >
          {soundEnabled ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 sm:gap-2.5 py-1 px-2 rounded-full bg-white/5 border border-white/10">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500 bg-slate-800"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                {(user.displayName || "U")[0].toUpperCase()}
              </div>
            )}
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                {user.displayName || "Anonymous"}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
              </span>
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 hover:text-red-200 transition-colors cursor-pointer"
              type="button"
              id="signOutBtn"
              title="Sign Out"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            className="p-0 bg-transparent border-0 cursor-pointer flex items-center hover:opacity-90 transition-opacity"
            onClick={signInWithGoogle}
            type="button"
            id="navGoogleSignInBtn"
            title="Sign in with Google"
          >
            <img src={GoogleSignin} alt="Sign in with Google" className="h-9 rounded" />
          </button>
        )}
      </div>

      {/* Gemini Settings Modal */}
      <GeminiSettingsModal
        isOpen={geminiModalOpen}
        onClose={toggleGeminiModal}
        apiKeyInput={geminiApiKeyInput}
        setApiKeyInput={setGeminiApiKeyInput}
        onSave={saveGeminiApiKey}
        selectedModel={geminiModel}
        onSelectModel={setGeminiModelPreference}
        testApiKey={testApiKey}
        keyTestStatus={keyTestStatus}
        keyTestError={keyTestError}
      />
    </header>
  );
};

export default NavBar;
