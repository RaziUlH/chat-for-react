import { create } from "zustand";
import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  generateGeminiResponse,
  getGeminiApiKey,
  setGeminiApiKey,
  getGeminiModel,
  setGeminiModel,
  testGeminiApiKey,
} from "../services/geminiService";
import type { ChatMessage, AppUser, KeyTestStatus } from "../types";

const DEMO_USER_STORAGE_KEY = "react_chat_demo_user";
const LOCAL_CACHE_STORAGE_KEY = "react_chat_local_cache";
const SOUND_ENABLED_STORAGE_KEY = "react_chat_sound_enabled";

const INITIAL_SEED_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-system-1",
    name: "React Bot",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ReactBot",
    text: "Welcome to React Chat! 🚀 Powered by React 19, Cloud Firestore, and Zustand state store.",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 300 },
    uid: "system-bot",
  },
  {
    id: "welcome-system-2",
    name: "Dan A.",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DanA",
    text: "Hey everyone! Architecture is now completely decoupled using custom Zustand hooks.",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 180 },
    uid: "dan-sample",
  },
  {
    id: "welcome-system-3",
    name: "Sophie T.",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=SophieT",
    text: "Building clean UI components with centralized hooks makes everything super maintainable! ✨",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 60 },
    uid: "sophie-sample",
  },
];

