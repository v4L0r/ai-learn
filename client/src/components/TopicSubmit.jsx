import { useState } from 'react';
import { submitTopic } from '../api';

export default function TopicSubmit() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await submitTopic(prompt);
      setResult(data.response);
      setPrompt('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a topic to explore..."
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-semibold transition text-white"
        >
          {loading ? 'Thinking...' : 'Explore'}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-200 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}