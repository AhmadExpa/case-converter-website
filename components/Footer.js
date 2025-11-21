import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white/90 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-center md:text-left">
          <span className="block text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100">
            Case Converter
          </span>
          <span className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Clean, fast tools for everyday text transformations.
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-300">

          <Link
            href="/privacy"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/advertising"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Advertising Policy
          </Link>
          <Link
            href="/contact"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
