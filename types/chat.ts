import type { Message } from 'ai';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export type AppLanguage = 'id' | 'en';

export const SESSIONS_STORAGE_KEY = 'fe06_capstone_chat_threads';
export const ACTIVE_SESSION_STORAGE_KEY = 'fe06_capstone_active_thread_id';
export const LANGUAGE_STORAGE_KEY = 'fe06_capstone_language_preference';

export const I18N_DICTIONARY = {
  id: {
    appTitle: 'FlyRank Streaming Studio',
    subtitle: 'FE-06 Capstone',
    newThread: 'Percakapan Baru',
    newThreadShort: '+ Baru',
    searchPlaceholder: 'Cari percakapan...',
    historyTitle: 'Riwayat Chat',
    threadsCount: 'thread',
    turnsCount: 'pesan',
    emptyThreads: 'Belum ada percakapan ditemukan.',
    renameThread: 'Ubah judul',
    deleteThread: 'Hapus percakapan',
    confirmDelete: 'Hapus percakapan ini?',
    confirmClear: 'Bersihkan semua pesan dalam percakapan ini?',
    localSynced: 'Sesi Tersimpan Lokal',
    hideSidebar: 'Sembunyikan Sidebar (Ctrl+B)',
    showSidebar: 'Tampilkan Sidebar (Ctrl+B)',
    clearChat: 'Bersihkan',
    inputPlaceholder: 'Tanyakan topik frontend atau arsitektur streaming... (Enter untuk kirim)',
    enterToSend: 'kirim',
    shiftEnterNewline: 'baris baru',
    mobileTapHint: 'Tekan Kirim atau Berhenti',
    autoScrollPinned: 'Auto-scroll aktif',
    autoScrollUnpinned: 'Auto-scroll lepas',
    jumpToLatest: 'Ke pesan terbaru',
    newPill: 'Baru',
    copy: 'Salin',
    copied: 'Tersalin',
    retry: 'Ulangi',
    thinking: 'Memproses jawaban',
    streaming: 'mengalirkan respons...',
    streamIssue: 'Koneksi stream mengalami gangguan.',
    tryAgain: 'Coba lagi',
    heroTitle: 'Asisten Rekayasa Frontend AI',
    heroSubtitle: 'Platform evaluasi interaktif FE-06 untuk FlyRank: Token-by-token streaming, auto-scroll pinning, dan persistent threads.',
    quickPromptsLabel: 'Contoh Pertanyaan Cepat:',
    quickPrompts: [
      'Bagaimana cara kerja scroll pinning saat streaming token?',
      'Jelaskan kenapa tombol stop adalah masalah state, bukan UI.',
      'Contoh arsitektur TypeScript dengan discriminated unions.',
      'Apa keunggulan React 19 useActionState dibanding useState?',
    ],
  },
  en: {
    appTitle: 'FlyRank Streaming Studio',
    subtitle: 'FE-06 Capstone',
    newThread: 'New Conversation',
    newThreadShort: '+ New',
    searchPlaceholder: 'Search conversations...',
    historyTitle: 'Conversations',
    threadsCount: 'threads',
    turnsCount: 'turns',
    emptyThreads: 'No conversations found.',
    renameThread: 'Rename thread',
    deleteThread: 'Delete thread',
    confirmDelete: 'Delete this conversation?',
    confirmClear: 'Clear all messages in this conversation?',
    localSynced: 'Locally Synced',
    hideSidebar: 'Hide Sidebar (Ctrl+B)',
    showSidebar: 'Show Sidebar (Ctrl+B)',
    clearChat: 'Clear',
    inputPlaceholder: 'Ask a frontend engineering or streaming question... (Enter to send)',
    enterToSend: 'to send',
    shiftEnterNewline: 'for newline',
    mobileTapHint: 'Tap Send or Stop',
    autoScrollPinned: 'Auto-scroll pinned',
    autoScrollUnpinned: 'Auto-scroll released',
    jumpToLatest: 'Jump to latest',
    newPill: 'New',
    copy: 'Copy',
    copied: 'Copied',
    retry: 'Retry',
    thinking: 'Thinking',
    streaming: 'streaming response...',
    streamIssue: 'Stream connection interrupted.',
    tryAgain: 'Retry',
    heroTitle: 'Frontend AI Engineering Assistant',
    heroSubtitle: 'FE-06 Capstone evaluation platform for FlyRank: Token-by-token streaming, auto-scroll pinning, and persistent multi-thread history.',
    quickPromptsLabel: 'Suggested Reviewer Prompts:',
    quickPrompts: [
      'How does 50px auto-scroll pinning work in high-speed streaming?',
      'Explain why the stop button is a state problem, not a UI problem.',
      'Provide a strict TypeScript schema with discriminated unions.',
      'Compare React 19 useActionState against traditional useEffect data fetching.',
    ],
  },
} as const;
