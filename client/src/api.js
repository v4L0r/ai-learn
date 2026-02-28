/**
 * API client for ai-learn backend.
 * Currently uses placeholder/dummy data. Swap these for real API calls once endpoints are ready.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for authenticated requests
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
};

// ============ COURSES ============

/** Get course by ID. Replace with: authFetch(`/courses/${id}`) */
export const getCourse = async (courseId) => {
  // return authFetch(`/courses/${courseId}`);
  throw new Error('API not ready - use dummy data');
};

/** Get all courses for user. Replace with: authFetch('/courses') */
export const getCourses = async () => {
  // return authFetch('/courses');
  throw new Error('API not ready - use dummy data');
};

// ============ CHAPTERS ============

/** Get chapter by ID. Replace with: authFetch(`/courses/${courseId}/chapters/${chapterId}`) */
export const getChapter = async (courseId, chapterId) => {
  // return authFetch(`/courses/${courseId}/chapters/${chapterId}`);
  throw new Error('API not ready - use dummy data');
};

/** Get all chapters for a course. Replace with: authFetch(`/courses/${courseId}/chapters`) */
export const getChapters = async (courseId) => {
  // return authFetch(`/courses/${courseId}/chapters`);
  throw new Error('API not ready - use dummy data');
};

// ============ QUIZZES ============

/** Get quiz for a chapter/course. Replace with real endpoint when available */
export const getQuiz = async (courseId, chapterId) => {
  // return authFetch(`/courses/${courseId}/chapters/${chapterId}/quiz`);
  throw new Error('API not ready - use dummy data');
};

/** Submit quiz answers. Replace with real endpoint when available */
export const submitQuiz = async (courseId, chapterId, answers) => {
  // return authFetch(`/courses/${courseId}/chapters/${chapterId}/quiz`, {
  //   method: 'POST',
  //   body: JSON.stringify({ answers }),
  // });
  throw new Error('API not ready - use dummy data');
};
