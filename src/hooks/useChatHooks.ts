import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import type { ChatMessage, AppUser } from "../types";

/**
 * Custom hook for Navigation bar: Auth, Room status, Sound toggle
 */
export const useNavBar = () => {
  const user = useChatStore((state) => state.user);
  const demoUser = useChatStore((state) => state.demoUser);
  const authLoading = useChatStore((state) => state.authLoading);
  const initAuth = useChatStore((state) => state.initAuth);
  const signInWithGoogle = useChatStore((state) => state.signInWithGoogle);
  const signInAsGuest = useChatStore((state) => state.signInAsGuest);
  const signOut = useChatStore((state) => state.signOut);

  const soundEnabled = useChatStore((state) => state.soundEnabled);
  const toggleSound = useChatStore((state) => state.toggleSound);

  const firestoreConnected = useChatStore((state) => state.firestoreConnected);
  const messageCount = useChatStore((state) => state.messages.length);

  const geminiModalOpen = useChatStore((state) => state.geminiModalOpen);
  const toggleGeminiModal = useChatStore((state) => state.toggleGeminiModal);
  const geminiApiKeyInput = useChatStore((state) => state.geminiApiKeyInput);
  const setGeminiApiKeyInput = useChatStore((state) => state.setGeminiApiKeyInput);
  const geminiModel = useChatStore((state) => state.geminiModel);
  const setGeminiModelPreference = useChatStore((state) => state.setGeminiModelPreference);
  const saveGeminiApiKey = useChatStore((state) => state.saveGeminiApiKey);

  const keyTestStatus = useChatStore((state) => state.keyTestStatus);
  const keyTestError = useChatStore((state) => state.keyTestError);
  const testApiKey = useChatStore((state) => state.testApiKey);

  useEffect(() => {
    const cleanup = initAuth();
    return cleanup;
  }, [initAuth]);

  const activeUser = user || demoUser;

  return {
    user: activeUser,
    isAuthenticated: Boolean(activeUser),
    authLoading,
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
    hasGeminiKey: Boolean(geminiApiKeyInput && geminiApiKeyInput.trim()),
    signInWithGoogle,
    signInAsGuest,
    signOut,
  };
};

/**
 * Custom hook for Authentication & User profile management
 */
export const useAuth = () => {
  const user = useChatStore((state) => state.user);
  const demoUser = useChatStore((state) => state.demoUser);
  const authLoading = useChatStore((state) => state.authLoading);
  const initAuth = useChatStore((state) => state.initAuth);
  const signInWithGoogle = useChatStore((state) => state.signInWithGoogle);
  const signInAsGuest = useChatStore((state) => state.signInAsGuest);
  const signOut = useChatStore((state) => state.signOut);

  const soundEnabled = useChatStore((state) => state.soundEnabled);
  const toggleSound = useChatStore((state) => state.toggleSound);

  useEffect(() => {
    const cleanup = initAuth();
    return cleanup;
  }, [initAuth]);

  const activeUser = user || demoUser;

  return {
    user: activeUser,
    isAuthenticated: Boolean(activeUser),
    authLoading,
    soundEnabled,
    toggleSound,
    signInWithGoogle,
    signInAsGuest,
    signOut,
  };
};

/**
 * Custom hook for Welcome screen guest login modal and interactions
 */
export const useWelcome = () => {
  const isSettingGuest = useChatStore((state) => state.isSettingGuest);
  const guestName = useChatStore((state) => state.guestName);
  const setGuestName = useChatStore((state) => state.setGuestName);
  const setIsSettingGuest = useChatStore((state) => state.setIsSettingGuest);
  const signInWithGoogle = useChatStore((state) => state.signInWithGoogle);
  const signInAsGuest = useChatStore((state) => state.signInAsGuest);

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signInAsGuest(guestName);
  };

  const openGuestForm = () => setIsSettingGuest(true);
  const closeGuestForm = () => {
    setIsSettingGuest(false);
    setGuestName("");
  };

  return {
    isSettingGuest,
    guestName,
    setGuestName,
    openGuestForm,
    closeGuestForm,
    handleGuestSubmit,
    signInWithGoogle,
  };
};

/**
 * Custom hook for Chat Room messages and real-time syncing
 */
export const useChatRoom = () => {
  const messages = useChatStore((state) => state.messages);
  const firestoreConnected = useChatStore((state) => state.firestoreConnected);
  const isGeminiTyping = useChatStore((state) => state.isGeminiTyping);
  const subscribeToMessages = useChatStore((state) => state.subscribeToMessages);
  const triggerGeminiPrompt = useChatStore((state) => state.triggerGeminiPrompt);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cleanup = subscribeToMessages();
    return cleanup;
  }, [subscribeToMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isGeminiTyping]);

  return {
    messages,
    firestoreConnected,
    isGeminiTyping,
    scrollRef,
    triggerGeminiPrompt,
    messageCount: messages.length,
  };
};

/**
 * Custom hook for Message Composer input and submission
 */
export const useSendMessage = (scrollRef?: React.RefObject<any>) => {
  const messageInput = useChatStore((state) => state.messageInput);
  const isSendingMessage = useChatStore((state) => state.isSendingMessage);
  const isGeminiTyping = useChatStore((state) => state.isGeminiTyping);
  const setMessageInput = useChatStore((state) => state.setMessageInput);
  const sendMessageAction = useChatStore((state) => state.sendMessage);
  const prefillGeminiPrompt = useChatStore((state) => state.prefillGeminiPrompt);
  const triggerGeminiPrompt = useChatStore((state) => state.triggerGeminiPrompt);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessageAction(scrollRef);
  };

  const handleQuickPrompt = async (promptText: string) => {
    await triggerGeminiPrompt(promptText, scrollRef);
  };

  return {
    message: messageInput,
    isSending: isSendingMessage,
    isGeminiTyping,
    canSend: Boolean(messageInput?.trim()) && !isSendingMessage,
    handleInputChange,
    handleFormSubmit,
    prefillGeminiPrompt,
    handleQuickPrompt,
  };
};

/**
 * Custom hook for single message formatting
 */
export const useMessageItem = (
  message: ChatMessage,
  currentUser: AppUser | any | null
) => {
  const currentUid = currentUser?.uid;
  const currentName = currentUser?.displayName;
  const isBot = Boolean(message?.isBot || message?.uid === "gemini-bot");

  const isSelf = Boolean(
    !isBot &&
    ((currentUid && message?.uid && message.uid === currentUid) ||
      (currentName && message?.name && message.name === currentName))
  );

  const formatTime = (createdAt: any): string => {
    if (!createdAt) return "";
    let date: Date | null = null;
    if (createdAt?.toDate && typeof createdAt.toDate === "function") {
      date = createdAt.toDate();
    } else if (createdAt?.seconds) {
      date = new Date(createdAt.seconds * 1000);
    } else if (typeof createdAt === "number" || typeof createdAt === "string") {
      date = new Date(createdAt);
    }
    if (!date || isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const avatarUrl =
    isBot
      ? "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"
      : message?.avatar && message.avatar !== "avatar"
      ? message.avatar
      : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
          message?.name || "User"
        )}`;

  const displayName = isBot
    ? "Gemini AI"
    : isSelf
    ? "You"
    : message?.name || "Anonymous";

  return {
    isSelf,
    isBot,
    avatarUrl,
    displayName,
    formattedTime: formatTime(message?.createdAt),
  };
};
