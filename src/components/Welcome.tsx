import React from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { useWelcome } from "../hooks/useChatHooks";

export const Welcome: React.FC = () => {
  const {
    isSettingGuest,
    guestName,
    setGuestName,
    openGuestForm,
    closeGuestForm,
    handleGuestSubmit,
    signInWithGoogle,
  } = useWelcome();

  return (
    <main className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto w-full">
      <div className="relative w-full max-w-lg bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl text-center">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#gradient-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">React Chat</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Connect and collaborate in real-time with fellow React & Frontend engineers worldwide.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 text-left mb-6 p-4 bg-black/25 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] shrink-0"></div>
            <span>Instant live message delivery</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] shrink-0"></div>
            <span>Firestore real-time cloud sync</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] shrink-0"></div>
            <span>Interactive reactive UI & timestamps</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            className="p-0 bg-transparent border-0 cursor-pointer flex items-center hover:opacity-90 transition-opacity"
            onClick={signInWithGoogle}
            type="button"
            id="welcomeGoogleSignInBtn"
          >
            <img src={GoogleSignin} alt="Sign in with Google" className="h-11 rounded-md" />
          </button>

          <div className="w-full flex items-center text-xs uppercase tracking-wider text-slate-500 my-1 before:flex-1 before:border-b before:border-white/10 after:flex-1 after:border-b after:border-white/10">
            <span className="px-3">or explore without Google sign-in</span>
          </div>

          {!isSettingGuest ? (
            <button
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              onClick={openGuestForm}
              type="button"
              id="tryDemoBtn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="22" y1="11" x2="16" y2="11"></line>
              </svg>
              <span>Instant Guest Mode</span>
            </button>
          ) : (
            <form onSubmit={handleGuestSubmit} className="w-full flex flex-col gap-3">
              <input
                type="text"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                placeholder="Enter your display name (e.g. Sarah)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                autoFocus
                required
                id="guestNameInput"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm inline-flex items-center justify-center bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 transition-all cursor-pointer"
                  id="joinGuestBtn"
                >
                  Join Chat Room
                </button>
                <button
                  type="button"
                  className="py-2.5 px-4 rounded-xl font-semibold text-sm inline-flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={closeGuestForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default Welcome;
