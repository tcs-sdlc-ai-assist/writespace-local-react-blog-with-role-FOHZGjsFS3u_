import { useState } from 'react';
import { getAllUsers } from '../utils/UserManager.js';

const INITIAL_FORM = {
  displayName: '',
  username: '',
  password: '',
  confirmPassword: '',
  role: 'viewer',
};

export function UserForm({ onSubmit, onCancel, isSubmitting = false }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const newErrors = {};

    const displayName = form.displayName.trim();
    if (!displayName) {
      newErrors.displayName = 'Display name is required.';
    } else if (displayName.length < 2 || displayName.length > 30) {
      newErrors.displayName = 'Display name must be between 2 and 30 characters.';
    }

    const username = form.username.trim();
    if (!username) {
      newErrors.username = 'Username is required.';
    } else if (username.length < 3 || username.length > 20) {
      newErrors.username = 'Username must be between 3 and 20 characters.';
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      newErrors.username = 'Username must be alphanumeric.';
    } else {
      const existingUsers = getAllUsers();
      const exists = existingUsers.some((u) => u.username === username);
      if (exists) {
        newErrors.username = 'Username already exists.';
      }
    }

    if (!form.password) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!form.role || (form.role !== 'admin' && form.role !== 'viewer')) {
      newErrors.role = 'Role must be either "admin" or "viewer".';
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

    if (onSubmit) {
      onSubmit({
        displayName: form.displayName.trim(),
        username: form.username.trim(),
        password: form.password,
        role: form.role,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Display Name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="displayName"
          className="text-sm font-medium text-gray-700"
        >
          Display Name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          value={form.displayName}
          onChange={handleChange}
          placeholder="e.g. Alice Smith"
          className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
            errors.displayName
              ? 'border-rose-400 bg-rose-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        />
        {errors.displayName && (
          <p className="text-xs text-rose-600">{errors.displayName}</p>
        )}
      </div>

      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="username"
          className="text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          placeholder="e.g. alice123"
          className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
            errors.username
              ? 'border-rose-400 bg-rose-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        />
        {errors.username && (
          <p className="text-xs text-rose-600">{errors.username}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          placeholder="Min. 6 characters"
          className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
            errors.password
              ? 'border-rose-400 bg-rose-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        />
        {errors.password && (
          <p className="text-xs text-rose-600">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
            errors.confirmPassword
              ? 'border-rose-400 bg-rose-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-rose-600">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Role */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="role"
          className="text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-white ${
            errors.role
              ? 'border-rose-400 bg-rose-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <option value="viewer">👁️ Viewer</option>
          <option value="admin">👑 Admin</option>
        </select>
        {errors.role && (
          <p className="text-xs text-rose-600">{errors.role}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating…' : 'Create User'}
        </button>
      </div>
    </form>
  );
}