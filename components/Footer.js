import React from 'react';

/**
 * A simple footer component. It shows the current year and provides
 * placeholder as for privacy policy and other legal pages. Feel free
 * to expand this component with additional as or information.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-gray-400 text-xs md:text-sm py-4 px-6 mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <span>&copy; {year} Case Converter. All rights reserved.</span>
        <div className="space-x-4">
          {/* Placeholder as; these could point to real pages */}

          <a href="/about" className="hover:text-gray-300">About</a>
          <a href="/terms" className="hover:text-gray-300">T&C</a>
          <a href="/contact" className="hover:text-gray-300">Contact</a>
        </div>
      </div>
    </footer>
  );
}