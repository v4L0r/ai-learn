import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CourseOverview from './pages/CourseOverview';
import Chapter from './pages/Chapter';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TopicSubmit from './pages/TopicSubmit';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/topic-submit" element={<TopicSubmit />} />
        <Route path="/courses/:courseId" element={<CourseOverview />} />
        <Route path="/courses/:courseId/chapters/:chapterId" element={<Chapter />} />
        <Route path="/courses/:courseId/chapters/:chapterId/quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  );
}
