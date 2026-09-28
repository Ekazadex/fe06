'use client';

import React, { useState } from 'react';
import type { ChatSession, AppLanguage } from '@/types/chat';
import { I18N_DICTIONARY } from '@/types/chat';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Terminal,
  PanelLeftClose,
} from 'lucide-react';

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  isOpen: boolean;
  lang: AppLanguage;
  onClose: () => void;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, title: string) => void;
}

function formatRelativeTime(timestamp: number, lang: AppLanguage): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return lang === 'id' ? 'Baru saja' : 'Just now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function ChatSidebar({
  sessions,
  activeSessionId,
  isOpen,
  lang,
  onClose,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const t = I18N_DICTIONARY[lang];

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEditing = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(s.id);
    setEditingTitle(s.title);
  };

  const saveEditing = (id: string, e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.stopPropagation();
    if (editingTitle.trim()) {
      onRenameSession(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.confirmDelete)) {
      onDeleteSession(id);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (< 768px) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Responsive for Mobile, Tablet, and Desktop */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col bg-[#0C0E14] border-r border-[#1B202E] transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-72 sm:w-80 translate-x-0 opacity-100'
            : '-translate-x-full md:translate-x-0 md:w-0 md:border-none md:overflow-hidden md:opacity-0 pointer-events-none md:pointer-events-auto'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-[#1B202E] flex items-center justify-between min-w-[280px]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white tracking-tight">{t.appTitle}</span>
              <p className="text-[10px] text-slate-400 font-mono">{t.subtitle}</p>
            </div>
          </div>

          {/* Close Sidebar Button */}
          <button
            type="button"
            onClick={onClose}
            title={t.hideSidebar}
            aria-label={t.hideSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Action: New Chat Button & Search Bar */}
        <div className="p-3 min-w-[280px]">
          <button
            type="button"
            onClick={() => {
              onNewSession();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-950/40 transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>{t.newThread}</span>
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-700/60 text-indigo-200">
              {t.newThreadShort}
            </kbd>
          </button>

          {/* Search Bar when there are multiple threads */}
          {sessions.length > 2 && (
            <div className="relative mt-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-[#121622] border border-[#1E2536] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Thread History List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 min-w-[280px]">
          <div className="px-2 py-1.5 text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{t.historyTitle}</span>
            <span className="font-mono text-[10px]">{sessions.length} {t.threadsCount}</span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              {t.emptyThreads}
            </div>
          ) : (
            filteredSessions.map((s) => {
              const isActive = s.id === activeSessionId;
              const isEditing = s.id === editingId;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                    isActive
                      ? 'bg-[#181D2B] text-white border border-indigo-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-[#131722] hover:text-white border border-transparent'
                  }`}
                >
                  {isEditing ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveEditing(s.id);
                      }}
                      className="flex items-center gap-1.5 w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        autoFocus
                        className="flex-1 bg-slate-900 border border-indigo-500 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={(e) => saveEditing(s.id, e)}
                        className="text-emerald-400 hover:text-emerald-300 p-0.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="text-slate-400 hover:text-slate-200 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <MessageSquare
                          className={`w-3.5 h-3.5 flex-shrink-0 ${
                            isActive ? 'text-indigo-400' : 'text-slate-400'
                          }`}
                        />
                        <div className="truncate flex-1">
                          <p className="truncate font-medium">{s.title}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                            <span>{s.messages.length} {t.turnsCount}</span>
                            <span>•</span>
                            <span>{formatRelativeTime(s.updatedAt || s.createdAt, lang)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions: Rename / Delete */}
                      <div
                        className={`flex items-center gap-1 ml-2 transition-opacity ${
                          isActive
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(e) => startEditing(s, e)}
                          title={t.renameThread}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(s.id, e)}
                          title={t.deleteThread}
                          className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Clean Sidebar Footer */}
        <div className="p-3 border-t border-[#1B202E] bg-[#0A0C12] min-w-[280px]">
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t.localSynced}
            </span>
            <span>{sessions.length} {t.threadsCount}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
