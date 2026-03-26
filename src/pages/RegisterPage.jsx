import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { registerUser } from '../utils/UserManager.js';

export function RegisterPage() {
  const { session, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    displayName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      if (session.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    }
  }, [session, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setGlobalError('');
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

    const result = registerUser({
      displayName: form.displayName.trim(),
      username: form.username.trim(),
      password: form.password,
      role: 'viewer',
    });

    if (result.error) {
      if (result.message && result.message.toLowerCase().includes('username')) {
        setErrors({ username: result.message });
      } else {
        setGlobalError(result.message || 'Registration failed. Please try again.');
      }
      setIsSubmitting(false);
      return;
    }

    const loginResult = login(form.username.trim(), form.password);

    if (loginResult.error) {
      setGlobalError('Account created! Please sign in.');
      setIsSubmitting(false);
      navigate('/login', { replace: true });
      return;
    }

    navigate('/blogs', { replace: true });
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <span className="text-4xl">✍️</span>
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500">Join WriteSpace and start reading today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
                disabled={isSubmitting}
                className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
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
                disabled={isSubmitting}
                className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
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
                disabled={isSubmitting}
                className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
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
                disabled={isSubmitting}
                className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  errors.confirmPassword
                    ? 'border-rose-400 bg-rose-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-rose-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}