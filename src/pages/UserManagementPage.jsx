import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { UserForm } from '../components/UserForm.jsx';
import { UserTable } from '../components/UserTable.jsx';
import { DeleteDialog } from '../components/DeleteDialog.jsx';
import { getAllUsers, createUser, deleteUser } from '../utils/UserManager.js';

export function UserManagementPage() {
  const { session } = useAuth();

  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  function handleCreateUser(formData) {
    setIsSubmitting(true);
    setCreateError('');
    setCreateSuccess('');

    const result = createUser(formData, session);

    if (result.error) {
      setCreateError(result.message || 'Failed to create user. Please try again.');
      setIsSubmitting(false);
      return;
    }

    setUsers(getAllUsers());
    setCreateSuccess(`User "${formData.displayName}" was created successfully.`);
    setIsSubmitting(false);
  }

  function handleDeleteClick(user) {
    setUserToDelete(user);
    setDeleteError('');
    setDeleteDialogOpen(true);
  }

  function handleDeleteCancel() {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  }

  function handleDeleteConfirm() {
    if (!userToDelete) return;

    const result = deleteUser(userToDelete.username, session);

    if (result.error) {
      setDeleteError(result.message || 'Failed to delete user.');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      return;
    }

    setUsers(getAllUsers());
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create new user accounts and manage existing members.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create User Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Create New User</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add a new member to WriteSpace.
                </p>
              </div>

              {/* Success Banner */}
              {createSuccess && (
                <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{createSuccess}</span>
                </div>
              )}

              {/* Error Banner */}
              {createError && (
                <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
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
                  <span>{createError}</span>
                </div>
              )}

              <UserForm
                onSubmit={handleCreateUser}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* User Table */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {users.length} {users.length === 1 ? 'member' : 'members'} total
                </p>
              </div>
            </div>

            {/* Delete Error Banner */}
            {deleteError && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
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

            <UserTable
              users={users}
              session={session}
              onDelete={handleDeleteClick}
            />
          </div>
        </div>
      </div>

      <DeleteDialog
        isOpen={deleteDialogOpen}
        message={
          userToDelete
            ? `Are you sure you want to delete "${userToDelete.displayName}" (@${userToDelete.username})? This action cannot be undone.`
            : 'Are you sure you want to delete this user? This action cannot be undone.'
        }
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}