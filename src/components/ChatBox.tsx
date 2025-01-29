import React from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import ShineFx from "./ShineFx";
import { useChatRoom } from "../hooks/useChatHooks";
import type { AppUser } from "../types";

interface ChatBoxProps {
  currentUser: AppUser | any | null;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ currentUser }) => {
  const { messages, scrollRef, isGeminiTyping } = useChatRoom();

  return (
    <main className="flex-1 flex flex-col h-full max-w-4xl w-full mx-auto overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 flex flex-col">
        <div className="mx-auto my-2 p-6 bg-white/5 border border-white/10 rounded-2xl text-center max-w-2xl w-full backdrop-blur-sm">
          <div className="w-11 h-11 flex items-center justify-center mx-auto mb-3 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white mb-1">Welcome to #general-developers</h4>
          <p className="text-xs sm:text-sm text-slate-400">
            This is the start of the conversation. Be respectful and have fun coding together!
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          {messages.map((message) => (
            <Message
              key={message.id || Math.random().toString()}
              currentUser={currentUser}
              message={message}
            />
          ))}

          {/* Gemini AI Live Thinking Indicator */}
          {isGeminiTyping && (
            <div className="flex items-end gap-2.5 flex-row max-w-[85%]">
              <img
                className="w-8 h-8 rounded-full border-2 border-purple-400 shadow-md shadow-purple-500/20 bg-gray-800 object-cover shrink-0"
                src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"
                alt="Gemini AI"
              />
              <div className="rounded-2xl p-3 sm:p-3.5 bg-slate-800/95 border border-purple-500/35 text-gray-100 flex items-center gap-3 shadow-xl shadow-purple-950/20 rounded-bl-sm">
                <div className="flex items-center gap-2">
                  <ShineFx speed={4000} baseOpacity={0.35} className="text-xs sm:text-sm">
                    Thinking
                  </ShineFx>
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} className="h-1" />
        </div>
      </div>

      {/* Send message bottom input */}
      <SendMessage scroll={scrollRef} />
    </main>
  );
};

export default ChatBox;
