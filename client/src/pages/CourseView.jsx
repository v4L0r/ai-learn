import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse } from '../api';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Lock,
  CircleDot,
  Sparkles,
} from 'lucide-react';

export default function CourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getCourse(courseId);
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-gray-700 border-t-amber-400 animate-spin" />
        <p className="text-sm text-gray-500">Loading course…</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 max-w-md text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );

  const chapters = course?.chapters || [];
  const completedCount = chapters.filter((c) => c.completed).length;
  const progressPct = chapters.length
    ? Math.round((completedCount / chapters.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* ── Hero header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <button
          onClick={() => navigate('/dashboard')}
          className="relative flex items-center gap-1.5 text-sm text-gray-400 hover:text-amber-400 font-medium mb-5 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>

        <h1 className="relative text-2xl sm:text-3xl font-bold text-gray-50 leading-tight">
          {course.title}
        </h1>

        {course.description && (
          <p className="relative text-sm text-gray-400 mt-2 leading-relaxed max-w-2xl">
            {course.description}
          </p>
        )}

        <div className="relative mt-5 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-gray-600" />
            {chapters.length} chapters
          </span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-gray-600" />
            {completedCount}/{chapters.length} completed
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
            {progressPct}%
          </span>
        </div>
      </div>

      {/* ── Chapters list ── */}
      <div className="space-y-3">
        {chapters
          .sort((a, b) => a.order - b.order)
          .map((chapter, idx) => {
            const isLocked = !chapter.unlocked;

            // Badge
            let badgeText, badgeClasses;
            if (chapter.completed) {
              badgeText = `Completed · ${chapter.quizScore}%`;
              badgeClasses = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            } else if (isLocked) {
              badgeText = 'Locked';
              badgeClasses = 'bg-gray-800 text-gray-500 border border-gray-700';
            } else if (chapter.hasContent) {
              badgeText = 'In progress';
              badgeClasses = 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
            } else {
              badgeText = 'Not started';
              badgeClasses = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
            }

            // Circle icon
            let circleNode;
            if (chapter.completed) {
              circleNode = (
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle size={18} className="text-emerald-400" />
                </div>
              );
            } else if (isLocked) {
              circleNode = (
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                  <Lock size={16} className="text-gray-600" />
                </div>
              );
            } else if (!chapter.hasContent) {
              circleNode = (
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-amber-400" />
                </div>
              );
            } else {
              circleNode = (
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <CircleDot size={16} className="text-sky-400" />
                </div>
              );
            }

            const cardClasses = `block rounded-2xl border bg-gray-900 p-5 transition-all ${
              isLocked
                ? 'opacity-50 cursor-not-allowed border-gray-800'
                : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900/80 group'
            }`;

            const inner = (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {circleNode}
                  <div className="min-w-0">
                    <h3
                      className={`text-base font-semibold truncate transition-colors ${
                        isLocked
                          ? 'text-gray-500'
                          : 'text-gray-100 group-hover:text-amber-300'
                      }`}
                    >
                      <span className="text-gray-600 font-normal mr-2 text-sm">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {chapter.title}
                    </h3>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap shrink-0 ${badgeClasses}`}
                >
                  {badgeText}
                </span>
              </div>
            );

            return isLocked ? (
              <div key={chapter._id} className={cardClasses}>
                {inner}
              </div>
            ) : (
              <Link
                key={chapter._id}
                to={`/courses/${courseId}/chapters/${chapter._id}`}
                className={cardClasses}
              >
                {inner}
              </Link>
            );
          })}
      </div>
    </div>
  );
}