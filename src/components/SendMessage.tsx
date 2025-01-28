import React, { useState } from "react";
import { useSendMessage } from "../hooks/useChatHooks";

const QUICK_PROMPTS = [
  "Explain React 19 Actions & hooks",
  "Write Firestore rules for chat",
  "How to optimize Zustand re-renders?",
  "Modern CSS Glassmorphism styling tips",
];

interface SendMessageProps {
  scroll?: React.RefObject<any>;
}

export const SendMessage: React.FC<SendMessageProps> = ({ scroll }) => {
  const {
    message,
    isSending,
    isGeminiTyping,
    canSend,
    handleInputChange,
    handleFormSubmit,
    prefillGeminiPrompt,
    handleQuickPrompt,
  } = useSendMessage(scroll);

  const [showPrompts, setShowPrompts] = useState(false);

  return (
    <footer className="flex flex-col bg-slate-900/80 backdrop-blur-md border-t border-white/10 p-4">
      {/* Quick Prompt Chips */}
      {(showPrompts || message.startsWith("@gemini")) && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 w-full no-scrollbar">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
            ✨ Suggested:
          </span>
          {QUICK_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              type="button"
              className="text-xs px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-200 hover:bg-purple-500/25 whitespace-nowrap flex-shrink-0 transition-colors cursor-pointer"
              onClick={() => handleQuickPrompt(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="flex flex-1 items-center space-x-2">
        <button
          type="button"
          onClick={() => {
            prefillGeminiPrompt("@gemini ");
            setShowPrompts((prev) => !prev);
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full hover:bg-indigo-500/25 transition-colors cursor-pointer shrink-0"
          id="askGeminiQuickBtn"
          title="Mention @gemini to get an AI reply"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" />
            <path
              d="M18 16L19.2 18.8L22 20L19.2 21.2L18 24L16.8 21.2L14 20L16.8 18.8L18 16Z"
              opacity="0.65"
            />
          </svg>
          <span className="text-xs font-medium">Ask AI</span>
        </button>

        <div className="flex-1">
          <input
            id="messageInput"
            name="messageInput"
            type="text"
            className="w-full rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-400 px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder={
              isGeminiTyping
                ? "Gemini is typing a response..."
                : "Type a message or mention @gemini for AI answers..."
            }
            value={message}
            onChange={handleInputChange}
            disabled={isSending}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 transition-all cursor-pointer shrink-0"
          disabled={!canSend}
          id="sendMessageBtn"
          title="Send message"
        >
          <span>Send</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </footer>
  );
};

export default SendMessage;
