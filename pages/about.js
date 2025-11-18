import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdPlaceholder from '../components/AdPlaceholder';

/**
 * About page. This page provides a long description of the tool and
 * its mission. The content below exceeds 500 words, providing ample
 * text to illustrate formatting, layout and responsiveness. A couple
 * of advertising placeholders are included to mirror the main page.
 */
export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-4">About Us</h1>
        {/* <AdPlaceholder className="mx-auto max-w-4xl h-20" /> */}
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Welcome to our Case Converter website, your one‑stop destination for a suite of
            intuitive text transformation tools. Built by a small team of passionate
            developers and writers, this site was created to streamline the way you edit and
            prepare text for everything from research papers to social media posts. We
            believe that working with text should be simple, elegant and efficient. Our
            mission is to empower everyone—students, authors, marketers and programmers
            alike—to manipulate their text with ease, accuracy and a touch of delight. With a
            strong emphasis on privacy, everything you do here happens directly in your
            browser; your data never leaves your device unless you choose to download it.
          </p>
          <p>
            Over the years, we noticed a recurring problem: many people repeatedly searched
            for tiny utilities to convert their text to uppercase, remove duplicate lines,
            strip underscores, count words or find repeated phrases. Rather than juggling
            multiple websites with intrusive ads and inconsistent interfaces, we imagined a
            single, cohesive platform that brought all of these capabilities together. The
            result is this website. Every feature you see here, from case conversion to
            word frequency analysis, was inspired by real‑world workflows. We consulted
            writers looking to refine their manuscripts, data analysts cleaning messy
            exports, and engineers preparing strings for code. Their feedback shaped a tool
            that is both powerful and approachable.
          </p>
          <p>
            Our commitment to continuous improvement means that we listen carefully to user
            suggestions. When someone asked for a way to highlight duplicate words, we
            didn’t just add a button; we built a smart parser that ignores punctuation and
            normalises case before comparison. When another user requested support for
            international languages, we added a language selector and ensured our code
            properly handles accented characters and right‑to‑left scripts. Today, you can
            paste text from virtually any language and expect consistent results. This
            dedication to inclusivity underscores our belief that technology should be
            accessible to everyone, no matter their background or the characters they use.
          </p>
          <p>
            Beyond the features themselves, we care deeply about presentation. Our dark
            theme reduces eye strain during long editing sessions and lends the site a
            modern aesthetic. Responsive design ensures the interface looks just as great on
            a phone in Islamabad as it does on a desktop in Karachi. Every button and
            control has been thoughtfully spaced for ease of use on both touch and pointer
            devices. We’ve also reserved space for future integrations, including non‑intrusive
            advertisements that help us keep the service free for everyone. Should you wish
            to support our work, you’ll find a small “Buy me a Coffee” link on several
            pages—every contribution fuels further development.
          </p>
          <p>
            As we look ahead, our roadmap includes even more text manipulation tools, rich
            import/export options and collaboration features that allow you to share your
            work seamlessly with colleagues. We’re exploring browser extensions and a
            desktop companion app so you can access the convenience of our tools wherever
            you write. Rest assured, however, that the core principles will remain the
            same: simplicity, privacy and respect for your time. Thank you for choosing our
            website. We hope it becomes a trusted companion in your daily workflow and we
            invite you to share your stories and suggestions with us. Together we can make
            handling text not just bearable, but a pleasure.
          </p>
          <p>
            Our team operates out of Islamabad, Pakistan, but our reach is global. We
            understand that language is the key to connection and we continue to expand our
            support for different scripts and cultural nuances. If you encounter an issue
            specific to your language or workflow, please do not hesitate to contact us.
            This project is more than code—it’s a community resource built on trust and
            cooperation. Each feedback email, bug report and word of encouragement pushes
            us to refine and extend what we’ve built. Whether you’re using our tools to
            prepare an important document or simply exploring what they can do, know that
            your voice matters here. Thank you for being a part of our journey.
          </p>
        </div>
        {/* <AdPlaceholder className="mx-auto max-w-4xl h-20" /> */}
      </main>
      <Footer />
    </div>
  );
}