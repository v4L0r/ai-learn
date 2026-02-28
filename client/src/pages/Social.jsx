import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  MessageCircle,
  Flame,
  Medal,
  Crown,
  Heart,
  Clock,
  ChevronUp,
  Send,
  Sparkles,
} from 'lucide-react';

const LEADERBOARD = [
  { rank: 1, name: 'Amara Osei',       avatar: '🧠', xp: 12480, streak: 34, chaptersDone: 97,  trend: 'up' },
  { rank: 2, name: 'Liam Chen',        avatar: '🚀', xp: 11210, streak: 28, chaptersDone: 84,  trend: 'up' },
  { rank: 3, name: 'Sofia Petrov',     avatar: '🎯', xp: 10870, streak: 21, chaptersDone: 79,  trend: 'same' },
  { rank: 4, name: 'Kai Nakamura',     avatar: '💡', xp: 9540,  streak: 19, chaptersDone: 72,  trend: 'up' },
  { rank: 5, name: 'Priya Sharma',     avatar: '⚡', xp: 8890,  streak: 15, chaptersDone: 65,  trend: 'down' },
  { rank: 6, name: 'Marcus Johnson',   avatar: '🔥', xp: 7720,  streak: 12, chaptersDone: 58,  trend: 'up' },
  { rank: 7, name: 'Elena Ruiz',       avatar: '✨', xp: 7110,  streak: 10, chaptersDone: 53,  trend: 'same' },
  { rank: 8, name: 'You',              avatar: '😊', xp: 6450,  streak: 7,  chaptersDone: 41,  trend: 'up', isYou: true },
  { rank: 9, name: 'Noah Williams',    avatar: '🌟', xp: 5980,  streak: 6,  chaptersDone: 38,  trend: 'down' },
  { rank: 10, name: 'Fatima Al-Hassan', avatar: '🎓', xp: 5340, streak: 5,  chaptersDone: 33,  trend: 'up' },
];

const FORUM_POSTS = [
  {
    id: 1,
    author: 'Amara Osei',
    avatar: '🧠',
    time: '2 hours ago',
    title: 'Just hit a 34-day streak! 🎉',
    body: "When I started I could barely keep up with 1 chapter a day. Now I'm doing 3. Don't give up — consistency beats intensity every time.",
    likes: 47,
    replies: 12,
    tags: ['motivation'],
  },
  {
    id: 2,
    author: 'Kai Nakamura',
    avatar: '💡',
    time: '5 hours ago',
    title: 'The AI tutor chat is a game-changer',
    body: "I was stuck on recursion for days. Tried asking the AI tutor to explain it like I'm 10 and it finally clicked. Highly recommend using the chat feature if you're struggling!",
    likes: 33,
    replies: 8,
    tags: ['tips'],
  },
  {
    id: 3,
    author: 'Sofia Petrov',
    avatar: '🎯',
    time: '8 hours ago',
    title: 'Finished my first full course!',
    body: "Intro to Machine Learning — done! 🏆 It took me 3 weeks but honestly every chapter was worth it. The quizzes really helped solidify the concepts. On to Deep Learning next!",
    likes: 61,
    replies: 19,
    tags: ['milestone'],
  },
  {
    id: 4,
    author: 'Marcus Johnson',
    avatar: '🔥',
    time: '1 day ago',
    title: 'Tip: review chapters before the quiz',
    body: "I started scoring way better on quizzes once I re-read the chapter summaries before attempting them. The spaced repetition really works. Don't just rush through!",
    likes: 28,
    replies: 5,
    tags: ['tips'],
  },
  {
    id: 5,
    author: 'Priya Sharma',
    avatar: '⚡',
    time: '1 day ago',
    title: 'Struggling but not quitting 💪',
    body: "Data structures is kicking my butt right now. Trees and graphs feel impossible. But reading everyone's posts here reminds me that everyone struggles at some point. We got this!",
    likes: 52,
    replies: 22,
    tags: ['motivation'],
  },
  {
    id: 6,
    author: 'Elena Ruiz',
    avatar: '✨',
    time: '2 days ago',
    title: 'Study buddy thread — who wants to pair up?',
    body: "I learn so much better when I can discuss things with someone. Anyone currently going through the Python Fundamentals course and want to chat about it together?",
    likes: 39,
    replies: 14,
    tags: ['community'],
  },
];

const TAG_COLORS = {
  motivation: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  tips: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  milestone: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  community: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
};

function RankBadge({ rank }) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm font-semibold text-gray-500">#{rank}</span>;
}

