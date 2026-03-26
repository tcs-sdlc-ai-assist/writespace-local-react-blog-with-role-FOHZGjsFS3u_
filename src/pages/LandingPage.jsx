import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAllPosts } from '../utils/PostManager.js';

const FEATURES = [
  {
    icon: '✍️',
    title: 'Write Freely',
    description:
      'Express your thoughts, ideas, and stories in a clean, distraction-free writing environment.',
    colorScheme: 'indigo',
  },
  {
    icon: '📖',
    title: 'Read & Discover',
    description:
      'Explore a curated collection of posts from writers across the community.',
    colorScheme: 'violet',
  },
  {
    icon: '🚀',
    title: 'Grow Together',
    description:
      'Build your writing habit, share your voice, and connect with readers who care.',
    colorScheme: 'emerald',
  },
];

const FEATURE_COLOR_MAP = {
  indigo: {
    iconBg: 'bg-indigo-100',
    iconText: 'text-indigo-600',
    border: 'border-indigo-100',
  },
  violet: {
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
    border: 'border-violet-100',
  },
  emerald: {
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
    border: 'border-emerald-100',
  },
};

const ACCENT_COLORS = [
  'border-indigo-400',
  'border-violet-400',
  'border-emerald-400',
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

function truncateExcerpt(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

function HeroSection({ session }) {
  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-20 px-4">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-5xl">✍️</span>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            WriteSpace
          </h1>
        </div>
        <p className="text-xl text-gray-500 max-w-xl leading-relaxed">
          A place to read, write, and grow. Share your stories with the world
          and discover voices that inspire.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {session ? (
            <>
              <Link
                to="/blogs"
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Browse Blogs
              </Link>
              {session.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Go to Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Get Started — It's Free
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Everything you need to write
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Simple, powerful tools for writers of all kinds.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const colors =
              FEATURE_COLOR_MAP[feature.colorScheme] ||
              FEATURE_COLOR_MAP.indigo;
            return (
              <div
                key={feature.title}
                className={`rounded-xl border ${colors.border} bg-white p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl ${colors.iconBg} ${colors.iconText}`}
                >
                  {feature.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LatestPostsSection() {
  const allPosts = getAllPosts();
  const latestPosts = [...allPosts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Fresh reads from the community.
            </p>
          </div>
          <Link
            to="/blogs"
            className="flex-shrink-0 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all →
          </Link>
        </div>

        {latestPosts.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <span className="text-4xl">📝</span>
            <p className="text-gray-500 text-sm font-medium">
              No posts yet. Be the first to write something!
            </p>
            <Link
              to="/register"
              className="mt-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Start Writing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post, index) => {
              const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];
              return (
                <div
                  key={post.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${accentColor} flex flex-col hover:shadow-md transition-shadow duration-200`}
                >
                  <div className="flex flex-col flex-1 p-5">
                    <Link
                      to={`/blogs/${post.id}`}
                      className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors leading-snug line-clamp-2 mb-2"
                    >
                      {post.title}
                    </Link>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
                      {truncateExcerpt(post.excerpt)}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-600 font-medium truncate">
                        {post.authorDisplayName || post.author}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export function LandingPage() {
  const { session } = useAuth();

  return (
    <div className="flex flex-col">
      <HeroSection session={session} />
      <FeaturesSection />
      <LatestPostsSection />
    </div>
  );
}