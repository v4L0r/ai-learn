// client/src/pages/SettingsView.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, updateSettings, changePassword, deleteAccount } from '../api';
import {
  SlidersHorizontal,
  Bell,
  Lock,
  AlertTriangle,
  Check,
  Zap,
  BookOpen,
  Brain,
} from 'lucide-react';

function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3 group">
      <div>
        <p className="text-sm font-medium text-gray-200 group-hover:text-gray-100 transition-colors">
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
          enabled
            ? 'bg-amber-500 shadow-lg shadow-amber-500/20'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function SectionCard({ icon: Icon, title, titleColor = 'text-gray-500', borderColor = 'border-gray-800', children }) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border ${borderColor} bg-gray-900 p-6 transition-all duration-300 hover:border-gray-700`}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-800">
          <Icon size={16} className={titleColor} />
        </div>
        <h2 className={`text-sm font-semibold uppercase tracking-wider ${titleColor}`}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default function SettingsView() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirm: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    getSettings()
      .then((data) => setSettings(data.settings))
      .catch(() => setError('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSettingChange = async (key, value) => {
    const prev = settings[key];
    setSettings((s) => ({ ...s, [key]: value }));
    try {
      await updateSettings({ [key]: value });
      showToast('Saved');
    } catch {
      setSettings((s) => ({ ...s, [key]: prev }));
      setError('Failed to save setting');
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    const { currentPassword, newPassword, confirm } = passwordForm;

    if (!currentPassword || !newPassword) {
      setPasswordError('Both fields are required');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirm) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordForm({ currentPassword: '', newPassword: '', confirm: '' });
      showToast('Password updated');
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') return;
    try {
      await deleteAccount();
      localStorage.removeItem('token');
      navigate('/login');
    } catch {
      setError('Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-gray-700 border-t-amber-400 animate-spin" />
        <p className="text-sm text-gray-500">Loading settings…</p>
      </div>
    );
  }

  const difficultyMeta = {
    beginner: { icon: BookOpen, desc: 'Simple language, lots of examples' },
    intermediate: { icon: Brain, desc: 'Balanced depth and clarity' },
    advanced: { icon: Zap, desc: 'Technical, assumes prior knowledge' },
  };

  const inputClasses =
    'w-full p-3 rounded-xl border border-gray-700 bg-gray-800/60 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/40 transition-all';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-gray-950 text-sm font-semibold shadow-lg shadow-amber-500/20">
          <Check size={15} strokeWidth={3} />
          {toast}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-50">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Customise your learning experience
        </p>
      </div>

      {/* ── Learning Preferences ── */}
      <SectionCard icon={SlidersHorizontal} title="Learning Preferences" titleColor="text-amber-400">
        {/* Daily Goal */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-200 block mb-1">
            Daily Goal
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Chapters you aim to complete per day
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 5].map((n) => (
              <button
                key={n}
                onClick={() => handleSettingChange('dailyGoal', n)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  settings.dailyGoal === n
                    ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750 hover:text-gray-200 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-5 pt-5 border-t border-gray-800">
          <label className="text-sm font-medium text-gray-200 block mb-1">
            Preferred Difficulty
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Affects AI-generated content depth and complexity
          </p>
          <div className="grid grid-cols-3 gap-2">
            {['beginner', 'intermediate', 'advanced'].map((level) => {
              const meta = difficultyMeta[level];
              const active = settings.difficulty === level;
              return (
                <button
                  key={level}
                  onClick={() => handleSettingChange('difficulty', level)}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                    active
                      ? 'bg-amber-500/10 border-2 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/5'
                      : 'bg-gray-800 border-2 border-transparent text-gray-400 hover:bg-gray-800/80 hover:text-gray-300'
                  }`}
                >
                  <meta.icon size={18} className={active ? 'text-amber-400' : 'text-gray-600'} />
                  <span>{level}</span>
                  <span className={`text-xs font-normal ${active ? 'text-amber-400/70' : 'text-gray-600'}`}>
                    {meta.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-800">
          <Toggle
            enabled={settings.autoStartQuiz}
            onChange={(v) => handleSettingChange('autoStartQuiz', v)}
            label="Auto-start quiz"
            description="Automatically go to the quiz after generating a chapter's lesson"
          />
        </div>
      </SectionCard>

      {/* ── Notifications ── */}
      <SectionCard icon={Bell} title="Notifications" titleColor="text-indigo-400">
        <Toggle
          enabled={settings.emailReminders}
          onChange={(v) => handleSettingChange('emailReminders', v)}
          label="Streak reminders"
          description="Get an email if you're about to lose your streak (coming soon)"
        />
        <div className="border-t border-gray-800">
          <Toggle
            enabled={settings.weeklyDigest}
            onChange={(v) => handleSettingChange('weeklyDigest', v)}
            label="Weekly digest"
            description="Summary of your learning progress each week (coming soon)"
          />
        </div>
      </SectionCard>

      {/* ── Change Password ── */}
      <SectionCard icon={Lock} title="Change Password" titleColor="text-gray-400">
        {passwordError && (
          <p className="text-sm text-red-400 mb-3">{passwordError}</p>
        )}
        <div className="space-y-3 mb-4">
          <input
            type="password"
            placeholder="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))
            }
            className={inputClasses}
          />
          <input
            type="password"
            placeholder="New password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))
            }
            className={inputClasses}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordForm.confirm}
            onChange={(e) =>
              setPasswordForm((f) => ({ ...f, confirm: e.target.value }))
            }
            className={inputClasses}
          />
        </div>
        <button
          onClick={handlePasswordChange}
          disabled={passwordSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-gray-950 text-sm font-semibold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Lock size={14} />
          {passwordSaving ? 'Updating…' : 'Update Password'}
        </button>
      </SectionCard>

      {/* ── Danger Zone ── */}
      <section className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gray-900 p-6 transition-all duration-300 hover:border-red-500/30">
        {/* Subtle red glow */}
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-red-500/5 blur-3xl" />

        <div className="relative flex items-center gap-2.5 mb-5">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-500/10">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-red-400">
            Danger Zone
          </h2>
        </div>

        {!showDelete ? (
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">Delete Account</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Permanently remove your account and all data
              </p>
            </div>
            <button
              onClick={() => setShowDelete(true)}
              className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="relative space-y-3">
            <p className="text-sm text-gray-300">
              Type{' '}
              <span className="font-mono font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                DELETE
              </span>{' '}
              to confirm. This action cannot be undone.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE"
              className="w-full p-3 rounded-xl border border-red-500/30 bg-gray-800/60 text-white placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none text-sm transition-all"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleteConfirm !== 'DELETE'}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold transition-all"
              >
                Permanently Delete
              </button>
              <button
                onClick={() => {
                  setShowDelete(false);
                  setDeleteConfirm('');
                }}
                className="px-5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}