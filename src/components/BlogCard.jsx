import { Link } from 'react-router-dom';
import { AvatarChip } from './AvatarChip.jsx';
import { canEditPost } from '../utils/AccessControl.js';

const ACCENT_COLORS = [
  'border-indigo-400',
  'border-violet-400',
  'border-emerald-400',
  'border-amber-400',
  'border-rose-400',
];

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function truncateExcerpt(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export function BlogCard({ post, session, index = 0 }) {
  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const canEdit = session && canEditPost(session, post);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${accentColor} flex flex-col hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex flex-col flex-1 p-6">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link
            to={`/blogs/${post.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors leading-snug line-clamp-2"
          >
            {post.title}
          </Link>
          {canEdit && (
            <Link
              to={`/blogs/${post.id}/edit`}
              className="flex-shrink-0 text-gray-400 hover:text-indigo-600 transition-colors mt-0.5"
              title="Edit post"
              aria-label="Edit post"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>
          )}
        </div>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
          {truncateExcerpt(post.excerpt)}
        </p>

        {/* Footer: author + date */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            <AvatarChip role={post.authorRole || 'viewer'} />
            <span className="text-sm text-gray-600 font-medium truncate">
              {post.authorDisplayName || post.author}
            </span>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}