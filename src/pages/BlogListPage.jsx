import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { BlogCard } from '../components/BlogCard.jsx';
import { getAllPosts } from '../utils/PostManager.js';

export function BlogListPage() {
  const { session } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const allPosts = getAllPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {posts.length === 0
              ? 'No posts yet.'
              : `${posts.length} post${posts.length === 1 ? '' : 's'} published`}
          </p>
        </div>
        {session && session.role === 'admin' && (
          <Link
            to="/blogs/new"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            + New Post
          </Link>
        )}
      </div>

      {/* Empty State */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="text-5xl">📝</span>
          <h2 className="text-lg font-semibold text-gray-700">No posts yet</h2>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            There are no blog posts to show right now. Be the first to share something with the community!
          </p>
          {session && session.role === 'admin' && (
            <Link
              to="/blogs/new"
              className="mt-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Write your first post
            </Link>
          )}
        </div>
      ) : (
        /* Posts Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              session={session}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}