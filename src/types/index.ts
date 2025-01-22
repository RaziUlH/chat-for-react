export interface ChatMessage {
  id: string;
  text: string;
  name?: string;
  avatar?: string;
  createdAt?: { seconds: number; [key: string]: any } | any;
  uid?: string;
  isBot?: boolean;
}

export interface AppUser {
  uid: string;
  displayName: string | null;
  photoURL?: string | null;
  email?: string | null;
}

export interface GeminiModelInfo {
  id: string;
  name: string;
  tag: string;
  desc: string;
}

export type KeyTestStatus = "idle" | "testing" | "valid" | "invalid";
