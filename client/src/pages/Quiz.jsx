import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyQuiz } from '../data/dummyData';

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
  // const [quiz, setQuiz] = useState(null);
  // useEffect(() => { getQuiz(courseId, chapterId).then(setQuiz); }, [courseId, chapterId]);
  const quiz = dummyQuiz;

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-pulse text-slate-400">Loading quiz...</div>
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
      setScore(2); // Dummy: 2/3 correct
      setSubmitted(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleFinish = () => {
    navigate(`/courses/${courseId}`);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Check-in complete!</h2>
        <p className="text-slate-400 mb-6">
          You got {score} out of {quiz.questions.length} correct.
        </p>
        <button
          onClick={handleFinish}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-medium transition-colors"
        >
          Back to course
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm text-slate-400">
            {currentIndex + 1} / {quiz.questions.length}
          </span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        <p className="text-xs uppercase tracking-wider text-emerald-400 mb-2">{quiz.type} check-in</p>
        <h1 className="text-lg font-semibold mb-6">{quiz.title}</h1>

        {/* Question */}
        <div className="space-y-6">
          <p className="text-slate-200">{question.question}</p>

          {question.type === 'mcq' && (
            <ul className="space-y-2">
              {question.options.map((opt, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleAnswer(i)}
                    className={`w-full p-4 rounded-xl border text-left transition-colors ${
                      answers[question.id] === i
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
                    }`}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {question.type === 'fill_blank' && (
            <input
              type="text"
              placeholder="Type your answer..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          )}

          {question.type === 'short_answer' && (
            <input
              type="text"
              placeholder="Type your answer..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={answers[question.id] === undefined || answers[question.id] === ''}
          className="mt-8 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isLast ? 'Submit' : 'Next'}
        </button>
      </main>
    </div>
  );
}
