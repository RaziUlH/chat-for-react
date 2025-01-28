import React from "react";
import { AVAILABLE_MODELS } from "../services/geminiService";
import type { KeyTestStatus } from "../types";

interface GeminiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeyInput: string;
  setApiKeyInput: (val: string) => void;
  onSave: () => void;
  selectedModel: string;
  onSelectModel: (val: string) => void;
  testApiKey: () => Promise<void>;
  keyTestStatus: KeyTestStatus;
  keyTestError: string;
}

export const GeminiSettingsModal: React.FC<GeminiSettingsModalProps> = ({
  isOpen,
  onClose,
  apiKeyInput,
  setApiKeyInput,
  onSave,
  selectedModel,
  onSelectModel,
  testApiKey,
  keyTestStatus,
  keyTestError,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg my-auto bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] shrink-0"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="geminiModalTitle"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-lg">✨</div>
            <div>
              <h3 id="geminiModalTitle" className="text-base font-bold text-white">Gemini AI Configuration</h3>
              <p className="text-xs text-slate-400">
                Powered by Google <code className="px-1 py-0.5 rounded bg-purple-500/20 text-purple-200 font-mono text-xs">@google/genai</code> SDK
              </p>
            </div>
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-4">
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs flex gap-3 leading-relaxed">
            <span className="text-base">💡</span>
            <div>
              <strong className="font-semibold text-purple-100">How to chat with Gemini:</strong>
              <p className="mt-1">
                In any message, type <code className="px-1 py-0.5 rounded bg-purple-500/20 text-purple-200 font-mono text-xs">@gemini</code> followed by your
                prompt (e.g.{" "}
                <code className="px-1 py-0.5 rounded bg-purple-500/20 text-purple-200 font-mono text-xs">@gemini explain how state works in React</code>). Gemini
                will respond directly in the chat with formatted code and
                answers!
              </p>
            </div>
          </div>

          {/* API Key Form Group */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="geminiApiKey" className="text-xs font-semibold text-slate-300">Google Gemini API Key:</label>
            <input
              id="geminiApiKey"
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="AIzaSy... (leave blank to use .env key)"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              autoComplete="off"
            />
            <span className="text-[11px] text-slate-400 leading-normal">
              Get an API key for free from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Google AI Studio
              </a>
              . Or set <code className="px-1 py-0.5 rounded bg-purple-500/20 text-purple-200 font-mono text-xs">VITE_GEMINI_API_KEY</code> in your <code className="px-1 py-0.5 rounded bg-purple-500/20 text-purple-200 font-mono text-xs">.env</code>.
            </span>

            {/* Test Connection Button */}
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 transition-colors disabled:opacity-50 cursor-pointer"
                onClick={testApiKey}
                disabled={!apiKeyInput?.trim() || keyTestStatus === "testing"}
                id="testGeminiKeyBtn"
              >
                {keyTestStatus === "testing" ? (
                  <>
                    <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying key...</span>
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    <span>Test API Key</span>
                  </>
                )}
              </button>
            </div>

            {/* Test Status Banner */}
            {keyTestStatus === "valid" && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>API Key verified! Connected to Google Gemini.</span>
              </div>
            )}
            {keyTestStatus === "invalid" && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg text-xs bg-red-500/15 border border-red-500/30 text-red-300">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Verification failed: {keyTestError}</span>
              </div>
            )}
          </div>

          {/* Model Selection */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="geminiModel" className="text-xs font-semibold text-slate-300">Model Selection:</label>
            <select
              id="geminiModel"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                  {m.name} ({m.tag}) — {m.desc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-950/80 border-t border-white/10 shrink-0">
          <button
            type="button"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
            onClick={onSave}
            id="saveGeminiSettingsBtn"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiSettingsModal;