function Leaderboard() {
  const [timeframe, setTimeframe] = useState('weekly');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-yellow-500/10">
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-100">Leaderboard</h2>
        </div>
        <div className="flex bg-gray-800 rounded-xl p-0.5 text-sm border border-gray-700">
          {['weekly', 'monthly', 'all-time'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all text-xs font-medium ${
                timeframe === t
                  ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900 to-gray-900/50 p-6 pb-2">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative flex items-end justify-center gap-4 pt-2 pb-4">
          {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((user, i) => {
            const heights = ['h-20', 'h-28', 'h-16'];
            const glows = [
              'from-gray-400/20 to-gray-400/5',
              'from-yellow-400/20 to-yellow-400/5',
              'from-amber-600/20 to-amber-600/5',
            ];
            const rings = ['ring-gray-400/40', 'ring-yellow-400/60', 'ring-amber-600/40'];
            return (
              <motion.div
                key={user.name}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`text-3xl mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 ring-2 ${rings[i]}`}
                >
                  {user.avatar}
                </div>
                <p className="text-xs font-semibold text-gray-200 truncate max-w-20 text-center">
                  {user.name}
                </p>
                <p className="text-xs text-amber-400 font-bold">
                  {user.xp.toLocaleString()} XP
                </p>
                <div
                  className={`${heights[i]} w-20 bg-gradient-to-t ${glows[i]} rounded-t-xl mt-2 flex items-center justify-center border border-gray-700/50 border-b-0`}
                >
                  <span className="text-lg font-black text-gray-400">#{user.rank}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full list */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
        {LEADERBOARD.map((user, i) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-center gap-3 px-4 py-3.5 border-b border-gray-800/80 last:border-b-0 transition-colors ${
              user.isYou
                ? 'bg-amber-500/5 border-l-2 border-l-amber-500'
                : 'hover:bg-gray-800/50'
            }`}
          >
            <div className="w-8 flex justify-center">
              <RankBadge rank={user.rank} />
            </div>
            <div className="text-2xl w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold truncate ${
                  user.isYou ? 'text-amber-300' : 'text-gray-200'
                }`}
              >
                {user.name}{' '}
                {user.isYou && (
                  <span className="text-xs font-normal text-amber-500/70">(you)</span>
                )}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-orange-400" /> {user.streak}d
                </span>
                <span>{user.chaptersDone} chapters</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-200">
                {user.xp.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">XP</p>
            </div>
            <div className="w-5">
              {user.trend === 'up' && (
                <ChevronUp className="w-4 h-4 text-emerald-400" />
              )}
              {user.trend === 'down' && (
                <ChevronUp className="w-4 h-4 text-red-400 rotate-180" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Forum() {
  const [filter, setFilter] = useState('all');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentText, setCommentText] = useState('');
  const [activeComment, setActiveComment] = useState(null);

  const filtered =
    filter === 'all'
      ? FORUM_POSTS
      : FORUM_POSTS.filter((p) => p.tags.includes(filter));

  const toggleLike = (id) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-500/10">
            <MessageCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-100">Community Forum</h2>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {['all', 'motivation', 'tips', 'milestone', 'community'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all font-medium ${
                filter === t
                  ? 'bg-amber-500 text-gray-950'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600 hover:text-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Compose */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-amber-500/10 rounded-full flex items-center justify-center text-lg shrink-0">
            😊
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Share something with the community…"
              className="w-full text-sm text-gray-100 placeholder-gray-500 border border-gray-700 bg-gray-800/60 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/40 transition-all"
            />
            <div className="flex justify-end mt-2.5">
              <button className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 text-gray-950 text-xs font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                <Send className="w-3 h-3" />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.map((post) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-gray-800 bg-gray-900 p-5 space-y-3 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-lg">
                {post.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-200">{post.author}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.time}
                </p>
              </div>
              <div className="flex gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                      TAG_COLORS[tag] || 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-100">{post.title}</h3>
              <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
                {post.body}
              </p>
            </div>

            <div className="flex items-center gap-5 pt-3 border-t border-gray-800">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-all ${
                  likedPosts.has(post.id)
                    ? 'text-rose-400'
                    : 'text-gray-500 hover:text-rose-400'
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    likedPosts.has(post.id) ? 'fill-current scale-110' : ''
                  }`}
                />
                {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
              </button>
              <button
                onClick={() =>
                  setActiveComment(activeComment === post.id ? null : post.id)
                }
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  activeComment === post.id
                    ? 'text-amber-400'
                    : 'text-gray-500 hover:text-amber-400'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                {post.replies} replies
              </button>
            </div>

            <AnimatePresence>
              {activeComment === post.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a reply…"
                      className="flex-1 text-xs border border-gray-700 bg-gray-800/60 rounded-lg px-3 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/40 transition-all"
                    />
                    <button className="p-2.5 bg-amber-500 text-gray-950 rounded-lg hover:bg-amber-400 transition-colors">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Social() {
  const [tab, setTab] = useState('forum');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-50">Community</h1>
        <p className="text-sm text-gray-500 mt-1">Learn together, grow together</p>
      </div>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-5"
      >
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-amber-500/10">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-100">
              Social features coming soon!
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              This is a preview of the community experience. Real profiles,
              messaging, and study groups are on the way.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tab switcher */}
      <div className="flex rounded-xl border border-gray-800 bg-gray-900 p-1">
        {[
          { key: 'forum', label: 'Forum', icon: MessageCircle },
          { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'leaderboard' ? <Leaderboard /> : <Forum />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}