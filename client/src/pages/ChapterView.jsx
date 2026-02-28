import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import TutorChat from '../components/TutorChat';
import {
  getChapter,
  generateChapterContent,
  submitQuiz,
  generateInteractive,
} from '../api';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  PenLine,
  GraduationCap,
  FlaskConical,
  Trophy,
  RefreshCw,
  ChevronDown,
  MessageSquare,
  CheckCircle,
  XCircle,
  Brain,
} from 'lucide-react';

export default function ChapterView() {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const [answers, setAnswers] = useState({});
  const [grading, setGrading] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const [generatingInteractive, setGeneratingInteractive] = useState(false);

  useEffect(() => {
    fetchChapter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, chapterId]);

  const fetchChapter = async () => {
    setLoading(true);
    try {
      const data = await getChapter(courseId, chapterId);
      setChapter(data);
      if (data.quiz?.score !== null && data.quiz?.score !== undefined) {
        reconstructResult(data);
      }
    } catch (e) {
      console.error('Failed to load chapter:', e);
    }
    setLoading(false);
  };

  const reconstructResult = (data) => {
    const results = data.quiz.questions.map((q, i) => {
      if (q.type === 'open_ended') {
        return {
          questionIndex: i,
          type: 'open_ended',
          question: q.question,
          studentResponse: q.studentResponse || '',
          aiScore: q.aiScore,
          aiFeedback: q.aiFeedback,
          sampleAnswer: q.sampleAnswer,
        };
      }
      return {
        questionIndex: i,
        type: 'mcq',
        question: q.question,
        correct: null,
        selectedAnswer: null,
        correctAnswer: q.correctAnswer,
        options: q.options,
      };
    });
    setQuizResult({
      score: data.quiz.score,
      passed: data.quiz.passed,
      passingScore: data.quiz.passingScore || 70,
      attempts: data.quiz.attempts,
      results,
    });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await generateChapterContent(courseId, chapterId);
      setChapter(data);
    } catch (e) {
      console.error('Generation failed:', e);
    }
    setGenerating(false);
  };

  const handleGenerateInteractive = async () => {
    setGeneratingInteractive(true);
    try {
      const data = await generateInteractive(courseId, chapterId);
      setChapter((prev) => ({ ...prev, interactive: data.interactive }));
    } catch (e) {
      console.error('Interactive generation failed:', e);
    }
    setGeneratingInteractive(false);
  };

  const questions = chapter?.quiz?.questions || [];
  const hasOpenEnded = useMemo(
    () => questions.some((q) => q.type === 'open_ended'),
    [questions]
  );

  const setAnswer = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const allAnswered = useMemo(() => {
    return questions.every((q, i) => {
      const a = answers[i];
      if (!a) return false;
      if (q.type === 'open_ended') return a.trim().length >= 20;
      return true;
    });
  }, [answers, questions]);

  const handleSubmitQuiz = async () => {
    setGrading(true);
    try {
      const payload = Object.entries(answers).map(([idx, answer]) => ({
        questionIndex: parseInt(idx),
        answer,
      }));
      const data = await submitQuiz(courseId, chapterId, payload);
      setQuizResult(data);
      const updated = await getChapter(courseId, chapterId);
      setChapter(updated);
    } catch (e) {
      console.error('Quiz submission failed:', e);
    }
    setGrading(false);
  };

  const handleRetry = () => {
    setAnswers({});
    setQuizResult(null);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-gray-700 border-t-amber-400 animate-spin" />
        <p className="text-sm text-gray-500">Loading chapter…</p>
      </div>
    );
  }

  /* ── Not found ── */
  if (!chapter) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-500 mb-4">Chapter not found.</p>
        <Link
          to={`/courses/${courseId}`}
          className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
        >
          ← Back to course
        </Link>
      </div>
    );
  }

  /* ── Not generated yet ── */
  if (!chapter.content) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
        <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-10">
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <Sparkles size={24} className="text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-50 mb-2">{chapter.title}</h2>
            <p className="text-sm text-gray-400 mb-8">
              This chapter hasn't been generated yet. Click below to create the content.
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 bg-amber-500 text-gray-950 px-6 py-3 rounded-xl
                         font-semibold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {generating ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-gray-950/30 border-t-gray-950 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Chapter
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Tabs ── */
  const tabs = [
    { key: 'content', label: 'Content', icon: BookOpen },
    {
      key: 'quiz',
      label: `Quiz${quizResult ? ` (${Math.round(quizResult.score)}%)` : ''}`,
      icon: PenLine,
    },
    { key: 'tutor', label: 'Tutor', icon: GraduationCap },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to={`/courses/${courseId}`}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-amber-400 font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to course
        </Link>
        <h1 className="text-2xl font-bold text-gray-50">{chapter.title}</h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl border border-gray-800 bg-gray-900">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === t.key
                ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════ CONTENT TAB ═══════════ */}
      {activeTab === 'content' && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-8">
            <div className="prose prose-invert prose-sm sm:prose-base max-w-none
                            prose-headings:text-gray-100 prose-p:text-gray-300
                            prose-strong:text-gray-200 prose-a:text-amber-400
                            prose-code:text-amber-300 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
                            prose-blockquote:border-amber-500/40 prose-blockquote:text-gray-400
                            prose-li:text-gray-300 prose-hr:border-gray-800">
              <ReactMarkdown>{chapter.content}</ReactMarkdown>
            </div>
          </div>

          {/* Interactive widget */}
          {chapter.interactive ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-800">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-violet-500/10">
                  <FlaskConical size={16} className="text-violet-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-200">Interactive Activity</h3>
              </div>
              <iframe
                srcDoc={chapter.interactive}
                title="Interactive Activity"
                className="w-full border-0 bg-white"
                style={{ minHeight: '500px' }}
                sandbox="allow-scripts"
              />
            </div>
          ) : (
            <button
              onClick={handleGenerateInteractive}
              disabled={generatingInteractive}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed
                         border-gray-700 text-gray-400 px-5 py-6 text-sm font-medium
                         hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/5
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {generatingInteractive ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-gray-600 border-t-amber-400 animate-spin" />
                  Generating interactive…
                </>
              ) : (
                <>
                  <FlaskConical size={16} />
                  Generate Interactive Activity
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* ═══════════ QUIZ TAB ═══════════ */}
      {activeTab === 'quiz' && (
        <QuizSection
          questions={questions}
          answers={answers}
          setAnswer={setAnswer}
          allAnswered={allAnswered}
          grading={grading}
          quizResult={quizResult}
          hasOpenEnded={hasOpenEnded}
          onSubmit={handleSubmitQuiz}
          onRetry={handleRetry}
        />
      )}

      {/* ═══════════ TUTOR TAB ═══════════ */}
      {activeTab === 'tutor' && (
        <div
          className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden"
          style={{ height: '70vh' }}
        >
          <TutorChat
            courseId={courseId}
            chapterId={chapterId}
            chapterTitle={chapter.title}
          />
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   QUIZ SECTION
   ════════════════════════════════════════════ */
function QuizSection({
  questions,
  answers,
  setAnswer,
  allAnswered,
  grading,
  quizResult,
  hasOpenEnded,
  onSubmit,
  onRetry,
}) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-800 border border-gray-700">
          <PenLine size={20} className="text-gray-600" />
        </div>
        <p className="text-gray-500">No quiz available for this chapter yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quizResult && <ScoreBanner result={quizResult} />}

      {questions.map((q, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-800 bg-gray-900 p-5 hover:border-gray-700 transition-colors"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-xs font-semibold text-gray-500">
              Question {i + 1}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-lg ${
                q.type === 'open_ended'
                  ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                  : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              }`}
            >
              {q.type === 'open_ended' ? 'Open-ended' : 'Multiple choice'}
            </span>
          </div>
          <p className="text-gray-200 mb-4 leading-relaxed">{q.question}</p>

          {q.type === 'mcq' || !q.type ? (
            <McqQuestion
              question={q}
              index={i}
              selected={answers[i]}
              onSelect={(val) => setAnswer(i, val)}
              result={quizResult?.results?.find((r) => r.questionIndex === i)}
              disabled={!!quizResult}
            />
          ) : (
            <OpenEndedQuestion
              question={q}
              index={i}
              value={answers[i] || ''}
              onChange={(val) => setAnswer(i, val)}
              result={quizResult?.results?.find((r) => r.questionIndex === i)}
              disabled={!!quizResult}
            />
          )}
        </div>
      ))}

      {!quizResult && (
        <div className="pt-2">
          <button
            onClick={onSubmit}
            disabled={!allAnswered || grading}
            className="w-full py-3.5 rounded-xl text-gray-950 font-semibold bg-amber-500
                       hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all shadow-lg shadow-amber-500/20 disabled:shadow-none"
          >
            {grading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-gray-950/30 border-t-gray-950 animate-spin" />
                {hasOpenEnded ? 'AI is grading your responses…' : 'Grading…'}
              </span>
            ) : (
              'Submit Quiz'
            )}
          </button>
          {hasOpenEnded && !grading && (
            <p className="text-xs text-gray-600 text-center mt-2.5">
              Open-ended answers are graded by AI — this may take a few seconds.
            </p>
          )}
        </div>
      )}

      {quizResult && (
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium
                     border border-gray-700 bg-gray-800 text-gray-300
                     hover:bg-gray-700 hover:text-gray-100 transition-colors"
        >
          <RefreshCw size={15} />
          Retry Quiz
        </button>
      )}
    </div>
  );
}

/* ── Score banner ── */
function ScoreBanner({ result }) {
  const { score, passed, passingScore, mcqScore, openEndedScore, mcqWeight, openEndedWeight } =
    result;
  const hasBothTypes = mcqWeight > 0 && openEndedWeight > 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 border ${
        passed
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : 'bg-amber-500/5 border-amber-500/20'
      }`}
    >
      <div
        className={`pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl ${
          passed ? 'bg-emerald-500/10' : 'bg-amber-500/10'
        }`}
      />

      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center h-10 w-10 rounded-xl ${
              passed ? 'bg-emerald-500/10' : 'bg-amber-500/10'
            }`}
          >
            <Trophy
              size={20}
              className={passed ? 'text-emerald-400' : 'text-amber-400'}
            />
          </div>
          <h3
            className={`text-lg font-bold ${
              passed ? 'text-emerald-300' : 'text-amber-300'
            }`}
          >
            {passed ? 'Passed!' : 'Keep studying'}
          </h3>
        </div>
        <span
          className={`text-3xl font-bold ${
            passed ? 'text-emerald-400' : 'text-amber-400'
          }`}
        >
          {Math.round(score)}%
        </span>
      </div>

      {hasBothTypes && (
        <div className="relative grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-3">
            <p className="text-gray-500 text-xs mb-1">
              Multiple Choice ({mcqWeight}%)
            </p>
            <p className="font-semibold text-gray-200">{Math.round(mcqScore)}%</p>
          </div>
          <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-3">
            <p className="text-gray-500 text-xs mb-1">
              Open-ended ({openEndedWeight}%)
            </p>
            <p className="font-semibold text-gray-200">
              {Math.round(openEndedScore)}%
            </p>
          </div>
        </div>
      )}

      <p className="relative text-xs text-gray-600 mt-3">
        Passing score: {passingScore}% · Attempt #{result.attempts}
      </p>
    </div>
  );
}

/* ── MCQ question ── */
function McqQuestion({ question, index, selected, onSelect, result, disabled }) {
  return (
    <div className="space-y-2">
      {question.options.map((opt, j) => {
        let optClasses =
          'border-gray-700 bg-gray-800/40 hover:border-gray-600 hover:bg-gray-800';

        if (disabled && result) {
          if (opt === result.correctAnswer) {
            optClasses =
              'border-emerald-500/40 bg-emerald-500/5';
          } else if (opt === result.selectedAnswer && !result.correct) {
            optClasses =
              'border-red-500/40 bg-red-500/5';
          } else {
            optClasses = 'border-gray-800 bg-gray-800/20 opacity-50';
          }
        } else if (selected === opt) {
          optClasses =
            'border-amber-500/50 bg-amber-500/5 ring-2 ring-amber-500/20';
        }

        return (
          <button
            key={j}
            onClick={() => !disabled && onSelect(opt)}
            disabled={disabled}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${optClasses}`}
          >
            <span className="text-gray-200">{opt}</span>
            {disabled && result && opt === result.correctAnswer && (
              <CheckCircle
                size={15}
                className="inline ml-2 text-emerald-400"
              />
            )}
            {disabled &&
              result &&
              opt === result.selectedAnswer &&
              !result.correct && (
                <XCircle size={15} className="inline ml-2 text-red-400" />
              )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Open-ended question ── */
function OpenEndedQuestion({ question, index, value, onChange, result, disabled }) {
  const charCount = value.length;
  const minChars = 20;
  const [showSample, setShowSample] = useState(false);

  return (
    <div>
      {!disabled ? (
        <>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your answer here… (minimum 20 characters)"
            rows={5}
            className="w-full rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 text-sm text-gray-100
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50
                       focus:border-amber-500/40 resize-y transition-all"
          />
          <div className="flex justify-between mt-1.5">
            <p
              className={`text-xs ${
                charCount >= minChars ? 'text-gray-600' : 'text-amber-500/70'
              }`}
            >
              {charCount}/{minChars} min characters
            </p>
          </div>
        </>
      ) : result ? (
        <div className="space-y-3">
          {/* Student response */}
          <div className="rounded-xl bg-gray-800/60 border border-gray-700 p-4 text-sm text-gray-300">
            <p className="text-xs font-medium text-gray-500 mb-1.5">Your answer:</p>
            {result.studentResponse}
          </div>

          {/* AI score + feedback */}
          <div
            className={`rounded-xl p-4 border ${
              result.aiScore >= 70
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : result.aiScore >= 40
                ? 'bg-amber-500/5 border-amber-500/20'
                : 'bg-red-500/5 border-red-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain size={15} className="text-gray-500" />
                <span className="text-sm font-semibold text-gray-300">AI Score</span>
              </div>
              <span
                className={`text-lg font-bold ${
                  result.aiScore >= 70
                    ? 'text-emerald-400'
                    : result.aiScore >= 40
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {result.aiScore}/100
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {result.aiFeedback}
            </p>
          </div>

          {/* Sample answer */}
          <button
            onClick={() => setShowSample(!showSample)}
            className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            <ChevronDown
              size={15}
              className={`transition-transform ${showSample ? 'rotate-180' : ''}`}
            />
            {showSample ? 'Hide' : 'View'} sample answer
          </button>
          {showSample && (
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 text-sm text-gray-300 leading-relaxed">
              {result.sampleAnswer}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}