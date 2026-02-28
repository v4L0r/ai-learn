import { useState } from 'react';
import { topicsApi } from '../api';

export default function TopicSubmit() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);
    try {
      await topicsApi.submit(title.trim(), description.trim());
      setMessage({ type: 'success', text: 'Topic submitted successfully.' });
      setTitle('');
      setDescription('');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to submit topic. Is the API running?',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Submit a topic</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}
        <div>
          <label htmlFor="topic-title" className="block text-sm font-medium text-slate-300 mb-1.5">
            Title
          </label>
          <input
            id="topic-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. React hooks"
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="topic-desc" className="block text-sm font-medium text-slate-300 mb-1.5">
            Description (optional)
          </label>
          <textarea
            id="topic-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What do you want to learn?"
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="py-2 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting…' : 'Submit topic'}
        </button>
      </form>
    </section>
  );
}
