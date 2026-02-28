import { useAuth } from '../context/AuthContext';
import TopicSubmit from '../components/TopicSubmit';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome, {user?.name ?? user?.email ?? 'there'}
        </h1>
        <p className="text-slate-400 mt-1">
          Submit a topic you'd like to learn with AI, or browse your submissions.
        </p>
      </div>
      <TopicSubmit />
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Your topics</h2>
        <p className="text-slate-500 text-sm">
          Your submitted topics will appear here once the backend is connected.
        </p>
      </section>
    </div>
  );
}
