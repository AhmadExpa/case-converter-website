import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdPlaceholder from '../components/AdPlaceholder';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: connect to your API / email service
    console.log('Contact form submitted:', form);
    setStatus('Thanks for reaching out. I will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-2">
          Contact
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center mb-8 max-w-xl mx-auto">
          Share feedback, report an issue, or ask for a new feature for Case Converter.
        </p>

        {/* <AdPlaceholder className="mx-auto max-w-4xl h-20 mb-8" /> */}

        <div className="max-w-xl mx-auto">
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 md:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                  placeholder="Tell me how I can improve the case converter…"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 text-sm transition-colors w-full sm:w-auto"
              >
                Send message
              </button>

              {status && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  {status}
                </p>
              )}
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
