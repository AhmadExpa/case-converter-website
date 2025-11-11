'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdPlaceholder from '../components/AdPlaceholder';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isItalic, setIsItalic] = useState(false);
  const [language, setLanguage] = useState('English');
  const [removeChars, setRemoveChars] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [formatOptions, setFormatOptions] = useState({
    trim: false,
    trimLines: false,
    removeWhitespace: false,
    stripHTML: false,
    stripExtraSpaces: false,
    stripEmptyLines: false,
    stripTabs: false,
    removeNonAlphanumeric: false,
    removeEmojis: false,
    removePunctuation: false,
  });
  const [stats, setStats] = useState({ chars: 0, words: 0, sentences: 0, lines: 0 });

  // Languages explicitly supported in the UI selector.
  const languages = [
    'Deutsch',
    'Ελληνικά',
    'English',
    'Español',
    'Filipino',
    'Français',
    'Magyar',
    'Italiano',
    'Polski',
    'Português',
    'Slovenščina',
    'Türkçe',
    'Українська',
    'अंग्रेजी',
  ];

  // Recompute stats any time text changes (Unicode-aware).
  useEffect(() => {
    const source = (outputText || inputText) || '';
    const chars = [...source].length;              // Unicode-safe char count
    const words = tokenizeWords(source).length;    // Unicode-aware word count
    const sentencesMatch = source.match(/[^.!?]+[.!?]+/g);
    const sentences = sentencesMatch ? sentencesMatch.length : source.trim() ? 1 : 0;
    const lines = source.split(/\n/u).length;
    setStats({ chars, words, sentences, lines });
  }, [inputText, outputText]);

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function handleCase(type) {
    let text = inputText;
    switch (type) {
      case 'sentence':
        text = text
          .toLowerCase()
          .replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu, (m) => m.toUpperCase());
        break;
      case 'lower':
        text = text.toLowerCase();
        break;
      case 'upper':
        text = text.toUpperCase();
        break;
      case 'capitalized':
        text = text.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase());
        break;
      case 'alternating':
        text = [...text]
          .map((char, idx) => (idx % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
          .join('');
        break;
      case 'title':
        text = text.toLowerCase().replace(/(^|\s)(\S)/g, (match) => match.toUpperCase());
        break;
      case 'inverse':
        text = [...text]
          .map((char) => (char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()))
          .join('');
        break;
      default:
        break;
    }
    setOutputText(text);
  }

  function duplicateWordFinder() {
    const words = tokenizeWords(inputText).map(w => w.toLowerCase());
    const counts = {};
    for (const w of words) counts[w] = (counts[w] || 0) + 1;
    const duplicates = Object.keys(counts).filter(k => counts[k] > 1);
    setOutputText(duplicates.length ? `Duplicate words: ${duplicates.join(', ')}` : 'No duplicate words found.');
  }
  function removeDuplicateLines() {
    const lines = inputText.split(/\n/u);
    const seen = new Set();
    const unique = [];
    lines.forEach((line) => {
      if (!seen.has(line)) {
        seen.add(line);
        unique.push(line);
      }
    });
    setOutputText(unique.join('\n'));
  }

  function handleRemoveChars() {
    if (!removeChars) return;
    const pattern = new RegExp('[' + escapeRegExp(removeChars) + ']', 'gu');
    setOutputText(inputText.replace(pattern, ''));
  }

  function handleRemoveFormatting() {
    let text = inputText;
    if (formatOptions.trim) text = text.trim();
    if (formatOptions.trimLines) {
      text = text
        .split(/\n/u)
        .map((line) => line.trim())
        .join('\n');
    }
    if (formatOptions.removeWhitespace) text = text.replace(/\s+/gu, '');
    if (formatOptions.stripHTML) text = text.replace(/<[^>]*>/gu, '');
    if (formatOptions.stripExtraSpaces) text = text.replace(/\s{2,}/gu, ' ');
    if (formatOptions.stripEmptyLines) {
      text = text
        .split(/\n/u)
        .filter((line) => line.trim() !== '')
        .join('\n');
    }
    if (formatOptions.stripTabs) text = text.replace(/\t/g, '');
    if (formatOptions.removeNonAlphanumeric) text = text.replace(/[^\p{L}\p{N}\s]/gu, '');
    if (formatOptions.removeEmojis) text = text.replace(/\p{Extended_Pictographic}/gu, '');
    if (formatOptions.removePunctuation) text = text.replace(/[\p{P}\p{S}]/gu, '');
    setOutputText(text);
  }

  function handleWordFrequency() {
    const words = tokenizeWords(inputText).map(w => w.toLowerCase());
    const total = words.length;
    if (!total) { setOutputText('No words to analyse.'); return; }
    const counts = {};
    for (const w of words) counts[w] = (counts[w] || 0) + 1;
    const lines = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([w, c]) => `• ${w} (${c} / ${((c / total) * 100).toFixed(2)}%)`);
    setOutputText(lines.join('\n'));
  }

  function handleRemoveUnderscores() {
    setOutputText(inputText.replace(/_/g, ' '));
  }

  function handleSentenceCount() {
    const chars = [...inputText].length;
    const words = inputText.trim() ? inputText.trim().split(/\s+/u).length : 0;
    const sentencesMatch = inputText.match(/[^.!?]+[.!?]+/g);
    const sentences = sentencesMatch ? sentencesMatch.length : inputText.trim() ? 1 : 0;
    const lines = inputText.split(/\n/u).length;
    setOutputText(`Characters: ${chars}\nWords: ${words}\nSentences: ${sentences}\nLines: ${lines}`);
  }

  function handleReplace() {
    if (!findText) return;
    const pattern = new RegExp(escapeRegExp(findText), 'gu');
    setOutputText(inputText.replace(pattern, replaceText));
  }

  function handleCopy() {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
  }

  function handleFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setInputText(content);
      };
      reader.readAsText(file);
    }
  }

  function handleDownloadFile() {
    const content = outputText || inputText;
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-center">Case Converter</h1>

        <AdPlaceholder className="mx-auto max-w-4xl h-20" />

        <p className="text-center text-sm text-gray-400">
          Simply enter your text and choose the case you want to convert it to.
        </p>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/2">
            <label className="block text-sm mb-2">Input</label>
            <textarea
              dir="auto"
              className={`w-full h-48 md:h-64 rounded-md p-3 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary ${isItalic ? 'italic' : ''
                }`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your content here"
            />
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <label className="inline-flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={isItalic}
                  onChange={() => setIsItalic(!isItalic)}
                  className="mr-2"
                />
                Italics
              </label>
              <label className="inline-flex items-center text-sm">
                <span className="mr-2">Upload File:</span>
                <input type="file" accept=".txt" onChange={handleFileUpload} className="text-sm" />
              </label>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <label className="block text-sm mb-2">Output</label>
            <textarea
              dir="auto"
              className={`w-full h-48 md:h-64 rounded-md p-3 bg-gray-800 border border-gray-700 focus:outline-none ${isItalic ? 'italic' : ''
                }`}
              value={outputText}
              readOnly
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleDownloadFile}
                className="px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-md text-sm hover:bg-primary-dark"
              >
                Download File
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleCase('sentence')} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
            Sentence case
          </button>
          <button onClick={() => handleCase('lower')} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
            lower case
          </button>
          <button onClick={() => handleCase('upper')} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
            UPPER CASE
          </button>
          <button onClick={() => handleCase('capitalized')} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
            Capitalized Case
          </button>
          <button onClick={() => handleCase('alternating')} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm whitespace-nowrap">
            aLtErNaTiNg cAsE
          </button>
          <button onClick={() => handleCase('title')} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
            Title Case
          </button>
          <button onClick={() => handleCase('inverse')} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm whitespace-nowrap">
            InVeRsE CaSe
          </button>

          <button onClick={handleDownloadFile} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm whitespace-nowrap">
            Download Text
          </button>

          <button onClick={duplicateWordFinder} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
            Duplicate Word Finder
          </button>
          <button onClick={removeDuplicateLines} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm whitespace-nowrap">
            Remove Duplicate Lines
          </button>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Chars to remove"
              value={removeChars}
              onChange={(e) => setRemoveChars(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm w-32"
            />
            <button onClick={handleRemoveChars} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
              Remove Characters
            </button>
          </div>

          <details className="bg-gray-800 border border-gray-700 rounded-md p-2 text-sm">
            <summary className="cursor-pointer select-none">Remove Text Formatting</summary>
            <div className="mt-2 space-y-1">
              {Object.keys(formatOptions).map((key) => (
                <label key={key} className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={formatOptions[key]}
                    onChange={() => setFormatOptions((opts) => ({ ...opts, [key]: !opts[key] }))}
                    className="mr-2"
                  />
                  {humanReadable(key)}
                </label>
              ))}
              <button
                onClick={handleRemoveFormatting}
                className="mt-2 px-2 py-1 bg-primary dark:bg-primary-dark text-white rounded"
              >
                Apply
              </button>
            </div>
          </details>

          <button onClick={handleWordFrequency} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm whitespace-nowrap">
            Word Frequency
          </button>
          <button onClick={handleRemoveUnderscores} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm whitespace-nowrap">
            Remove Underscores
          </button>
          <button onClick={handleSentenceCount} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm whitespace-nowrap">
            Sentence Counter
          </button>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Find"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm w-24"
            />
            <input
              type="text"
              placeholder="Replace"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm w-24"
            />
            <button onClick={handleReplace} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
              Replace
            </button>
          </div>

          <button onClick={handleCopy} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm whitespace-nowrap">
            Copy to Clipboard
          </button>

          <a
            href="https://www.buymeacoffee.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center space-x-1"
          >
            <span role="img" aria-label="coffee">☕</span>
            <span>Buy me a Coffee</span>
          </a>

          <button
            onClick={() => {
              setInputText('');
              setOutputText('');
              setRemoveChars('');
              setFindText('');
              setReplaceText('');
              setFormatOptions({
                trim: false,
                trimLines: false,
                removeWhitespace: false,
                stripHTML: false,
                stripExtraSpaces: false,
                stripEmptyLines: false,
                stripTabs: false,
                removeNonAlphanumeric: false,
                removeEmojis: false,
                removePunctuation: false,
              });
            }}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            Clear
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-400">
          Character Count: {stats.chars} | Word Count: {stats.words} | Sentence Count: {stats.sentences} | Line Count: {stats.lines}
        </div>

        <div className="mt-8">
          <AdPlaceholder className="w-full h-24" />
        </div>

        <div className="mt-8">
          <label className="block mb-2 text-sm">Languages supported:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded p-2 text-sm"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-500">
            Processing is Unicode-aware and works with the languages listed above (and most others) using Unicode properties.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
// Helper: Unicode-aware word tokenizer
function tokenizeWords(text, locale = 'und') {
  const s = (text || '').normalize('NFC'); // normalize combining marks
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const seg = new Intl.Segmenter(locale, { granularity: 'word' });
    return Array.from(seg.segment(s))
      .filter(({ isWordLike }) => isWordLike)
      .map(({ segment }) => segment);
  }
  // Fallback: sequences of letters/numbers in any script
  return (s.match(/[\p{L}\p{N}]+/gu) || []);
}

function humanReadable(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}
