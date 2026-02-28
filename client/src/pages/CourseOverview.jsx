import { useParams, useNavigate } from 'react-router-dom';
import { dummyCourse, TRACKS } from '../data/dummyData';

/**
 * CourseOverview - Overview of a course/feed with progress, goals, and chapter list.
 * Uses dummy data. Swap for: import { getCourse } from '../api'; await getCourse(courseId);
 */
export default function CourseOverview() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // TODO: Replace with real API call
  // const [course, setCourse] = useState(null);
  // useEffect(() => { getCourse(courseId).then(setCourse); }, [courseId]);
  const course = dummyCourse;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-pulse text-slate-400">Loading course...</div>
      </div>
    );
  }

  const trackLabel = {
    [TRACKS.EDUCATION]: 'Education',
    [TRACKS.INTEREST]: 'Interest / Hobbies',
    [TRACKS.CAREER]: 'Career',
  }[course.track] || course.track;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-700 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase tracking-wider text-emerald-400">{trackLabel}</span>
            <h1 className="font-semibold truncate">{course.title}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Progress bar */}
        <section className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Your progress</span>
            <span className="font-medium text-emerald-400">{course.progress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </section>

        {/* Goals */}
        <section className="rounded-xl bg-slate-800/80 p-4 border border-slate-700 space-y-3">
          <h2 className="text-sm font-medium text-slate-300">Goals</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate-500">End goal:</span> {course.endGoal}</p>
            <p><span className="text-slate-500">Daily:</span> {course.dailyGoal}</p>
            <p><span className="text-slate-500">Monthly:</span> {course.monthlyGoal}</p>
          </div>
        </section>

        {/* Hashtags (Career track) */}
        {course.hashtags?.length > 0 && (
          <section className="flex flex-wrap gap-2">
            {course.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm"
              >
                {tag}
              </span>
            ))}
          </section>
        )}

        {/* Chapter list */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Chapters</h2>
          <ul className="space-y-2">
            {course.chapters.map((ch) => (
              <li key={ch.id}>
                <button
                  onClick={() => navigate(`/courses/${course.id}/chapters/${ch.id}`)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 transition-colors text-left"
                >
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      ch.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {ch.completed ? '✓' : ch.order}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{ch.title}</p>
                    <p className="text-sm text-slate-500">{ch.duration}</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
