'use client';

import React, {
  useRef,
  useEffect,
  useState,
  type UIEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useChat, type Message } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import {
  User,
  Bot,
  Send,
  Square,
  ArrowDown,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import type { ChatSession, AppLanguage } from '@/types/chat';
import { I18N_DICTIONARY } from '@/types/chat';

/**
 * Pre-processes streaming markdown to temporarily close any dangling code fences
 * (```) during active token generation so code blocks don't flicker or break layout.
 */
function preprocessStreamingMarkdown(rawContent: string): string {
  if (!rawContent) return '';
  const fences = rawContent.match(/(?:^|\n)```/g);
  const count = fences ? fences.length : 0;
  if (count % 2 !== 0) {
    return `${rawContent}\n\`\`\``;
  }
  return rawContent;
}

interface StreamingChatProps {
  session: ChatSession;
  lang: AppLanguage;
  onUpdateSessionMessages: (sessionId: string, messages: Message[]) => void;
  onOpenSidebar?: () => void;
}

export default function StreamingChat({
  session,
  lang,
  onUpdateSessionMessages,
}: StreamingChatProps) {
  const t = I18N_DICTIONARY[lang];

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll pinning state: strictly true only when user was within 50px of bottom
  const isPinnedRef = useRef<boolean>(true);
  const [showJumpToBottom, setShowJumpToBottom] = useState<boolean>(false);
  const [unreadTokensDuringScroll, setUnreadTokensDuringScroll] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    setMessages,
    error,
  } = useChat({
    initialMessages: session.messages,
    id: session.id,
    onFinish: (message) => {
      onUpdateSessionMessages(session.id, [...messages, message]);
    },
  });

  // Keep useChat synchronized if user switches threads via sidebar
  useEffect(() => {
    setMessages(session.messages);
    isPinnedRef.current = true;
    setShowJumpToBottom(false);
    setUnreadTokensDuringScroll(0);
  }, [session.id]);

  // Synchronize messages back to parent session storage whenever message list updates
  useEffect(() => {
    if (messages.length > 0) {
      onUpdateSessionMessages(session.id, messages);
    }
  }, [messages, session.id]);

  // Robust Auto-Scroll: Track scroll position with strict 50px buffer threshold
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    const atBottom = distanceFromBottom < 50;
    isPinnedRef.current = atBottom;
    setShowJumpToBottom(!atBottom);

    if (atBottom) {
      setUnreadTokensDuringScroll(0);
    }
  };

  // Perform scroll pinned to bottom during token arrivals
  useEffect(() => {
    if (isPinnedRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (isLoading && !isPinnedRef.current) {
      setUnreadTokensDuringScroll((prev) => prev + 1);
    }
  }, [messages, isLoading]);

  // Jump to latest message action
  const handleJumpToBottom = () => {
    isPinnedRef.current = true;
    setShowJumpToBottom(false);
    setUnreadTokensDuringScroll(0);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Submit handler: re-activates bottom pin for fresh queries
  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    isPinnedRef.current = true;
    setShowJumpToBottom(false);
    setUnreadTokensDuringScroll(0);
    handleSubmit(e);
  };

  // Stop button handler: halts stream, persists partial message, re-enables textarea
  const handleStop = () => {
    stop();
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  // Copy message text to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Thinking indicator condition: active ONLY before the first assistant token arrives
  const isThinking =
    isLoading &&
    messages.length > 0 &&
    messages[messages.length - 1].role === 'user';

  return (
    <div className="relative flex flex-col h-full w-full bg-[#08090E] text-slate-100 overflow-hidden font-sans">
      {/* Scroll Viewport for Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        tabIndex={0}
        role="log"
        aria-live="polite"
        aria-label="Conversation feed"
        className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6 focus:outline-none"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[380px] h-full max-w-2xl mx-auto text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-950/30">
              <Sparkles className="w-6 h-6" />
            </div>

            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white">
              {t.heroTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Quick Test Starter Prompts */}
            <div className="w-full mt-6 space-y-2 text-left">
              <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider px-1">
                {t.quickPromptsLabel}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {t.quickPrompts.map((promptText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const pseudoEvent = {
                        target: { value: promptText },
                      } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
                      handleInputChange(pseudoEvent);
                      textareaRef.current?.focus();
                    }}
                    className="p-3 rounded-xl bg-[#0F121C] hover:bg-[#161B29] border border-[#1A2030] hover:border-indigo-500/40 text-xs text-slate-300 text-left transition-all hover:translate-y-[-1px] group flex flex-col justify-between"
                  >
                    <span className="line-clamp-2 leading-relaxed">{promptText}</span>
                    <span className="flex items-center gap-1 text-[11px] text-indigo-400 font-mono mt-2 opacity-75 group-hover:opacity-100">
                      <span>{lang === 'id' ? 'Coba tanyakan' : 'Test prompt'}</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              const isLastMessage = index === messages.length - 1;

              return (
                <div
                  key={message.id || index}
                  className={`flex items-start gap-2.5 sm:gap-3.5 group ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-medium shadow-sm transition-transform ${
                      isUser
                        ? 'bg-indigo-600 text-white shadow-indigo-950/40'
                        : 'bg-[#141824] text-indigo-400 border border-[#20273D]'
                    }`}
                    aria-hidden="true"
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble Container */}
                  <div
                    className={`relative max-w-[92%] sm:max-w-[85%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm shadow-sm transition-all ${
                      isUser
                        ? 'bg-[#181E33] border border-indigo-500/40 text-indigo-50 rounded-tr-sm selection:bg-indigo-500 selection:text-white'
                        : 'bg-[#0E1119] border border-[#1C2234] text-slate-200 rounded-tl-sm'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    ) : (
                      <div className="prose prose-invert prose-sm sm:prose-base max-w-none break-words leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_code]:font-mono [&_code]:text-indigo-300 [&_code]:bg-[#141926] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-[#07090E] [&_pre]:border [&_pre]:border-[#1B2133] [&_pre]:p-3 [&_pre]:rounded-xl">
                        <ReactMarkdown>
                          {preprocessStreamingMarkdown(message.content)}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* Assistant Message Metadata & Actions */}
                    {!isUser && (
                      <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#181E30] text-[11px] text-slate-400">
                        <div className="flex items-center gap-2">
                          {isLoading && isLastMessage ? (
                            <span className="flex items-center gap-1.5 text-indigo-400 font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                              {t.streaming}
                            </span>
                          ) : (
                            <span className="font-mono text-slate-400">
                              Turn #{Math.floor(index / 2) + 1}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleCopy(message.id, message.content)}
                            title={t.copy}
                            aria-label={t.copy}
                            className="hover:text-slate-200 p-1 rounded hover:bg-slate-800/60 transition-colors flex items-center gap-1"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden sm:inline text-[10px]">
                              {copiedId === message.id ? t.copied : t.copy}
                            </span>
                          </button>

                          {isLastMessage && !isLoading && (
                            <button
                              type="button"
                              onClick={() => reload()}
                              title={t.retry}
                              aria-label={t.retry}
                              className="hover:text-slate-200 p-1 rounded hover:bg-slate-800/60 transition-colors flex items-center gap-1"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline text-[10px]">{t.retry}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Seamless Thinking Indicator */}
        {isThinking && (
          <div className="max-w-3xl mx-auto flex items-start gap-2.5 sm:gap-3.5 transition-opacity duration-200">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-[#141824] text-indigo-400 border border-[#20273D] shadow-sm"
              aria-hidden="true"
            >
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#0E1119] border border-[#1C2234] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-3 text-slate-400 text-xs sm:text-sm shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <div className="flex items-center gap-1.5 font-mono">
                <span className="font-medium text-slate-300">{t.thinking}</span>
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Streaming Error Display */}
        {error && (
          <div
            role="alert"
            className="max-w-3xl mx-auto flex items-center justify-between p-3.5 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error.message || t.streamIssue}</span>
            </div>
            <button
              type="button"
              onClick={() => reload()}
              className="px-3 py-1 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-medium transition-colors"
            >
              {t.tryAgain}
            </button>
          </div>
        )}

        {/* Scroll Pin Anchor */}
        <div ref={messagesEndRef} className="h-px w-full" aria-hidden="true" />
      </div>

      {/* Floating "Jump to latest" Button */}
      {showJumpToBottom && (
        <button
          type="button"
          onClick={handleJumpToBottom}
          aria-label={t.jumpToLatest}
          className="absolute bottom-22 sm:bottom-24 right-4 sm:right-8 z-30 flex items-center gap-2 px-3.5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-2xl transition-all active:scale-95 border border-indigo-400/30 animate-bounce"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>{t.jumpToLatest}</span>
          {unreadTokensDuringScroll > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white text-indigo-700 text-[10px] font-bold">
              {t.newPill}
            </span>
          )}
        </button>
      )}

      {/* Input Dock & Action Controls */}
      <footer className="p-3 sm:p-4 bg-[#090B10]/95 border-t border-[#181D2B] backdrop-blur-md">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={onFormSubmit}
            className="flex items-end gap-2 relative bg-[#0E121D] border border-[#1C2337] focus-within:border-indigo-500/70 rounded-2xl p-1.5 sm:p-2 transition-all shadow-lg"
          >
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isLoading) {
                      const form = e.currentTarget.form;
                      if (form) form.requestSubmit();
                    }
                  }
                }}
                placeholder={t.inputPlaceholder}
                rows={1}
                aria-label="Input prompt"
                disabled={isLoading && !isThinking}
                className="w-full resize-none bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed max-h-36 leading-relaxed"
              />
            </div>

            {/* Dynamic Send / Stop Button */}
            {isLoading ? (
              <button
                type="button"
                onClick={handleStop}
                aria-label="Stop generation"
                title="Stop generation (partial text preserved)"
                className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 transition-all active:scale-95 group shadow-sm"
              >
                <Square className="w-4 h-4 fill-rose-400 text-rose-400 group-hover:scale-110 transition-transform" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                title="Send message (Enter)"
                className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#151926] disabled:text-slate-400 text-white transition-all active:scale-95 disabled:active:scale-100 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Micro Status Bar */}
          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400 font-mono">
            <span className="hidden sm:inline">
              <kbd className="px-1 py-0.5 bg-slate-800 rounded text-[10px]">Enter</kbd> {t.enterToSend}, <kbd className="px-1 py-0.5 bg-slate-800 rounded text-[10px]">Shift+Enter</kbd> {t.shiftEnterNewline}
            </span>
            <span className="sm:hidden text-[10px]">{t.mobileTapHint}</span>

            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full ${isPinnedRef.current ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {isPinnedRef.current ? t.autoScrollPinned : t.autoScrollUnpinned}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
