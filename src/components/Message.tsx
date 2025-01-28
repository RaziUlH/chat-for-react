import React from "react";
import { useMessageItem } from "../hooks/useChatHooks";
import FormattedMessage from "./FormattedMessage";
import type { ChatMessage, AppUser } from "../types";

interface MessageProps {
  currentUser: AppUser | any | null;
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ currentUser, message }) => {
  const { isSelf, isBot, avatarUrl, displayName, formattedTime } =
    useMessageItem(message, currentUser);

  return (
    <div
      className={`flex items-end gap-2.5 ${
        isSelf
          ? "ml-auto flex-row-reverse max-w-[80%]"
          : isBot
          ? "mr-auto flex-row max-w-[95%] sm:max-w-[88%]"
          : "mr-auto flex-row max-w-[80%]"
      }`}
    >
      {/* Avatar for other participants or Gemini Bot */}
      {!isSelf && (
        <img
          className={`w-8 h-8 rounded-full border-2 ${
            isBot ? "border-purple-400 shadow-md shadow-purple-500/20" : "border-indigo-500"
          } bg-gray-800 object-cover shrink-0`}
          src={avatarUrl}
          alt={displayName}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = isBot
              ? "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"
              : `https://api.dicebear.com/7.x/bottts/svg?seed=fallback`;
          }}
        />
      )}

      {/* Message bubble */}
      <div
        className={`rounded-2xl ${
          isSelf
            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-sm p-3.5 shadow-md shadow-indigo-600/10"
            : isBot
            ? "bg-slate-800/95 border border-purple-500/35 text-slate-100 rounded-bl-sm p-4 sm:p-5 shadow-xl shadow-purple-950/20"
            : "bg-slate-800 text-slate-100 border border-white/5 rounded-bl-sm p-3.5 shadow-md"
        } w-full overflow-hidden`}
      >
        <div className="flex items-center justify-between mb-2 gap-3">
          <span
            className={`font-semibold flex items-center gap-1.5 ${
              isBot ? "text-purple-300 text-sm" : "text-white text-xs"
            }`}
          >
            {isBot && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400">
                <path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" />
                <path d="M18 16L19.2 18.8L22 20L19.2 21.2L18 24L16.8 21.2L14 20L16.8 18.8L18 16Z" opacity="0.7" />
              </svg>
            )}
            <span>{displayName}</span>
            {isBot && (
              <span className="ml-0.5 px-1.5 py-0.5 text-[10px] rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 uppercase tracking-wider">
                AI BOT
              </span>
            )}
          </span>
          <span className="text-[11px] text-slate-400 shrink-0">{formattedTime}</span>
        </div>

        <div className="text-sm">
          <FormattedMessage text={message?.text} />
        </div>
      </div>

      {/* Avatar for self */}
      {isSelf && (
        <img
          className="w-8 h-8 rounded-full border-2 border-indigo-500 bg-gray-800 object-cover shrink-0"
          src={avatarUrl}
          alt="You"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=you`;
          }}
        />
      )}
    </div>
  );
};

export default Message;
