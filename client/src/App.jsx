// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseView from './pages/CourseView';
import ChapterView from './pages/ChapterView';
import Layout from './components/Layout';
import Social from './pages/Social';
import Profile from './pages/Profile';
import SettingsView from './pages/SettingsView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — no header */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — wrapped in Layout with Header */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses/:courseId" element={<CourseView />} />
          <Route path="/courses/:courseId/chapters/:chapterId" element={<ChapterView />} />
          <Route path="/social" element={<Social />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SettingsView />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}