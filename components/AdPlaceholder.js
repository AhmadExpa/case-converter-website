import React from 'react';

/**
 * Simple placeholder for advertising banners.
 */
export default function AdPlaceholder({ className = '' }) {
  return (
    <div
      className={`border border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-white/70 dark:bg-gray-800/60 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 ${className}`}
    >
      Google Ads
    </div>
  );
}
