import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdPlaceholder from '../components/AdPlaceholder';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-4">
          Privacy Policy
        </h1>

        {/* <AdPlaceholder className="mx-auto max-w-4xl h-20" /> */}

        <div className="text-sm space-y-4 leading-relaxed max-w-4xl mx-auto">
          <p>
            This Privacy Policy describes how we collect, use and protect information
            when you use our case converter website (the &quot;Service&quot;). By using
            the Service, you agree to the collection and use of information in
            accordance with this policy.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
          <p>
            We do not require you to create an account or provide personal details to
            use the core functionality of the case converter. However, we may collect
            certain information automatically when you visit the website.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Usage data:</strong> such as pages visited, time spent on pages,
              clicks, and general interaction with the website.
            </li>
            <li>
              <strong>Technical data:</strong> such as browser type, device type,
              operating system, and IP address (which may be treated as personal data
              in some jurisdictions).
            </li>
            <li>
              <strong>Ad-related data:</strong> information collected by third-party
              advertising partners such as Google to show relevant ads.
            </li>
          </ul>
          <p>
            Any text you input into the case converter tool is processed only to
            perform the conversion operation in your browser or on our servers. We do
            not intentionally use this content to personally identify you.
          </p>

          <h2 className="text-xl font-semibold mt-6">2. Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar technologies to operate and improve the Service,
            and to support advertising. Cookies are small text files stored on your
            device that help us remember your preferences and understand how you use
            the website.
          </p>
          <p>
            You can control or delete cookies through your browser settings. However,
            disabling cookies may affect the functionality of some parts of the
            website.
          </p>

          <h2 className="text-xl font-semibold mt-6">3. Advertising (Google Ads / AdSense)</h2>
          <p>
            We display advertisements on this website using Google Ads / Google
            AdSense and possibly other third-party advertising partners. These
            partners may use cookies and similar technologies to serve ads based on
            your visits to this and other websites.
          </p>
          <p>
            In particular, Google may use advertising cookies to:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Serve and display ads on this website.</li>
            <li>Measure the effectiveness of ads.</li>
            <li>Personalize ads based on your interests and previous browsing activity.</li>
          </ul>
          <p>
            You can learn more about how Google uses information from sites or apps
            that use its services and how to control your ad settings in your Google
            account&apos;s Ads settings or by visiting Google&apos;s official privacy
            and advertising pages.
          </p>
          <p>
            Depending on your location, you may also see a consent banner or settings
            dialog that allows you to opt in or out of personalized advertising and
            certain cookies.
          </p>

          <h2 className="text-xl font-semibold mt-6">4. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Operate, maintain and improve the Service.</li>
            <li>Monitor usage and performance of the website.</li>
            <li>Protect against fraud, abuse and technical issues.</li>
            <li>Display and measure the effectiveness of advertisements.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">5. Third-Party Services and Links</h2>
          <p>
            Our website may contain links to other websites and may use third-party
            services (such as analytics tools, ad networks or content providers). These
            third parties have their own privacy policies, and we are not responsible
            for their content, privacy practices, or how they handle data.
          </p>
          <p>
            We recommend that you review the privacy policies of any third-party sites
            or services you visit.
          </p>

          <h2 className="text-xl font-semibold mt-6">6. Data Retention</h2>
          <p>
            We retain usage and analytics information for as long as necessary to
            fulfill the purposes described in this policy, unless a longer retention
            period is required or permitted by law. We do not intentionally store the
            text you convert on the website beyond what is necessary to provide the
            Service.
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Children&apos;s Privacy</h2>
          <p>
            Our Service is not specifically directed to children under the age of 13
            (or the equivalent age of digital consent in your jurisdiction), and we do
            not knowingly collect personal information from children. If you believe
            that we have collected personal information from a child, please contact us
            so that we can delete it.
          </p>

          <h2 className="text-xl font-semibold mt-6">8. Security</h2>
          <p>
            We take reasonable measures to protect the information we collect from
            accidental or unlawful destruction, loss, alteration, and unauthorized
            access or disclosure. However, no method of transmission over the internet
            or method of electronic storage is 100% secure, so we cannot guarantee
            absolute security.
          </p>

          <h2 className="text-xl font-semibold mt-6">9. Your Choices and Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your
            personal data, such as the right to access, correct, delete or restrict the
            use of your information. You may also have the right to object to certain
            processing activities or to withdraw consent where processing is based on
            consent.
          </p>
          <p>
            To exercise these rights, please contact us using the contact information
            provided below. We may ask you to verify your identity before responding to
            such requests.
          </p>

          <h2 className="text-xl font-semibold mt-6">10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be
            posted on this page with an updated &quot;Last updated&quot; date. Changes
            become effective when they are posted on this page.
          </p>

         
          <p className="italic">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* <AdPlaceholder className="mx-auto max-w-4xl h-20" /> */}
      </main>
      <Footer />
    </div>
  );
}
