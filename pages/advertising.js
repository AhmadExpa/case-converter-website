import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdPlaceholder from '../components/AdPlaceholder';

export default function Advertising() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-4">
          Advertising Policy
        </h1>

        {/* <AdPlaceholder className="mx-auto max-w-4xl h-20" /> */}

        <div className="text-sm space-y-4 leading-relaxed max-w-4xl mx-auto">
          <p>
            This Advertising Policy explains how ads are displayed on our case
            converter website (the "Service"), how advertisers may interact with
            the platform, and how users can understand or control their ad
            experience. By using the Service, you agree to the terms below.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. Use of Advertising</h2>
          <p>
            The website displays advertisements primarily to support hosting,
            maintenance, and ongoing development. Ads may appear in various
            locations across the Service, including banners, inline placements,
            or responsive ad blocks.
          </p>
          <p>
            Advertisements may be served by third-party providers such as Google
            Ads / Google AdSense or other approved ad networks.
          </p>

          <h2 className="text-xl font-semibold mt-6">2. Third-Party Advertising Partners</h2>
          <p>
            We use third-party vendors to display ads. These vendors may use
            cookies, device identifiers, or similar technologies to collect
            information about your visits to this and other websites.
          </p>
          <p>
            These technologies help advertisers:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Display relevant and targeted advertisements.</li>
            <li>Measure the effectiveness of advertising campaigns.</li>
            <li>Limit how often a specific ad is shown.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">
            Google Advertising Services
          </h3>
          <p>
            Google may use advertising cookies (including the DoubleClick cookie)
            to personalize ads and measure their performance. Google's use of
            data is governed by the Google Privacy &amp; Terms.
          </p>
          <p>
            Users can control or disable Google's personalized ads through
            Google&apos;s Ads Settings page, depending on your region and
            available privacy controls.
          </p>

          <h2 className="text-xl font-semibold mt-6">3. Types of Ads We Display</h2>
          <p>Examples of ad types include:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Text-based ads</li>
            <li>Display banners</li>
            <li>Responsive and adaptive ad units</li>
            <li>Non-intrusive interest-based ads</li>
          </ul>
          <p>
            We do <strong>not</strong> allow pop-ups, misleading ads, malware,
            auto-download ads, or any format that disrupts user experience.
          </p>

          <h2 className="text-xl font-semibold mt-6">4. Sponsored Content</h2>
          <p>
            Occasionally, we may display sponsored content or promotional text
            clearly marked as "Sponsored" or "Advertisement". Sponsored content
            must comply with our internal quality and safety standards and must
            not mislead users.
          </p>

          <h2 className="text-xl font-semibold mt-6">5. Data Collection Related to Ads</h2>
          <p>
            Advertising partners may collect certain information such as:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Device information and browser details</li>
            <li>IP address (may be treated as personal data)</li>
            <li>Clicks and ad interaction metrics</li>
            <li>Pages visited and navigation behavior</li>
          </ul>
          <p>
            This data helps improve ad relevancy, maintain system performance,
            and prevent fraud or abuse.
          </p>

          <h2 className="text-xl font-semibold mt-6">6. User Control Over Ads</h2>
          <p>
            Users may have the ability to opt out of personalized ads depending
            on their region or local privacy regulations. These settings can be
            adjusted through:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your device or browser cookie preferences</li>
            <li>Ad network opt-out links</li>
            <li>Google Ads personalization settings</li>
          </ul>
          <p>
            Disabling personalized ads does not remove ads, but it may result in
            less relevant advertising.
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Restrictions on Advertisers</h2>
          <p>
            We do not permit advertisements that contain or promote:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Malware, illegal software, or harmful downloads</li>
            <li>Deceptive, misleading, or manipulative content</li>
            <li>Violence, hate speech, or explicit material</li>
            <li>Fraudulent schemes or financial scams</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">8. No Endorsement</h2>
          <p>
            Displaying an advertisement does not imply our endorsement or
            recommendation of the advertiser’s products, services, or content.
            We do not review or verify claims made within ad content.
          </p>

          <h2 className="text-xl font-semibold mt-6">9. Changes to This Advertising Policy</h2>
          <p>
            We may update this policy periodically. Any updates will appear on
            this page with an updated “Last updated” date. Continued use of the
            Service after changes means you accept the updated policy.
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
