// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, submitTopic, deleteCourse } from '../api';
import { Trash2, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await submitTopic(prompt);
      navigate(`/courses/${data.course._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      setConfirmDelete(null);
    } catch (err) {
      setError(err.message);
      setConfirmDelete(null);
    }
  };

  const getProgress = (course) => {
    if (!course.chapters || course.chapters.length === 0) return 0;
    const completed = course.chapters.filter((ch) => ch.generated).length;
    return Math.round((completed / course.chapters.length) * 100);
  };

  return (
    <>
      {/* ── Hero / topic input ── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-8 mb-12">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <h2 className="relative text-2xl font-bold text-gray-50 mb-1">
          What would you like to learn?
        </h2>
        <p className="relative text-sm text-gray-400 mb-6">
          Enter any topic and we'll build a personalised course for you.
        </p>

        <form onSubmit={handleSubmit} className="relative flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. quantum physics, real analysis, machine learning…"
            className="flex-1 rounded-xl border border-gray-700 bg-gray-800/60 px-5 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-500/40 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles size={16} />
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </form>

        {loading && (
          <p className="relative mt-4 text-sm text-amber-400/80 animate-pulse">
            Crafting your personalised course plan — this may take a moment…
          </p>
        )}
        {error && (
          <p className="relative mt-4 text-sm text-red-400">{error}</p>
        )}
      </div>

      {/* ── Course list ── */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={18} className="text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-300">Your Courses</h2>
      </div>

      {fetching ? (
        <div className="flex items-center gap-3 text-gray-500 py-12 justify-center">
          <div className="h-4 w-4 rounded-full border-2 border-gray-600 border-t-amber-400 animate-spin" />
          Loading courses…
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16">
          <GraduationCap size={40} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-500">
            No courses yet. Generate your first one above!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => {
            const progress = getProgress(course);
            return (
              <div
                key={course._id}
                className="group relative rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-700 hover:bg-gray-900/80 transition-all"
              >
                <div
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="cursor-pointer p-5 pr-14"
                >
                  <h3 className="font-semibold text-gray-100 group-hover:text-amber-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      {course.chapters?.length || 0} chapters
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(course._id);
                  }}
                  className="absolute top-5 right-5 p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete course"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-500/10">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100">Delete Course?</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              This will permanently delete the course and all its chapters, quizzes, and progress.
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}