import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getPostById, editPost } from '../utils/PostManager.js';
import { canEditPost } from '../utils/AccessControl.js';

export function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    const found = getPostById(id);
    if (!found) {
      setNotFound(true);
      return;
    }

    if (!session || !canEditPost(session, found)) {
      navigate('/blogs', { replace: true });
      return;
    }

    setPost(found);
    setForm({
      title: found.title || '',
      excerpt: found.excerpt || '',
      content: found.content || '',
    });
  }, [id, session, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setGlobalError('');
  }

  function validate() {
    const newErrors = {};

    const title = form.title.trim();
    if (!title) {
      newErrors.title = 'Title is required.';
    } else if (title.length < 3 || title.length > 100) {
      newErrors.title = 'Title must be between 3 and 100 characters.';
    }

    const excerpt = form.excerpt.trim();
    if (!excerpt) {
      newErrors.excerpt = 'Excerpt is required.';
    } else if (excerpt.length < 1 || excerpt.length > 200) {
      newErrors.excerpt = 'Excerpt must be between 1 and 200 characters.';
    }

    const content = form.content.trim();
    if (!content) {
      newErrors.content = 'Content is required.';
    } else if (content.length < 1 || content.length > 5000) {
      newErrors.content = 'Content must be between 1 and 5000 characters.';
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setGlobalError('');

    const result = editPost(
      id,
      {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
      },
      session
    );

    if (result.error) {
      setGlobalError(result.message || 'Failed to update post. Please try again.');
      setIsSubmitting(false);
      return;
    }

    navigate(`/blogs/${id}`, { replace: true });
  }

  const contentLength = form.content.length;
  const contentMax = 5000;

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center gap-4">
        <span className="text-5xl">📭</span>
        <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          The post you're looking for doesn't exist or may have been deleted.
        </p>
        <Link
          to="/blogs"
          className="mt-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <div className="mb-6">
        <Link
          to={`/blogs/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Post
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update your post details below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          {/* Global Error Banner */}
          {globalError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              <span>{globalError}</span>
            </div>
          )}

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter a compelling title…"
              disabled={isSubmitting}
              className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.title
                  ? 'border-rose-400 bg-rose-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-600">{errors.title}</p>
            )}
          </div>

          {/* Excerpt */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="excerpt"
              className="text-sm font-medium text-gray-700"
            >
              Excerpt
              <span className="ml-1 text-xs text-gray-400 font-normal">
                (short summary shown in listings)
              </span>
            </label>
            <input
              id="excerpt"
              name="excerpt"
              type="text"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="A brief summary of your post…"
              disabled={isSubmitting}
              className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.excerpt
                  ? 'border-rose-400 bg-rose-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            />
            {errors.excerpt && (
              <p className="text-xs text-rose-600">{errors.excerpt}</p>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="content"
                className="text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <span
                className={`text-xs ${
                  contentLength > contentMax
                    ? 'text-rose-500'
                    : 'text-gray-400'
                }`}
              >
                {contentLength} / {contentMax}
              </span>
            </div>
            <textarea
              id="content"
              name="content"
              rows={14}
              value={form.content}
              onChange={handleChange}
              placeholder="Write your post content here…"
              disabled={isSubmitting}
              className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-y disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.content
                  ? 'border-rose-400 bg-rose-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            />
            {errors.content && (
              <p className="text-xs text-rose-600">{errors.content}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <Link
              to={`/blogs/${id}`}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}