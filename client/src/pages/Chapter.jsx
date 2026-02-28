import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyChapter } from '../data/dummyData';

/**
 * Chapter - Vertical video view with caption, like/save, and hyperlinks.
 * Uses dummy data. Swap for: import { getChapter } from '../api'; await getChapter(courseId, chapterId);
 */
export default function Chapter() {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(dummyChapter.saved);
  const [liked, setLiked] = useState(false);

  // TODO: Replace with real API call
  // const [chapter, setChapter] = useState(null);
  // useEffect(() => { getChapter(courseId, chapterId).then(setChapter); }, [courseId, chapterId]);
  const chapter = dummyChapter;

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-pulse text-slate-400">Loading chapter...</div>
      </div>
    );
  }

  // Parse caption and render links (Instagram-style hyperlinks for subtopics)
  const renderCaption = (text) => {
    const parts = text.split(/(<a href="[^"]+">[^<]+<\/a>)/g);
    return parts.map((part, i) => {
      const match = part.match(/<a href="([^"]+)">([^<]+)<\/a>/);
      if (match) {
        return (
          <a
            key={i}
            href={match[1]}
            className="text-emerald-400 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Navigate to subtopic or expand content when API ready
            }}
          >
            {match[2]}
          </a>
        );
      }
      const lines = part.split('\n');
      return lines.map((line, j) => (
        <span key={`${i}-${j}`}>
          {line}
          {j < lines.length - 1 && <br />}
        </span>
      ));
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Video area - full viewport, vertical (TikTok-style) */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center bg-slate-900">
        {/* Placeholder for video - replace with <video> when MiniMax API provides URLs */}
        <div className="aspect-[9/16] w-full max-w-md bg-slate-800 rounded-lg flex flex-col items-center justify-center border border-slate-700">
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">Video placeholder</p>
          <p className="text-slate-600 text-xs mt-1">{chapter.duration}</p>
        </div>

        {/* Right-side actions (Like, Save) */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-6">
          <button
            onClick={() => setLiked(!liked)}
            className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">{chapter.likes + (liked ? 1 : 0)}</span>
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill={saved ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-xs">Save</span>
          </button>
        </div>
      </div>

      {/* Caption section (Instagram-style, expandable) */}
      <div className="bg-slate-900 border-t border-slate-700 p-4 max-h-48 overflow-y-auto">
        <h3 className="font-semibold mb-2">{chapter.title}</h3>
        <div className="text-sm text-slate-300 leading-relaxed">{renderCaption(chapter.caption)}</div>
      </div>

      {/* Bottom nav */}
      <div className="flex gap-2 p-4 bg-slate-900 border-t border-slate-700">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => navigate(`/courses/${courseId}/chapters/${chapterId}/quiz`)}
          className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium transition-colors"
        >
          Daily Check-in
        </button>
      </div>
    </div>
  );
}
