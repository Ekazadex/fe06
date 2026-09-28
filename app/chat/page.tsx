"use client";

import React, { useState, useEffect, useCallback } from 'react';
import StreamingChat from '@/components/StreamingChat';
import ChatSidebar from '@/components/ChatSidebar';
import type { ChatSession, AppLanguage } from '@/types/chat';
import {
  SESSIONS_STORAGE_KEY,
  ACTIVE_SESSION_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
  I18N_DICTIONARY,
} from '@/types/chat';
import type { Message } from 'ai';
import {
  Plus,
  Terminal,
  PanelLeftClose,
  PanelLeft,
  Trash2,
  Globe,
} from 'lucide-react';

function createNewSession(lang: AppLanguage): ChatSession {
  const now = Date.now();
  return {
    id: `audit_${now}_${Math.random().toString(36).substring(2, 7)}`,
    title: lang === 'id' ? 'Sesi Audit Baru' : 'New Audit Session',
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export default function ChatPage() {
  const [lang, setLang] = useState<AppLanguage>(() => {
    if (typeof window === 'undefined') return 'en';
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'en' || stored === 'id') return stored;
    } catch {
      // fallback
    }
    return 'en';
  });

  const t = I18N_DICTIONARY[lang];

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window === 'undefined') return [createNewSession('en')];
    try {
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [createNewSession('en')];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    if (typeof window === 'undefined') return sessions[0]?.id || '';
    try {
      const savedActive = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
      if (savedActive && sessions.some((s) => s.id === savedActive)) {
        return savedActive;
      }
    } catch {
      // fallback
    }
    return sessions[0]?.id || '';
  });

  // Track chat reset counter to cleanly remount chat without recursive state updates
  const [chatResetKey, setChatResetKey] = useState<number>(0);

  // On desktop/tablet (width >= 768px), sidebar defaults to open. On mobile, defaults to closed.
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 768;
  });

  const toggleLanguage = () => {
    const nextLang: AppLanguage = lang === 'en' ? 'id' : 'en';
    setLang(nextLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
    } catch {
      // ignore
    }
  };

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync sessions to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && sessions.length > 0) {
      try {
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      } catch (err) {
        console.error('Failed to sync audit sessions to localStorage:', err);
      }
    }
  }, [sessions]);

  // Sync activeSessionId to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && activeSessionId) {
      try {
        localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, activeSessionId);
      } catch (err) {
        console.error('Failed to sync active session ID to localStorage:', err);
      }
    }
  }, [activeSessionId]);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Callback to update messages for a specific session with strict bailout guard
  const handleUpdateSessionMessages = useCallback(
    (sessionId: string, newMessages: Message[]) => {
      setSessions((prev) => {
        const target = prev.find((s) => s.id === sessionId);
        if (!target) return prev;

        // Bail out if messages are identical to break any recursive render cycles
        if (target.messages === newMessages) return prev;
        if (
          target.messages.length === newMessages.length &&
          target.messages.every(
            (m, i) =>
              m.id === newMessages[i]?.id &&
              m.content === newMessages[i]?.content &&
              m.role === newMessages[i]?.role
          )
        ) {
          return prev;
        }

        // Auto-generate title from the first user message if title is default
        let title = target.title;
        if (
          (title === 'New Audit Session' ||
            title === 'Sesi Audit Baru' ||
            title === 'Percakapan Baru' ||
            title === 'New Conversation' ||
            !title) &&
          newMessages.length > 0
        ) {
          const firstUserMsg = newMessages.find((m) => m.role === 'user');
          if (firstUserMsg && firstUserMsg.content) {
            title =
              firstUserMsg.content.slice(0, 32) +
              (firstUserMsg.content.length > 32 ? '...' : '');
          }
        }

        return prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                title,
                updatedAt: Date.now(),
                messages: newMessages,
              }
            : s
        );
      });
    },
    []
  );

  const handleNewSession = () => {
    const fresh = createNewSession(lang);
    setSessions((prev) => [fresh, ...prev]);
    setActiveSessionId(fresh.id);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      if (remaining.length === 0) {
        const fresh = createNewSession(lang);
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const handleClearCurrentChat = () => {
    if (window.confirm(t.confirmClear)) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? { ...s, messages: [], updatedAt: Date.now() }
            : s
        )
      );
      setChatResetKey((k) => k + 1);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#08090E] text-slate-100 flex overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Persistent Left Sidebar for Chat Threads */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSession?.id || ''}
        isOpen={isSidebarOpen}
        lang={lang}
        onClose={() => setIsSidebarOpen(false)}
        onSelectSession={(id) => setActiveSessionId(id)}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
      />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 sm:h-15 border-b border-[#1A1F2E] bg-[#0C0E15]/95 px-3 sm:px-6 flex items-center justify-between backdrop-blur-md z-20 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {/* Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              title={isSidebarOpen ? t.hideSidebar : t.showSidebar}
              aria-label={isSidebarOpen ? t.hideSidebar : t.showSidebar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors border border-transparent hover:border-slate-700/50"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              ) : (
                <PanelLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
              )}
            </button>

            {/* Thread Title & Scenario B Badge */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[170px] sm:max-w-xs md:max-w-md">
                  {activeSession?.title || t.newAudit}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Terminal className="w-2.5 h-2.5" />
                  Scenario B • Auditor
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Action Items */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Language Switcher (EN / ID) */}
            <button
              type="button"
              onClick={toggleLanguage}
              title={lang === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'}
              aria-label="Toggle language"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#121622] hover:bg-[#1A2030] border border-[#20273D] text-xs font-mono transition-colors shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-white">
                {lang === 'en' ? 'EN' : 'ID'}
              </span>
              <span className="text-[10px] text-slate-400">
                /{lang === 'en' ? 'ID' : 'EN'}
              </span>
            </button>

            {/* Clear Chat Button */}
            {activeSession && activeSession.messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearCurrentChat}
                title={t.clearChat}
                aria-label={t.clearChat}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 text-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearChat}</span>
              </button>
            )}

            {/* Quick New Audit Button */}
            <button
              type="button"
              onClick={handleNewSession}
              title={t.newAudit}
              aria-label={t.newAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t.newAuditShort}</span>
            </button>
          </div>
        </header>

        {/* Streaming Conversation Body */}
        <main className="flex-1 min-h-0 overflow-hidden relative">
          {activeSession && (
            <StreamingChat
              key={`${activeSession.id}_${chatResetKey}`}
              session={activeSession}
              lang={lang}
              onUpdateSessionMessages={handleUpdateSessionMessages}
            />
          )}
        </main>
      </div>
    </div>
  );
}
