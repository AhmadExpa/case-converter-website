import Head from "next/head";
import { toolsDirectoryData } from "../utils/toolsDirectoryData";

export default function ToolsDirectoryPage() {
  return (
    <>
      <Head>
        <title>Online Tools Directory | Free Clock, PDF & Calculator Tools</title>
        <meta name="description" content="Browse our comprehensive directory of 100+ free online utility tools, featuring PDF converters, world clocks, spinners, text formatters, and calculators." />
        <link rel="canonical" href="https://www.quicktextformatter.com/tools-directory" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Online Tools Directory
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500">
            Access over 100 high-quality, free web utilities across our partner network. Instant tools for calculations, conversions, time tracking, randomizers, and documents.
          </p>
        </div>

        <div className="space-y-16">
          {toolsDirectoryData.map((section, sectionIdx) => (
            <div key={sectionIdx} className="border-t border-gray-200 pt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {section.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.links.map((link, linkIdx) => (
                  <a
                    key={linkIdx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-indigo-500 transition-all duration-300 group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-2">
                      {link.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {link.desc}
                    </p>
                    <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 group-hover:underline">
                      Open Tool
                      <svg className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
