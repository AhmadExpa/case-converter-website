import React from 'react';

/**
 * A simple footer component.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs md:text-sm py-4 px-6 mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <span>&copy; {year} Case Converter. All rights reserved.</span>
        <div className="space-x-4">
          <a href="/about" className="hover:text-gray-700 dark:hover:text-gray-200">About Us</a>
          <a href="/terms" className="hover:text-gray-700 dark:hover:text-gray-200">Terms & Conditions</a>
          <a href="/advertising" className="hover:text-gray-700 dark:hover:text-gray-200">Advertising Policy</a>
          <a href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-200">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
