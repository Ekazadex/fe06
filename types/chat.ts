import type { Message } from 'ai';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export type AppLanguage = 'en' | 'id';

export const SESSIONS_STORAGE_KEY = 'flyrank_audit_sessions';
export const ACTIVE_SESSION_STORAGE_KEY = 'flyrank_active_audit_id';
export const LANGUAGE_STORAGE_KEY = 'flyrank_audit_lang_pref';

export const I18N_DICTIONARY = {
  en: {
    appTitle: 'FlyRank System Auditor',
    subtitle: 'Scenario B • Code & Security Auditor',
    newAudit: 'New Audit',
    newAuditShort: '+ Audit',
    newThread: 'New Audit',
    newThreadShort: '+ Audit',
    searchPlaceholder: 'Search audit logs...',
    historyTitle: 'Audit Logs',
    threadsCount: 'sessions',
    turnsCount: 'inspections',
    emptyThreads: 'No previous audit logs found.',
    renameAudit: 'Rename session',
    deleteAudit: 'Delete session',
    renameThread: 'Rename session',
    deleteThread: 'Delete session',
    confirmDelete: 'Are you sure you want to delete this audit record?',
    confirmClear: 'Clear all inspections and messages in this session?',
    localSynced: 'Local Storage Synced',
    hideSidebar: 'Hide History Panel (Ctrl+B)',
    showSidebar: 'Show History Panel (Ctrl+B)',
    clearChat: 'Clear Audit',
    inputPlaceholder: 'Paste code or prompt for W3C ARIA, performance, or vulnerability audit...',
    enterToSend: 'analyze',
    shiftEnterNewline: 'newline',
    mobileTapHint: 'Tap Analyze or Stop',
    autoScrollPinned: 'Stream Pinned',
    autoScrollUnpinned: 'Scroll Released',
    jumpToLatest: 'Jump to latest findings',
    newPill: 'New Report',
    copy: 'Copy',
    copied: 'Copied',
    retry: 'Re-audit',
    thinking: 'Scanning AST & evaluating security compliance',
    streaming: 'Streaming Audit Report...',
    streamIssue: 'Stream connectivity interrupted during audit.',
    tryAgain: 'Retry Audit',
    heroTitle: 'Multi-Functional System Auditor & Code Analyzer',
    heroSubtitle: 'Deep static analysis, W3C accessibility compliance, memory leak detection, and zero-trust vulnerability reporting.',
    quickPromptsLabel: 'Preset Audit Scenarios:',
    quickPrompts: [
      'Audit this React 19 component for memory leaks, unclosed listeners, and render thrashing.',
      'Analyze this markup against W3C WCAG 2.1 AA / ARIA standards with remediations.',
      'Perform a zero-trust AST security review for XSS, prototype pollution, and SSRF flaws.',
      'Evaluate this Next.js 15 Server Action for authorization bypass and CSRF vectors.',
    ],
  },
  id: {
    appTitle: 'Auditor Sistem FlyRank',
    subtitle: 'Skenario B • Auditor Kode & Keamanan',
    newAudit: 'Audit Baru',
    newAuditShort: '+ Audit',
    newThread: 'Audit Baru',
    newThreadShort: '+ Audit',
    searchPlaceholder: 'Cari log audit...',
    historyTitle: 'Log Audit',
    threadsCount: 'sesi',
    turnsCount: 'inspeksi',
    emptyThreads: 'Belum ada log audit yang tersimpan.',
    renameAudit: 'Ubah nama sesi',
    deleteAudit: 'Hapus sesi audit',
    renameThread: 'Ubah nama sesi',
    deleteThread: 'Hapus sesi audit',
    confirmDelete: 'Hapus rekaman audit ini secara permanen?',
    confirmClear: 'Bersihkan seluruh temuan dan pesan di sesi audit ini?',
    localSynced: 'Penyimpanan Lokal Tersinkron',
    hideSidebar: 'Sembunyikan Panel Riwayat (Ctrl+B)',
    showSidebar: 'Tampilkan Panel Riwayat (Ctrl+B)',
    clearChat: 'Bersihkan Audit',
    inputPlaceholder: 'Tempel kode atau tanyakan evaluasi W3C ARIA, performa, atau celah keamanan...',
    enterToSend: 'analisis',
    shiftEnterNewline: 'baris baru',
    mobileTapHint: 'Tekan Analisis atau Berhenti',
    autoScrollPinned: 'Layar Terkunci',
    autoScrollUnpinned: 'Kunci Layar Lepas',
    jumpToLatest: 'Ke temuan terbaru',
    newPill: 'Temuan Baru',
    copy: 'Salin',
    copied: 'Tersalin',
    retry: 'Audit Ulang',
    thinking: 'Memindai AST & menganalisis kepatuhan keamanan',
    streaming: 'Mengalirkan Laporan Audit...',
    streamIssue: 'Koneksi terputus saat transmisi laporan audit.',
    tryAgain: 'Coba Lagi',
    heroTitle: 'Auditor Sistem & Analis Kode Multifungsi',
    heroSubtitle: 'Analisis statis mendalam, kepatuhan aksesibilitas W3C, deteksi kebocoran memori, dan laporan kerentanan zero-trust.',
    quickPromptsLabel: 'Skenario Audit Siap Uji:',
    quickPrompts: [
      'Audit komponen React 19 ini untuk potensi memory leak, event listener menggantung, dan render thrashing.',
      'Analisis markup ini terhadap standar aksesibilitas W3C WCAG 2.1 AA / ARIA beserta perbaikannya.',
      'Lakukan review keamanan zero-trust AST untuk celah XSS, prototype pollution, dan SSRF.',
      'Evaluasi Server Action Next.js 15 ini dari risiko bypass otorisasi dan serangan CSRF.',
    ],
  },
} as const;
