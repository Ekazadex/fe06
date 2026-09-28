import type { Message } from 'ai';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export type AppLanguage = 'en' | 'id';

export const SESSIONS_STORAGE_KEY = 'universal_tech_companion_sessions';
export const ACTIVE_SESSION_STORAGE_KEY = 'universal_tech_companion_active_id';
export const LANGUAGE_STORAGE_KEY = 'universal_tech_companion_lang_pref';

export const I18N_DICTIONARY = {
  id: {
    appTitle: 'Universal Tech Companion',
    subtitle: 'Asisten IT & Pemrograman Cerdas',
    newChat: 'Percakapan Baru',
    newChatShort: 'Baru',
    newThread: 'Percakapan Baru',
    newThreadShort: 'Baru',
    searchPlaceholder: 'Cari percakapan...',
    historyTitle: 'Riwayat Percakapan',
    threadsCount: 'sesi',
    turnsCount: 'pesan',
    emptyThreads: 'Belum ada riwayat percakapan.',
    renameChat: 'Ubah judul',
    deleteChat: 'Hapus percakapan',
    renameThread: 'Ubah judul',
    deleteThread: 'Hapus percakapan',
    confirmDelete: 'Hapus percakapan ini secara permanen?',
    confirmClear: 'Bersihkan semua pesan dalam percakapan ini?',
    localSynced: 'Tersimpan Lokal',
    hideSidebar: 'Sembunyikan Sidebar (Ctrl+B)',
    showSidebar: 'Tampilkan Sidebar (Ctrl+B)',
    clearChat: 'Bersihkan Chat',
    inputPlaceholder: 'Tanyakan konsep, kode, atau error... (Enter untuk kirim)',
    enterToSend: 'kirim',
    shiftEnterNewline: 'baris baru',
    mobileTapHint: 'Tekan Kirim atau Berhenti',
    autoScrollPinned: 'Auto-scroll aktif',
    autoScrollUnpinned: 'Scroll dilepas',
    jumpToLatest: 'Ke pesan terbaru',
    newPill: 'Pesan Baru',
    copy: 'Salin',
    copied: 'Tersalin',
    retry: 'Ulangi',
    thinking: 'Sedang berpikir & menganalisis',
    streaming: 'mengetik respons...',
    streamIssue: 'Koneksi ke AI terputus. Silakan coba lagi.',
    tryAgain: 'Coba Lagi',
    heroTitle: 'Universal Tech Companion',
    heroSubtitle: 'Asisten cerdas untuk semua kebutuhan IT Anda. Tanyakan konsep, minta perbaiki error, atau suruh saya menulis kode untuk Anda.',
    quickPromptsLabel: 'Coba tanyakan ini:',
    quickPrompts: [
      'Buatkan komponen Card modern dengan Tailwind CSS.',
      'Jelaskan konsep React Hooks dengan analogi sederhana.',
      'Tolong bantu perbaiki error hydration di Next.js.',
      'Buatkan fungsi JavaScript untuk memfilter array of objects.',
    ],
  },
  en: {
    appTitle: 'Universal Tech Companion',
    subtitle: 'Your Smart IT & Coding Assistant',
    newChat: 'New Conversation',
    newChatShort: 'New',
    newThread: 'New Conversation',
    newThreadShort: 'New',
    searchPlaceholder: 'Search conversations...',
    historyTitle: 'Conversations',
    threadsCount: 'sessions',
    turnsCount: 'messages',
    emptyThreads: 'No conversations found.',
    renameChat: 'Rename conversation',
    deleteChat: 'Delete conversation',
    renameThread: 'Rename conversation',
    deleteThread: 'Delete conversation',
    confirmDelete: 'Permanently delete this conversation?',
    confirmClear: 'Clear all messages in this conversation?',
    localSynced: 'Locally Synced',
    hideSidebar: 'Hide Sidebar (Ctrl+B)',
    showSidebar: 'Show Sidebar (Ctrl+B)',
    clearChat: 'Clear Chat',
    inputPlaceholder: 'Ask a concept, code question, or error... (Enter to send)',
    enterToSend: 'to send',
    shiftEnterNewline: 'for newline',
    mobileTapHint: 'Tap Send or Stop',
    autoScrollPinned: 'Auto-scroll pinned',
    autoScrollUnpinned: 'Scroll released',
    jumpToLatest: 'Jump to latest',
    newPill: 'New Tokens',
    copy: 'Copy',
    copied: 'Copied',
    retry: 'Retry',
    thinking: 'Thinking & analyzing your query',
    streaming: 'streaming response...',
    streamIssue: 'Stream interrupted. Please try again.',
    tryAgain: 'Retry',
    heroTitle: 'Universal Tech Companion',
    heroSubtitle: 'Your intelligent assistant for all tech and programming needs. Clarify concepts, fix tricky bugs, or generate modern production code on demand.',
    quickPromptsLabel: 'Try asking one of these:',
    quickPrompts: [
      'Build a modern Card component using Tailwind CSS.',
      'Explain React Hooks with a simple, everyday analogy.',
      'Help me debug a Next.js hydration mismatch error.',
      'Write a clean JavaScript utility to filter an array of objects.',
    ],
  },
} as const;
