import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdPlaceholder from '../components/AdPlaceholder';

/**
 * Terms and Conditions page. This page provides placeholder legal
 * information to satisfy navigation requirements. Replace this text
 * with real terms and conditions before deploying the application.
 */
export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-4">Terms and Conditions</h1>
        {/* <AdPlaceholder className="mx-auto max-w-4xl h-20" /> */}
        <div className="text-sm space-y-4 leading-relaxed">
          <p>
            The contents of this website are provided for general informational purposes only.
            While we endeavour to keep the information up to date and correct, we make no
            representations or warranties of any kind, express or implied, about the
            completeness, accuracy, reliability, suitability or availability with respect to
            the website or the information contained on the website for any purpose. Any
            reliance you place on such information is therefore strictly at your own risk.
          </p>
          <p>
            Under no circumstances shall the owners or contributors of this site be liable
            for any loss or damage including without limitation, indirect or consequential
            loss or damage, or any loss or damage whatsoever arising from loss of data or
            profits arising out of, or in connection with, the use of this website. Use the
            tools provided here at your discretion and always double‑check important
            results.
          </p>
          <p>
            Through this website you may be able to link to other websites which are not
            under our control. We have no influence over the nature, content and
            availability of those sites. The inclusion of any links does not necessarily
            imply a recommendation or endorsement of the views expressed within them. Every
            effort is made to keep the website up and running smoothly. However, the
            owners take no responsibility for, and will not be liable for, the website
            being temporarily unavailable due to technical issues beyond our control.
          </p>
        </div>
        {/* <AdPlaceholder className="mx-auto max-w-4xl h-20" /> */}
      </main>
      <Footer />
    </div>
  );
}