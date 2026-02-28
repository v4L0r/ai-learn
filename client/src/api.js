// src/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  console.log('[authFetch]', url);
  console.log('[authFetch] token:', token ? token.substring(0, 20) + '...' : 'MISSING');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(data.message || 'Request failed');
  }
  return res.json();
};

// ============ AUTH ============

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

export const getMe = () => authFetch('/auth/me');

// ============ TOPICS ============

export const submitTopic = (prompt) =>
  authFetch('/topics', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });

export const getTopics = () => authFetch('/topics');

// ============ COURSES ============

export const getCourses = () => authFetch('/courses');
export const getCourse = (courseId) => authFetch(`/courses/${courseId}`);

// ============ CHAPTERS ============

export const getChapters = (courseId) =>
  authFetch(`/courses/${courseId}/chapters`);

export const getChapter = (courseId, chapterId) =>
  authFetch(`/courses/${courseId}/chapters/${chapterId}`);

export const generateChapterContent = (courseId, chapterId) =>
  authFetch(`/courses/${courseId}/chapters/${chapterId}/generate`, {
    method: 'POST',
  });

export const generateInteractive = (courseId, chapterId) =>
  authFetch(`/courses/${courseId}/chapters/${chapterId}/interactive`, {
    method: 'POST',
  });

export const getProfile = () => authFetch('/user/profile');

export const updateProfile = (data) =>
  authFetch('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// ============ SETTINGS ============

export const getSettings = () => authFetch('/user/settings');

export const updateSettings = (data) =>
  authFetch('/user/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// ============ ACCOUNT ============

export const changePassword = (data) =>
  authFetch('/user/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteAccount = () =>
  authFetch('/user', {
    method: 'DELETE',
  });
// ============ QUIZZES ============

/** Generate / fetch quiz questions for a chapter (POST with no body) */
export const getQuiz = (courseId, chapterId) =>
  authFetch(`/courses/${courseId}/chapters/${chapterId}/quiz`, {
    method: 'POST',
  });

/** Submit quiz answers and get results */
export const submitQuiz = (courseId, chapterId, answers) =>
  authFetch(`/courses/${courseId}/chapters/${chapterId}/quiz`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });

// ============ AI TUTOR CHAT ============

export const getChatHistory = (courseId, chapterId) =>
  authFetch(`/courses/${courseId}/chapters/${chapterId}/chat`);

export const sendChatMessage = (courseId, chapterId, message) =>
  authFetch(`/courses/${courseId}/chapters/${chapterId}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });

export const assessChatSession = (courseId, chapterId) =>
  authFetch(`/courses/${courseId}/chapters/${chapterId}/chat/assess`, {
    method: 'POST',
  });

export const getStats = () => authFetch('/courses/stats');

export const deleteCourse = (courseId) =>
  authFetch(`/courses/${courseId}`, {
    method: 'DELETE',
  });