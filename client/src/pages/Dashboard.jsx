import { useNavigate } from 'react-router-dom';

/**
 * Dashboard - Entry point. Links to courses.
 * TODO: Replace with real course list from API.
 */
export default function Dashboard() {
  const navigate = useNavigate();

  // Dummy course for demo - replace with API data
  const demoCourseId = 'course-1';

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">My Feeds</h1>
      <button
        onClick={() => navigate(`/courses/${demoCourseId}`)}
        className="block w-full p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-left transition-colors"
      >
        <p className="font-medium">Introduction to Machine Learning</p>
        <p className="text-sm text-slate-500 mt-1">Education • 35% complete</p>
      </button>
    </div>
  );
}
