import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyQuiz } from '../data/dummyData';
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  Send,
  Trophy,
  ArrowRight,
} from 'lucide-react';

/**
 * Quiz - Daily check-in / milestone assessment with MCQ, short answer, fill-in-blank.
 * Uses dummy data. Swap for: import { getQuiz, submitQuiz } from '../api';
 */
export default function Quiz() {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // TODO: Replace with real API call
  const quiz = dummyQuiz;

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-gray-700 border-t-amber-400 animate-spin" />
        <p className="text-sm text-gray-500">Loading quiz…</p>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  const handleAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      // TODO: submitQuiz(courseId, chapterId, answers).then((res) => setScore(res.score));
      setScore(2);
      setSubmitted(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleFinish = () => {
    navigate(`/courses/${courseId}`);
  };

  /* ── Submitted / results screen ── */
  if (submitted) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    const passed = pct >= 70;

    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="relative">
          <div
            className={`pointer-events-none absolute -inset-8 rounded-full blur-3xl ${
              passed ? 'bg-emerald-500/10' : 'bg-amber-500/10'
            }`}
          />
          <div
            className={`relative flex items-center justify-center h-20 w-20 rounded-2xl border ${
              passed
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/20'
            }`}
          >
            {passed ? (
              <Trophy size={36} className="text-emerald-400" />
            ) : (
              <Trophy size={36} className="text-amber-400" />
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-50 mt-6 mb-2">
          {passed ? 'Check-in complete!' : 'Keep practising!'}
        </h2>
        <p className="text-gray-400 mb-1">
          You got{' '}
          <span className={`font-semibold ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
            {score}
          </span>{' '}
          out of{' '}
          <span className="font-semibold text-gray-200">{quiz.questions.length}</span>{' '}
          correct.
        </p>
        <p className="text-sm text-gray-600 mb-8">{pct}% score</p>

        <button
          onClick={handleFinish}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-gray-950 font-semibold
                     hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          Back to course
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  /* ── Quiz flow ── */
  const answered =
    answers[question.id] !== undefined && answers[question.id] !== '';

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-amber-400 font-medium transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <span className="text-sm text-gray-500 font-medium">
            {currentIndex + 1}{' '}
            <span className="text-gray-700">/</span>{' '}
            {quiz.questions.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="relative">
          <p className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">
            {quiz.type} check-in
          </p>
          <h1 className="text-lg font-bold text-gray-100 mb-8">{quiz.title}</h1>

          {/* Question text */}
          <p className="text-gray-200 leading-relaxed mb-6">{question.question}</p>

          {/* MCQ */}
          {question.type === 'mcq' && (
            <ul className="space-y-2.5">
              {question.options.map((opt, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleAnswer(i)}
                    className={`w-full p-4 rounded-xl border text-left text-sm transition-all ${
                      answers[question.id] === i
                        ? 'border-amber-500/50 bg-amber-500/5 ring-2 ring-amber-500/20 text-gray-100'
                        : 'border-gray-700 bg-gray-800/40 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center h-6 w-6 rounded-lg text-xs font-bold mr-3 ${
                        answers[question.id] === i
                          ? 'bg-amber-500 text-gray-950'
                          : 'bg-gray-700 text-gray-400'
                      } transition-colors`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Fill in the blank */}
          {question.type === 'fill_blank' && (
            <input
              type="text"
              placeholder="Type your answer…"
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800/60 text-gray-100
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50
                         focus:border-amber-500/40 transition-all"
            />
          )}

          {/* Short answer */}
          {question.type === 'short_answer' && (
            <input
              type="text"
              placeholder="Type your answer…"
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800/60 text-gray-100
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50
                         focus:border-amber-500/40 transition-all"
            />
          )}
        </div>
      </div>

      {/* Next / Submit button */}
      <button
        onClick={handleNext}
        disabled={!answered}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold
                   bg-amber-500 text-gray-950 hover:bg-amber-400
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all shadow-lg shadow-amber-500/20 disabled:shadow-none"
      >
        {isLast ? (
          <>
            <Send size={16} />
            Submit
          </>
        ) : (
          <>
            Next
            <ChevronRight size={16} />
          </>
        )}
      </button>
    </div>
  );
}