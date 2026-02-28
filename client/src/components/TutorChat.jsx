import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { getChatHistory, sendChatMessage, assessChatSession } from '../api';
import {
  GraduationCap,
  Send,
  BarChart3,
  MessageSquare,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function TutorChat({
  courseId,
  chapterId,
  chapterTitle,
  onAssessmentComplete,
  onFirstMessage,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = [
    `Explain the key ideas of "${chapterTitle}" like I'm a complete beginner`,
    'Can you give me a real-world example of this?',
    'What are common mistakes people make here?',
    'Quiz me informally — ask me a few questions to test my understanding',
    "There's something I don't quite get — can you help?",
  ];

  useEffect(() => {
    (async () => {
      try {
        const data = await getChatHistory(courseId, chapterId);
        setMessages(data.messages || []);
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
      setLoaded(true);
    })();
  }, [courseId, chapterId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || sending) return;
    setInput('');

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [...prev, { _id: tempId, role: 'user', content }]);
    setSending(true);

    if (messages.length === 0 && onFirstMessage) onFirstMessage();

    try {
      const data = await sendChatMessage(courseId, chapterId, content);
      setMessages((prev) => [
        ...prev.filter((m) => m._id !== tempId),
        data.userMessage,
        data.assistantMessage,
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          _id: `err-${Date.now()}`,
          role: 'assistant',
          content: '⚠️ Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const runAssessment = async () => {
    setAssessing(true);
    try {
      const data = await assessChatSession(courseId, chapterId);
      setAssessment(data);
      if (onAssessmentComplete) onAssessmentComplete(data);
    } catch (e) {
      console.error('Assessment failed:', e);
    }
    setAssessing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-gray-700 border-t-amber-400 animate-spin" />
        <p className="text-sm text-gray-500">Loading chat…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-950">
      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Empty state */}
        {messages.length === 0 && !sending && (
          <div className="max-w-lg mx-auto text-center py-4">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <GraduationCap size={28} className="text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-1">
              Your AI Tutor is ready
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              I've studied this chapter so you can ask me anything — concepts,
              examples, practice questions, or anything you're unsure about.
            </p>
            <div className="space-y-2 text-left">
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => send(q)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-800 bg-gray-900
                             hover:border-amber-500/30 hover:bg-amber-500/5 text-sm text-gray-300
                             transition-all group"
                >
                  <MessageSquare
                    size={14}
                    className="inline mr-2.5 text-gray-600 group-hover:text-amber-400 transition-colors"
                  />
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat bubbles */}
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mr-2.5 mt-1">
                <GraduationCap size={14} className="text-amber-400" />
              </div>
            )}
            <div
              className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-gray-950'
                  : 'bg-gray-800 border border-gray-700 text-gray-200'
              }`}
            >
              <div
                className={
                  msg.role === 'user'
                    ? 'prose-invert'
                    : 'prose prose-sm prose-invert max-w-none prose-p:text-gray-300 prose-strong:text-gray-100 prose-code:text-amber-300 prose-code:bg-gray-900 prose-code:px-1 prose-code:rounded prose-a:text-amber-400'
                }
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {sending && (
          <div className="flex justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mr-2.5 mt-1">
              <GraduationCap size={14} className="text-amber-400" />
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
              <div className="flex space-x-1.5">
                <div
                  className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Assessment result ── */}
      {assessment && (
        <div className="mx-4 mb-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500/10">
              <BarChart3 size={16} className="text-emerald-400" />
            </div>
            <h4 className="font-semibold text-emerald-300 text-sm">Learning Assessment</h4>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-3">
              <p className="text-xs text-gray-500 mb-0.5">Comprehension</p>
              <p className="font-semibold text-gray-200 capitalize">
                {assessment.assessment?.comprehension}
              </p>
            </div>
            <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-3">
              <p className="text-xs text-gray-500 mb-0.5">Pace</p>
              <p className="font-semibold text-gray-200 capitalize">
                {assessment.assessment?.pace}
              </p>
            </div>
          </div>

          {assessment.assessment?.strengths?.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-gray-400 mb-2">
              <TrendingUp size={14} className="text-emerald-400 mt-0.5 shrink-0" />
              <p>
                <span className="font-medium text-emerald-300">Strengths:</span>{' '}
                {assessment.assessment.strengths.join(', ')}
              </p>
            </div>
          )}

          {assessment.assessment?.struggles?.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-gray-400 mb-2">
              <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
              <p>
                <span className="font-medium text-amber-300">Work on:</span>{' '}
                {assessment.assessment.struggles.join(', ')}
              </p>
            </div>
          )}

          {assessment.assessment?.notes && (
            <p className="text-sm text-gray-500 italic mt-2">
              {assessment.assessment.notes}
            </p>
          )}

          <div className="flex items-center gap-1.5 mt-4 text-xs text-emerald-400/80">
            <CheckCircle size={12} />
            Your profile has been updated — future chapters will adapt to your learning style.
          </div>
        </div>
      )}

      {/* ── Assessment button ── */}
      {messages.length >= 4 && !assessment && (
        <div className="px-4 pb-2">
          <button
            onClick={runAssessment}
            disabled={assessing}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium
                       border-2 border-dashed border-gray-700 text-gray-400
                       hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/5
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {assessing ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-gray-600 border-t-amber-400 animate-spin" />
                Analysing your session…
              </>
            ) : (
              <>
                <BarChart3 size={15} />
                End Session & Get Learning Feedback
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Input ── */}
      <div className="border-t border-gray-800 p-4 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex gap-2.5 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your tutor anything…"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-2.5 text-sm
                       text-gray-100 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/40
                       transition-all"
          />
          <button
            onClick={() => send()}
            disabled={sending || !input.trim()}
            className="flex-shrink-0 flex items-center justify-center gap-1.5 bg-amber-500 text-gray-950
                       rounded-xl px-5 py-2.5 text-sm font-semibold
                       hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed
                       transition-colors shadow-lg shadow-amber-500/20 disabled:shadow-none"
          >
            <Send size={14} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}