import React from 'react';

/**
 * A simple placeholder for advertising banners. The component uses
 * a dotted border to illustrate where ads would appear. In a real
 * deployment this component could be replaced with ad scripts. For
 * now it simply displays the text “Google Ads” centered inside a
 * dashed box.
 */
export default function AdPlaceholder({ className = '' }) {
  return (
    <div
      className={`border border-dashed border-gray-600 rounded-md p-4 flex items-center justify-center text-sm text-gray-400 ${className}`}
    >
      Google Ads
    </div>
  );
}