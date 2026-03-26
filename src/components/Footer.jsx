import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span>✍️</span>
              <span>WriteSpace</span>
            </Link>
            <p className="text-sm text-gray-500">A place to read, write, and grow.</p>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/blogs"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Blogs
            </Link>
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Login
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            &copy; {currentYear} WriteSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}