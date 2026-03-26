import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { createPost } from '../utils/PostManager.js';

export function WritePage() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const result = createPost(
      {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
      },
      session
    );

    if (result.error) {
      setGlobalError(result.message || 'Failed to create post. Please try again.');
      setIsSubmitting(false);
      return;
    }

    navigate('/blogs', { replace: true });
  }

  const contentLength = form.content.length;
  const contentMax = 5000;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <div className="mb-6">
        <Link
          to="/blogs"
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
          Back to Blogs
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Write a New Post</h1>
          <p className="text-sm text-gray-500 mt-1">
            Share your thoughts and ideas with the community.
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
              to="/blogs"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Publishing…' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}