const loadInitialLocalMessages = (): ChatMessage[] => {
  try {
    const saved = sessionStorage.getItem(LOCAL_CACHE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_SEED_MESSAGES;
  } catch {
    return INITIAL_SEED_MESSAGES;
  }
};

const loadInitialDemoUser = (): AppUser | null => {
  try {
    const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const loadInitialSoundEnabled = (): boolean => {
  try {
    const stored = localStorage.getItem(SOUND_ENABLED_STORAGE_KEY);
    return stored !== null ? JSON.parse(stored) : true;
  } catch {
    return true;
  }
};

let audioCtx: AudioContext | null = null;
const playChime = (type: "send" | "receive" = "receive") => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    if (type === "send") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.setValueAtTime(987.77, now + 0.08);

      osc2.frequency.setValueAtTime(1318.5, now);
      osc2.frequency.setValueAtTime(1975.5, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    }
  } catch (err) {
    console.debug("Audio playback ignored:", err);
  }
};

export interface ChatStoreState {
  // Auth
  user: FirebaseUser | null;
  demoUser: AppUser | null;
  authLoading: boolean;

  // Sound
  soundEnabled: boolean;

  // Messages
  messages: ChatMessage[];
  firestoreConnected: boolean;
  isSendingMessage: boolean;
  messageInput: string;

  // UI / Nav
  isSettingGuest: boolean;
  guestName: string;

  // Gemini AI
  isGeminiTyping: boolean;
  geminiModalOpen: boolean;
  geminiApiKeyInput: string;
  geminiModel: string;
  keyTestStatus: KeyTestStatus;
  keyTestError: string;

  // Actions
  setMessageInput: (val: string) => void;
  setGuestName: (val: string) => void;
  setIsSettingGuest: (val: boolean) => void;
  setGeminiApiKeyInput: (val: string) => void;
  setGeminiModelPreference: (model: string) => void;
  toggleGeminiModal: () => void;
  saveGeminiApiKey: () => void;
  testApiKey: () => Promise<void>;
  prefillGeminiPrompt: (customPrefix?: string) => void;
  triggerGeminiPrompt: (promptQuery: string, scrollRef?: React.RefObject<any>) => Promise<void>;
  toggleSound: () => void;
  initAuth: () => () => void;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: (nameInput?: string) => void;
  signOut: () => Promise<void>;
  subscribeToMessages: () => () => void;
  sendMessage: (scrollRef?: React.RefObject<any>) => Promise<void>;
  askGeminiBot: (promptText: string, scrollRef?: React.RefObject<any>) => Promise<void>;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  // --- Auth State ---
  user: null,
  demoUser: loadInitialDemoUser(),
  authLoading: true,

  // --- Sound Setting ---
  soundEnabled: loadInitialSoundEnabled(),

  // --- Chat & Messages State ---
  messages: loadInitialLocalMessages(),
  firestoreConnected: false,
  isSendingMessage: false,
  messageInput: "",

  // --- UI / Navigation State ---
  isSettingGuest: false,
  guestName: "",

  // --- Gemini AI State ---
  isGeminiTyping: false,
  geminiModalOpen: false,
  geminiApiKeyInput: getGeminiApiKey(),
  geminiModel: getGeminiModel(),
  keyTestStatus: "idle",
  keyTestError: "",

  // --- State Setters ---
  setMessageInput: (val: string) => set({ messageInput: val }),
  setGuestName: (val: string) => set({ guestName: val }),
  setIsSettingGuest: (val: boolean) => set({ isSettingGuest: val }),
  setGeminiApiKeyInput: (val: string) =>
    set({ geminiApiKeyInput: val, keyTestStatus: "idle", keyTestError: "" }),
  setGeminiModelPreference: (model: string) => {
    setGeminiModel(model);
    set({ geminiModel: model, keyTestStatus: "idle", keyTestError: "" });
  },
  toggleGeminiModal: () =>
    set((state) => ({
      geminiModalOpen: !state.geminiModalOpen,
      keyTestStatus: "idle",
      keyTestError: "",
    })),
  saveGeminiApiKey: () => {
    setGeminiApiKey(get().geminiApiKeyInput);
    set({ geminiModalOpen: false, keyTestStatus: "idle", keyTestError: "" });
  },
  testApiKey: async () => {
    const key = get().geminiApiKeyInput;
    const model = get().geminiModel;
    set({ keyTestStatus: "testing", keyTestError: "" });
    try {
      await testGeminiApiKey(key, model);
      set({ keyTestStatus: "valid", keyTestError: "" });
    } catch (err: any) {
      set({
        keyTestStatus: "invalid",
        keyTestError: err?.message || "Failed to validate API key",
      });
    }
  },
  prefillGeminiPrompt: (customPrefix = "@gemini ") => {
    const current = get().messageInput;
    if (!current.startsWith(customPrefix)) {
      set({ messageInput: `${customPrefix}${current}` });
    }
  },
  triggerGeminiPrompt: async (promptQuery: string, scrollRef?: React.RefObject<any>) => {
    set({ messageInput: `@gemini ${promptQuery}` });
    await get().sendMessage(scrollRef);
  },
  toggleSound: () => {
    const nextState = !get().soundEnabled;
    try {
      localStorage.setItem(SOUND_ENABLED_STORAGE_KEY, JSON.stringify(nextState));
    } catch {}
    set({ soundEnabled: nextState });
    if (nextState) {
      playChime("receive");
    }
  },

  // --- Auth Actions ---
  initAuth: () => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          set({ user: firebaseUser, authLoading: false });
        },
        (error) => {
          console.warn("Auth state observer warning:", error);
          set({ authLoading: false });
        }
      );
    } catch (e) {
      console.warn("Auth initialization error:", e);
      set({ authLoading: false });
    }

    const handleStorageChange = () => {
      const stored = loadInitialDemoUser();
      set({ demoUser: stored });
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("demo-user-changed", handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("demo-user-changed", handleStorageChange);
    };
  },

  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.warn("Google signInWithPopup failed, falling back to redirect:", err);
      try {
        await signInWithRedirect(auth, provider);
      } catch (redirectErr) {
        console.error("Google signInWithRedirect failed:", redirectErr);
      }
    }
  },

  signInAsGuest: (nameInput?: string) => {
    const cleanName = (nameInput || get().guestName || "").trim() || "Guest Explorer";
    const guestUser: AppUser = {
      uid: "guest-" + Math.random().toString(36).substring(2, 9),
      displayName: cleanName,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
    };
    try {
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(guestUser));
    } catch {}
    set({ demoUser: guestUser, isSettingGuest: false, guestName: "" });
    window.dispatchEvent(new Event("demo-user-changed"));
  },

  signOut: async () => {
    try {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    } catch {}
    set({ demoUser: null });
    window.dispatchEvent(new Event("demo-user-changed"));
    try {
      await firebaseSignOut(auth);
    } catch {}
  },

  // --- Realtime Firestore Messages Subscription ---
  subscribeToMessages: () => {
    let unsubscribe = () => {};
    let isInitialLoad = true;

    try {
      const q = query(
        collection(db, "messages"),
        orderBy("createdAt"),
        limit(50)
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: ChatMessage[] = [];
          snapshot.forEach((doc) => {
            list.push({ ...(doc.data() as ChatMessage), id: doc.id });
          });

          const currentMessages = get().messages;
          const activeUser = get().user || get().demoUser;

          if (!isInitialLoad && list.length > currentMessages.length) {
            const newest = list[list.length - 1];
            const isFromOther =
              newest?.uid !== activeUser?.uid &&
              newest?.name !== activeUser?.displayName;

            if (isFromOther && get().soundEnabled) {
              playChime("receive");
            }
          }

          isInitialLoad = false;

          if (list.length > 0) {
            set({ messages: list, firestoreConnected: true });
          } else {
            set({ messages: loadInitialLocalMessages() });
          }
        },
        (error: any) => {
          if (error.code === "not-found") {
            console.info("Firestore Notice: Database (default) not yet created for project. Operating in offline/local sync mode.");
          } else {
            console.warn("Firestore snapshot listener:", error.code || error.message);
          }
          set({
            firestoreConnected: false,
            messages: loadInitialLocalMessages(),
          });
        }
      );
    } catch (e) {
      console.warn("Firestore subscription failed:", e);
      set({
        firestoreConnected: false,
        messages: loadInitialLocalMessages(),
      });
    }

    return () => {
      unsubscribe();
    };
  },

  // --- Sending Message Action ---
  sendMessage: async (scrollRef?: React.RefObject<any>) => {
    const { messageInput, user, demoUser, messages, soundEnabled } = get();
    const trimmed = (messageInput || "").trim();
    if (!trimmed) return;

    set({ isSendingMessage: true });

    const activeUser = user || demoUser;
    const senderName =
      activeUser?.displayName ||
      activeUser?.email?.split("@")[0] ||
      "Anonymous";
    const senderUid = activeUser?.uid || "guest";
    const senderAvatar =
      activeUser?.photoURL ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(senderName)}`;

    const optimisticId = "msg-" + Date.now();
    const messageData: ChatMessage = {
      id: optimisticId,
      text: trimmed,
      name: senderName,
      avatar: senderAvatar,
      createdAt: { seconds: Math.floor(Date.now() / 1000) },
      uid: senderUid,
    };

    if (soundEnabled) {
      playChime("send");
    }

    const updated = [...messages, messageData];
    set({
      messages: updated,
      messageInput: "",
      isSendingMessage: false,
    });

    try {
      sessionStorage.setItem(LOCAL_CACHE_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    setTimeout(() => {
      if (scrollRef?.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);

    // Sync to Firestore in background
    try {
      const firestoreData = {
        text: trimmed,
        name: senderName,
        avatar: senderAvatar,
        createdAt: serverTimestamp(),
        uid: senderUid,
      };
      await Promise.race([
        addDoc(collection(db, "messages"), firestoreData),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Firestore sync timeout")), 4000)
        ),
      ]);
    } catch (err: any) {
      console.warn("Firestore sync background notice:", err?.message);
    }

    // Trigger Gemini AI bot if user mentioned @gemini, @ai, or /gemini
    const isGeminiMentioned =
      /@(gemini|ai)\b/i.test(trimmed) ||
      /^[/](gemini|ai)\b/i.test(trimmed);

    if (isGeminiMentioned) {
      const cleanPrompt = trimmed
        .replace(/^[/](gemini|ai)\s*/i, "")
        .replace(/@(gemini|ai)\s*/gi, "")
        .trim();

      get().askGeminiBot(cleanPrompt || trimmed, scrollRef);
    }
  },

  // --- Gemini AI Bot Action ---
  askGeminiBot: async (promptText: string, scrollRef?: React.RefObject<any>) => {
    set({ isGeminiTyping: true });

    setTimeout(() => {
      if (scrollRef?.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);

    try {
      const responseText = await generateGeminiResponse(
        promptText,
        get().geminiModel,
        get().messages
      );

      const botId = "gemini-" + Date.now();
      const botMessage: ChatMessage = {
        id: botId,
        text: responseText,
        name: "Gemini AI",
        avatar:
          "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
        createdAt: { seconds: Math.floor(Date.now() / 1000) },
        uid: "gemini-bot",
        isBot: true,
      };

      const updated = [...get().messages, botMessage];
      set({
        messages: updated,
        isGeminiTyping: false,
      });

      if (get().soundEnabled) {
        playChime("receive");
      }

      try {
        sessionStorage.setItem(
          LOCAL_CACHE_STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch {}

      setTimeout(() => {
        if (scrollRef?.current) {
          scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);

      try {
        await addDoc(collection(db, "messages"), {
          text: responseText,
          name: "Gemini AI",
          avatar:
            "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
          createdAt: serverTimestamp(),
          uid: "gemini-bot",
          isBot: true,
        });
      } catch (err: any) {
        console.debug("Firestore bot message notice:", err?.message);
      }
    } catch (e) {
      console.error("Gemini invocation failed:", e);
      set({ isGeminiTyping: false });
    }
  },
}));
