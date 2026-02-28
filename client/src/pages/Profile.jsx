import { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle,
  Trophy,
  Flame,
  Brain,
  Pencil,
  Save,
  X,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { getProfile, updateProfile } from '../api';

const PLACEHOLDER_PROFILE = {
  name: 'Alex Learner',
  displayName: 'Alex Learner',
  email: 'alex@example.com',
  bio: 'Curious mind on a mission to learn something new every day. Currently diving into AI and web development. 🚀',
  createdAt: '2025-09-15T00:00:00.000Z',
  stats: {
    coursesStarted: 5,
    coursesCompleted: 2,
    chaptersCompleted: 41,
    quizzesTaken: 18,
    averageScore: 82,
    currentStreak: 7,
  },
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ displayName: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProfile()
      .then((data) => {
        const merged = {
          ...PLACEHOLDER_PROFILE,
          ...data,
          stats: {
            ...PLACEHOLDER_PROFILE.stats,
            ...(data.stats || {}),
          },
        };
        const apiStats = data.stats || {};
        const allZero = Object.values(apiStats).every((v) => v === 0 || v === '0' || !v);
        if (allZero) {
          merged.stats = PLACEHOLDER_PROFILE.stats;
        }
        setProfile(merged);
        setForm({
          displayName: merged.displayName || merged.name,
          bio: merged.bio || '',
        });
      })
      .catch(() => {
        setProfile(PLACEHOLDER_PROFILE);
        setForm({
          displayName: PLACEHOLDER_PROFILE.displayName,
          bio: PLACEHOLDER_PROFILE.bio,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await updateProfile(form);
      setProfile((prev) => ({ ...prev, ...updated }));
      setEditing(false);
    } catch {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-gray-700 border-t-amber-400 animate-spin" />
        <p className="text-sm text-gray-500">Loading profile…</p>
      </div>
    );
  }

  const stats = profile?.stats || PLACEHOLDER_PROFILE.stats;
  const statCards = [
    { label: 'Courses Started',   value: stats.coursesStarted || 0,          icon: BookOpen,    accent: 'text-sky-400    bg-sky-500/10' },
    { label: 'Courses Completed', value: stats.coursesCompleted || 0,        icon: CheckCircle, accent: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Chapters Finished', value: stats.chaptersCompleted || 0,       icon: Trophy,      accent: 'text-amber-400  bg-amber-500/10' },
    { label: 'Quizzes Taken',     value: stats.quizzesTaken || 0,            icon: Brain,       accent: 'text-violet-400 bg-violet-500/10' },
    { label: 'Avg Score',         value: `${stats.averageScore || 0}%`,      icon: BarChart3,   accent: 'text-cyan-400   bg-cyan-500/10' },
    { label: 'Current Streak',    value: `${stats.currentStreak || 0}d`,     icon: Flame,       accent: 'text-orange-400 bg-orange-500/10' },
  ];

  const inputClasses =
    'w-full p-3 rounded-xl border border-gray-700 bg-gray-800/60 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/40 transition-all';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── Profile Card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition-colors">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative flex items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-amber-400">
              {getInitials(profile?.displayName || profile?.name)}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    maxLength={280}
                    rows={3}
                    placeholder="Tell us about yourself…"
                    className={`${inputClasses} resize-none`}
                  />
                  <p className="text-xs text-gray-600 mt-1.5">{form.bio.length}/280</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-gray-950 text-sm font-semibold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save size={14} />
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        displayName: profile.displayName || profile.name,
                        bio: profile.bio || '',
                      });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <h1 className="text-xl font-bold text-gray-50 truncate">
                    {profile?.displayName || profile?.name}
                  </h1>
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors shrink-0"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{profile?.email}</p>
                {profile?.bio && (
                  <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                    {profile.bio}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-600">
                  <Calendar size={12} />
                  Member since {formatDate(profile?.createdAt)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-800">
            <BarChart3 size={16} className="text-amber-400" />
          </div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Learning Stats
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-all"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.accent} transition-transform group-hover:scale-110`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}