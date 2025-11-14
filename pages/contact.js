import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdPlaceholder from '../components/AdPlaceholder';

/**
 * Contact page. Displays static information on how users can get in
 * touch with the team. No form is provided as requested. A couple
 * advertising placeholders mirror the structure of other pages.
 */
export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-4">Contact Us</h1>
        <AdPlaceholder className="mx-auto max-w-4xl h-20" />
        <div className="text-sm space-y-3">
          <p>
            We'd love to hear from you! Whether you have a suggestion, a bug report or
            simply want to say hello, feel free to reach out using the details below.
            Our small team aims to respond to all inquiries within two business days.
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Email:</strong> <a href="mailto:new01sriram@gmail.com" className="text-primary hover:underline">new01sriram@gmail.com</a>
            </li>

          </ul>
          <p>
            You can also follow us on social media for updates and tips. We regularly share
            new features, tutorials and behind‑the‑scenes content on our platforms.
          </p>
        </div>
        <AdPlaceholder className="mx-auto max-w-4xl h-20" />
      </main>
      <Footer />
    </div>
  );
}