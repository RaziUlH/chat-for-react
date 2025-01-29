import React from "react";
import NavBar from "./components/NavBar";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import { useAuth } from "./hooks/useChatHooks";

export const App: React.FC = () => {
  const { user, isAuthenticated, authLoading } = useAuth();

  return (
    <div className="flex flex-col w-full h-screen bg-slate-900 text-white overflow-hidden">
      <NavBar />
      {authLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Connecting to React Chat...</p>
        </div>
      ) : isAuthenticated ? (
        <ChatBox currentUser={user} />
      ) : (
        <Welcome />
      )}
    </div>
  );
};

export default App;
