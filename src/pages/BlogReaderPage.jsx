import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AvatarChip } from '../components/AvatarChip.jsx';
import { DeleteDialog } from '../components/DeleteDialog.jsx';
import { getPostById, deletePost } from '../utils/PostManager.js';
import { canEditPost, canDeletePost } from '../utils/AccessControl.js';

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }
    const found = getPostById(id);
    if (!found) {
      setNotFound(true);
    } else {
      setPost(found);
    }
  }, [id]);

  function handleDeleteClick() {
    setDeleteError('');
    setDeleteDialogOpen(true);
  }

  function handleDeleteCancel() {
    setDeleteDialogOpen(false);
  }

  function handleDeleteConfirm() {
    const result = deletePost(post.id, session);
    if (result.error) {
      setDeleteError(result.message || 'Failed to delete post.');
      setDeleteDialogOpen(false);
      return;
    }
    setDeleteDialogOpen(false);
    navigate('/blogs', { replace: true });
  }

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

  const canEdit = session && canEditPost(session, post);
  const canDelete = session && canDeletePost(session, post);

  return (
    <>
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

        {/* Article card */}
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <AvatarChip role={post.authorRole || 'viewer'} />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {post.authorDisplayName || post.author}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">
                  {formatDate(post.createdAt)}
                </span>

                {/* Action buttons */}
                {(canEdit || canDelete) && (
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <Link
                        to={`/blogs/${post.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5"
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
                        Edit
                      </Link>
                    )}
                    {canDelete && (
                      <button
                        onClick={handleDeleteClick}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {deleteError && (
              <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
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
                <span>{deleteError}</span>
              </div>
            )}

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                {post.content}
              </p>
            </div>
          </div>

          {/* Footer */}
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <div className="px-8 pb-6">
              <p className="text-xs text-gray-400">
                Last updated {formatDate(post.updatedAt)}
              </p>
            </div>
          )}
        </article>
      </div>

      <DeleteDialog
        isOpen={deleteDialogOpen}
        message={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}