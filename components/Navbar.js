import React from 'react';
import Link from 'next/link';

/**
 * Primary navigation bar for the website.
 *
 * The navigation includes links to the home page, about page,
 * contact page and a terms page. The title on the left doubles as a
 * link back to the home page. All navigation items are styled for
 * dark mode.
 */
export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-gray-100 py-4 px-6 flex justify-between items-center shadow-md">
      <Link href="/" className="text-xl font-semibold hover:text-primary">
        Case&nbsp;Converter
      </Link>

    </nav>
  );
}