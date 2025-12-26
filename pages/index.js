import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import { analyzeText } from '../utils/analytics';
import { convertText, parseLineSelection } from '../utils/converters';

const defaultOptions = {
    style: '',
    scope: 'entire',
    lineSelection: '',

    // Apply Conversion To
    applyNumbers: false,
    applySymbols: false,
    applyAccented: false,
    applyEmoji: false,

    // Skip Conversion For
    skipFirstWord: false,
    skipLastWord: false,
    skipFirstNWords: 0,
    skipLastNWords: 0,
    skipFirstSentence: false,
    skipLastSentence: false,
    skipFirstNSentences: 0,
    skipLastNSentences: 0,
    skipShorterThan: 0,
    skipLongerThan: 0,
    skipAllCaps: false,
    skipLowercase: false,
    skipMixedCase: false,
    skipNumbers: false,
    skipSymbols: false,

    // Structure Preservation
    ignoreQuotes: false,
    ignoreParentheses: false,
    ignoreBrackets: false,
    ignoreBraces: false,
    ignoreHTML: false,
    preserveCapitalization: false,
    stopWords: '',
};

export default function Home() {
    const [text, setText] = useState('');
    const [convertedText, setConvertedText] = useState('');
    const [activeTab, setActiveTab] = useState('converter');
    const [subTab, setSubTab] = useState('input');
    const [fileName, setFileName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Theme State
    const [isDark, setIsDark] = useState(false);

    // Analytics State
    const [analytics, setAnalytics] = useState(analyzeText(''));

    // Conversion Options State
    const [options, setOptions] = useState({ ...defaultOptions });

    useEffect(() => {
        setAnalytics(analyzeText(text));
    }, [text]);

    // Theme Initialization
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storedTheme = window.localStorage.getItem('theme');
        const prefersDark =
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;

        const initialDark =
            storedTheme === 'dark' || (!storedTheme && prefersDark);

        setIsDark(initialDark);
        const root = document.documentElement;
        if (initialDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev;
            if (typeof window !== 'undefined') {
                const root = document.documentElement;
                if (next) {
                    root.classList.add('dark');
                    window.localStorage.setItem('theme', 'dark');
                } else {
                    root.classList.remove('dark');
                    window.localStorage.setItem('theme', 'light');
                }
            }
            return next;
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'text/plain') {
            alert('Only text files are allowed.');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setText(event.target.result);
            setFileName(file.name);
            setErrorMsg('');
        };
        reader.readAsText(file);
    };

    const handleClear = () => {
        setText('');
        setConvertedText('');
        setFileName('');
        setErrorMsg('');
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        setOptions({ ...defaultOptions });
    };

    const handleConvert = () => {
        setErrorMsg('');

        if (!text) {
            setErrorMsg('Add text to convert.');
            return;
        }

        if (!options.style) {
            setErrorMsg('Select a case mode to convert.');
            return;
        }

        let lineNumbers = [];

        if (options.scope === 'identifiers') {
            const sIndex = text.indexOf('$$$START$$$');
            const eIndex = text.indexOf('$$$END$$$');

            if (sIndex === -1 || eIndex === -1) {
                setErrorMsg('Error: $$$START$$$ and $$$END$$$ markers must both be present.');
                return;
            }
            if (sIndex > eIndex) {
                setErrorMsg('Error: $$$START$$$ must appear before $$$END$$$.');
                return;
            }
        }

        if (options.scope === 'lines') {
            const totalLines = text.split(/\r?\n/).length;
            const { error, lines } = parseLineSelection(options.lineSelection, totalLines);
            if (error) {
                setErrorMsg(error);
                return;
            }
            lineNumbers = lines;
        }

        const stopWords = options.stopWords
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter((s) => s);

        const conversionOptions = {
            ...options,
            stopWords,
            lineNumbers,
        };

        const result = convertText(text, conversionOptions);
        setConvertedText(result);
        setSubTab('output');
    };

    const handleDownload = () => {
        if (!convertedText) return;
        const blob = new Blob([convertedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted.txt';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleStyleToggle = (styleValue) => {
        setOptions(prev => ({
            ...prev,
            style: prev.style === styleValue ? '' : styleValue,
        }));
    };

    // Conflict Resolution Helper
    const setOptionWithConflict = (key, value) => {
        setOptions(prev => {
            const sanitizedValue = typeof value === 'number' && value < 0 ? 0 : value;
            const newOptions = { ...prev, [key]: sanitizedValue };

            // Mutual Exclusions: Skip vs Skip N
            if (key === 'skipFirstWord' && value) newOptions.skipFirstNWords = 0;
            if (key === 'skipFirstNWords' && value > 0) newOptions.skipFirstWord = false;

            if (key === 'skipLastWord' && value) newOptions.skipLastNWords = 0;
            if (key === 'skipLastNWords' && value > 0) newOptions.skipLastWord = false;

            if (key === 'skipFirstSentence' && value) newOptions.skipFirstNSentences = 0;
            if (key === 'skipFirstNSentences' && value > 0) newOptions.skipFirstSentence = false;

            if (key === 'skipLastSentence' && value) newOptions.skipLastNSentences = 0;
            if (key === 'skipLastNSentences' && value > 0) newOptions.skipLastSentence = false;

            return newOptions;
        });
    };

    const titleStyles = [
        {
            code: 'AP',
            label: 'AP Style (simplified)',
            detail: 'Experimental: principal words capitalized; short prepositions stay lowercase.',
            tooltip: 'Simplified AP rules; results may match Chicago for common phrases.',
        },
        {
            code: 'Chicago',
            label: 'Chicago Style (simplified)',
            detail: 'Experimental: major words capitalized; minor words stay lowercase.',
            tooltip: 'Simplified Chicago rules; often identical to AP on normal text.',
        },
    ];
    const genericStyles = [
        { code: 'UPPERCASE', label: 'UPPERCASE', detail: 'Every letter to uppercase.' },
        { code: 'lowercase', label: 'lowercase', detail: 'Every letter to lowercase.' },
        { code: 'Sentence case', label: 'Sentence case', detail: 'Capitalize the first word of each sentence; lower the rest.' },
    ];

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-200 dark:bg-gray-900">
            <Head>
                <title>Precision Case Converter</title>
                <meta name="description" content="A Precision Case Converter for Professional & Academic Writing" />
            </Head>

            {/* Theme Toggle Overlay */}
            <div className="absolute top-4 right-4 z-50">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex items-center gap-2 px-3 py-1 text-xs sm:text-sm rounded-full border border-gray-300 bg-white shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                    aria-label="Toggle dark or light mode"
                >

                    {/* Mobile: Icon Only */}
                    <span className="sm:hidden text-lg">
                        {isDark ? (
                            // Moon Icon
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                        ) : (
                            // Sun Icon
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                            </svg>
                        )}
                    </span>

                    {/* Desktop: Text + Slider */}
                    <span className="hidden sm:inline-flex items-center gap-2">
                        <span>{isDark ? 'Dark mode' : 'Light mode'}</span>
                        <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-300 dark:bg-gray-600">
                            <span
                                className={
                                    'inline-block h-4 w-4 rounded-full bg-white transform transition-transform ' +
                                    (isDark ? 'translate-x-4' : 'translate-x-1')
                                }
                            />
                        </span>
                    </span>
                </button>
            </div>

            <main className="flex-grow container mx-auto px-4 py-8 relative">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                        A Precision Case Converter for Professional & Academic Writing
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Convert text with confidence using professional title-case standards, smart analytics, and precision controls—designed for accuracy, not guesswork.
                    </p>
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 grid grid-cols-1 md:grid-cols-2 gap-2 text-left max-w-4xl mx-auto">
                        <div className="flex items-start"><span className="mr-2 text-orange-500">•</span> Professional Title Case Conversion using AP, APA, Chicago, MLA, Bluebook, and AMA standards</div>
                        <div className="flex items-start"><span className="mr-2 text-orange-500">•</span> Smart Text Analytics for characters, words, sentences, paragraphs, and structure</div>
                        <div className="flex items-start"><span className="mr-2 text-orange-500">•</span> Identifier-Based & Scoped Conversion to modify only selected portions of text</div>
                        <div className="flex items-start"><span className="mr-2 text-orange-500">•</span> Selective Rules & Skip Controls for words, sentences, and patterns</div>
                        <div className="flex items-start"><span className="mr-2 text-orange-500">•</span> Formatting Preservation to protect existing capitalization and structure</div>
                        <div className="flex items-start"><span className="mr-2 text-orange-500">•</span> Safe, Accurate Transformation—convert exactly what you intend, nothing more</div>
                    </div>
                </div>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setActiveTab('converter')}
                        className={`px-6 py-2 rounded-l-lg font-medium transition-colors ${activeTab === 'converter' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'}`}
                    >
                        Converter
                    </button>
                    <button
                        onClick={() => setActiveTab('how-it-works')}
                        className={`px-6 py-2 rounded-r-lg font-medium transition-colors ${activeTab === 'how-it-works' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'}`}
                    >
                        How It Works!
                    </button>
                </div>

                {activeTab === 'converter' && (
                    <div className="space-y-8">

                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            {/* Left Column: Input or Output View */}
                            <div className="flex-1 w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300">
                                <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                                    <h2 className="text-xl font-semibold dark:text-white">
                                        {subTab === 'input' ? '1. Input Text / File Upload' : 'Output Result'}
                                    </h2>
                                    <button
                                        onClick={() => setSubTab(subTab === 'input' ? 'output' : 'input')}
                                        className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 flex items-center transition-colors"
                                    >
                                        {subTab === 'input' ? (
                                            <>
                                                View Output <span className="ml-1 text-lg">→</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="mr-1 text-lg">←</span> Back to Input
                                            </>
                                        )}
                                    </button>
                                </div>

                                {subTab === 'input' ? (
                                    /* Input View Content */
                                    <div className="animate-fade-in-up">
                                        <input
                                            type="file"
                                            accept=".txt"
                                            onChange={handleFileUpload}
                                            className="block w-full text-sm text-gray-500
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-full file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-orange-50 file:text-orange-700
                                          hover:file:bg-orange-100
                                          dark:file:bg-gray-700 dark:file:text-orange-400
                                        "
                                        />
                                        {fileName && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loaded: {fileName}</p>}

                                        <textarea
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder="Paste your text or upload a Text File..."
                                            className="mt-4 w-full h-96 p-4 rounded-md border border-gray-300 bg-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 transition-colors font-mono resize-y"
                                        />

                                        <div className="flex justify-between items-center mt-2">
                                            <button
                                                onClick={handleClear}
                                                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Output View Content */
                                    <div className="animate-fade-in-up">
                                        <textarea
                                            readOnly
                                            value={convertedText}
                                            className="w-full h-96 p-4 rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 transition-colors font-mono resize-y"
                                            placeholder="Converted text will appear here..."
                                        />
                                        <div className="mt-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => navigator.clipboard.writeText(convertedText)}
                                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                                Copy to Clipboard
                                            </button>
                                            <button
                                                onClick={handleDownload}
                                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-medium transition-colors flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"></path></svg>
                                                Download .txt
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Sidebar: Scope > Analytics > Convert (Persistent) */}
                            <div className="w-full md:w-1/3 flex flex-col gap-4">

                                {/* Scope Selection */}
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-sm shadow-sm">
                                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-2">Scope</h4>
                                    <select
                                        value={options.scope}
                                        onChange={(e) => setOptions({ ...options, scope: e.target.value })}
                                        className="w-full text-sm border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white p-2"
                                    >
                                        <option value="entire">Entire Text</option>
                                        <option value="identifiers">Between identifiers ($$$...$$$)</option>
                                        <option value="lines">Selected Lines Only</option>
                                    </select>

                                    {options.scope === 'identifiers' && (
                                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                                            Converts only the text between $$$START$$$ and $$$END$$$ markers; markers stay intact.
                                        </p>
                                    )}
                                    {options.scope === 'lines' && (
                                        <div className="mt-2 text-xs space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Line numbers or ranges (e.g., 1,2,5-10)"
                                                value={options.lineSelection}
                                                onChange={(e) => setOptions({ ...options, lineSelection: e.target.value })}
                                                className="w-full border rounded p-2 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                                            />
                                            <p className="text-[11px] text-gray-500 dark:text-gray-300">
                                                Only these lines will be converted. Invalid references will block conversion with a clear message.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Analytics */}
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-sm shadow-sm">
                                    <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2 border-b pb-1">Analytics</h3>
                                    <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                                        <div>Chars: <span className="font-mono font-bold">{analytics.charCount}</span></div>
                                        <div>Words: <span className="font-mono font-bold">{analytics.wordCount}</span></div>
                                        <div>Sentences: <span className="font-mono font-bold">{analytics.sentenceCount}</span></div>
                                        <div>Lines: <span className="font-mono font-bold">{analytics.lineCount}</span></div>
                                        <div>Paragraphs: <span className="font-mono font-bold">{analytics.paragraphCount}</span></div>
                                        <div>Unique Words: <span className="font-mono font-bold">{analytics.uniqueWordCount}</span></div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Common Words (Top 3)</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {analytics.topWords.map((w, i) => (
                                                    <span key={i} className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded text-xs">{w.word} ({w.count})</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Common Letters (Top 3)</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {analytics.topLetters.map((l, i) => (
                                                    <span key={i} className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded text-xs">{l.letter} ({l.count})</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Longest Words (Top 3)</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {analytics.longestWords.map((w, i) => (
                                                    <span key={i} className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded text-xs overflow-hidden text-ellipsis max-w-full" title={w.word}>{w.word} ({w.length})</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Sentence Structure</h4>
                                            <div className="max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                                                {analytics.sentenceStructure.map((s, i) => (
                                                    <div key={i} className="text-xs text-gray-600 dark:text-gray-300 mb-0.5">
                                                        {s.count} sentence{s.count > 1 ? 's' : ''} with {s.wordCount} words, {s.charCount} characters
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConvert}
                                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-105"
                                >
                                    Convert
                                </button>
                                {errorMsg && <p className="mt-2 text-xs font-semibold text-center text-red-500">{errorMsg}</p>}
                                <p className="text-xs text-gray-500 text-center">
                                    By clicking convert, you agree to the applied settings overriding the current text.
                                </p>
                            </div>
                        </div>

                        {/* Controls Section (2 Columns) - Now Persistent below the main row */}
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Style Selection */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1 dark:text-white">Case Modes</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Single-select cards; click again to deselect.</p>
                                    </div>
                                    <span className="text-[11px] px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-200 dark:border-orange-800">One active at a time</span>
                                </div>

                                <div className="mt-4 space-y-5">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Title Case Standards</p>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {titleStyles.map(style => {
                                                const selected = options.style === style.code;
                                                return (
                                                    <button
                                                        key={style.code}
                                                        type="button"
                                                        onClick={() => handleStyleToggle(style.code)}
                                                        aria-pressed={selected}
                                                        title={style.tooltip}
                                                        className={`w-full text-left rounded-lg border p-3 transition shadow-sm hover:-translate-y-0.5 hover:shadow-md ${selected ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 dark:border-orange-500' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                                                {style.label}
                                                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600">Experimental</span>
                                                            </span>
                                                            <span className={`text-[11px] px-2 py-0.5 rounded-full ${selected ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
                                                                {selected ? 'Selected' : 'Tap to use'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{style.detail}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Generic Case</p>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {genericStyles.map(style => {
                                                const selected = options.style === style.code;
                                                return (
                                                    <button
                                                        key={style.code}
                                                        type="button"
                                                        onClick={() => handleStyleToggle(style.code)}
                                                        aria-pressed={selected}
                                                        className={`w-full text-left rounded-lg border p-3 transition shadow-sm hover:-translate-y-0.5 hover:shadow-md ${selected ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 dark:border-orange-500' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-semibold text-gray-800 dark:text-gray-100">{style.label}</span>
                                                            <span className={`text-[11px] px-2 py-0.5 rounded-full ${selected ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
                                                                {selected ? 'Selected' : 'Tap to use'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{style.detail}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selective Controls */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-1 dark:text-white">Selective Controls</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Precedence: Scope → Structure → Skip rules → Apply filters → Convert.</p>
                                <div className="space-y-6 max-h-128 overflow-y-auto pr-2 custom-scrollbar">


                                    {/* Apply Conversion To */}
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Apply Conversion To</h4>
                                            <span className="text-[11px] text-gray-500 dark:text-gray-400">Leave all unchecked to convert everything.</span>
                                        </div>
                                        <div className="space-y-2 mt-2">
                                            <label className="flex items-start">
                                                <input type="checkbox" checked={options.applyNumbers} onChange={(e) => setOptions({ ...options, applyNumbers: e.target.checked })} className="rounded text-orange-600 mt-1" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Words containing numbers (e.g., A1, v2)</span>
                                            </label>
                                            <label className="flex items-start">
                                                <input type="checkbox" checked={options.applySymbols} onChange={(e) => setOptions({ ...options, applySymbols: e.target.checked })} className="rounded text-orange-600 mt-1" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Words containing symbols (e.g., rock&roll, end-to-end)</span>
                                            </label>
                                            <label className="flex items-start">
                                                <input type="checkbox" checked={options.applyAccented} onChange={(e) => setOptions({ ...options, applyAccented: e.target.checked })} className="rounded text-orange-600 mt-1" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Words containing accented letters <span className="text-gray-500 dark:text-gray-400 text-xs">(examples: é, ñ, ü)</span></span>
                                            </label>
                                            <label className="flex items-start">
                                                <input type="checkbox" checked={options.applyEmoji} onChange={(e) => setOptions({ ...options, applyEmoji: e.target.checked })} className="rounded text-orange-600 mt-1" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Words containing emoji/non-Latin characters <span className="text-gray-500 dark:text-gray-400 text-xs">(examples: 😀, 中文, عربى)</span></span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Skip / Filter */}
                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Skip Conversion For</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.skipFirstWord} onChange={(e) => setOptionWithConflict('skipFirstWord', e.target.checked)} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">First word</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.skipLastWord} onChange={(e) => setOptionWithConflict('skipLastWord', e.target.checked)} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Last word</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.skipFirstSentence} onChange={(e) => setOptionWithConflict('skipFirstSentence', e.target.checked)} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">First sentence</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.skipLastSentence} onChange={(e) => setOptionWithConflict('skipLastSentence', e.target.checked)} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Last sentence</span>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-3">
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400">Skip first N words</label>
                                                <input type="number" min="0" value={options.skipFirstNWords} onChange={(e) => setOptionWithConflict('skipFirstNWords', parseInt(e.target.value, 10) || 0)} className="w-full text-xs border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400">Skip last N words</label>
                                                <input type="number" min="0" value={options.skipLastNWords} onChange={(e) => setOptionWithConflict('skipLastNWords', parseInt(e.target.value, 10) || 0)} className="w-full text-xs border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400">Skip shorter than X characters</label>
                                                <input type="number" min="0" value={options.skipShorterThan} onChange={(e) => setOptionWithConflict('skipShorterThan', parseInt(e.target.value, 10) || 0)} className="w-full text-xs border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400">Skip longer than X characters</label>
                                                <input type="number" min="0" value={options.skipLongerThan} onChange={(e) => setOptionWithConflict('skipLongerThan', parseInt(e.target.value, 10) || 0)} className="w-full text-xs border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400">Skip first N sentences</label>
                                                <input type="number" min="0" value={options.skipFirstNSentences} onChange={(e) => setOptionWithConflict('skipFirstNSentences', parseInt(e.target.value, 10) || 0)} className="w-full text-xs border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400">Skip last N sentences</label>
                                                <input type="number" min="0" value={options.skipLastNSentences} onChange={(e) => setOptionWithConflict('skipLastNSentences', parseInt(e.target.value, 10) || 0)} className="w-full text-xs border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-3">
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.skipAllCaps} onChange={(e) => setOptionWithConflict('skipAllCaps', e.target.checked)} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Skip ALL-CAPS words</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.skipLowercase} onChange={(e) => setOptionWithConflict('skipLowercase', e.target.checked)} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Skip lowercase words</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.skipMixedCase} onChange={(e) => setOptionWithConflict('skipMixedCase', e.target.checked)} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Skip mixed-case words</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.skipNumbers} onChange={(e) => setOptionWithConflict('skipNumbers', e.target.checked)} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Skip words with numbers</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.skipSymbols} onChange={(e) => setOptions({ ...options, skipSymbols: e.target.checked })} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Skip words with symbols</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Structure Preservation */}
                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Structure Preservation</h4>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">Ignored regions remain untouched before skip/apply rules run.</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.ignoreQuotes} onChange={(e) => setOptions({ ...options, ignoreQuotes: e.target.checked })} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Ignore quotes &quot; &quot;</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.ignoreParentheses} onChange={(e) => setOptions({ ...options, ignoreParentheses: e.target.checked })} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Ignore parentheses ( )</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.ignoreBrackets} onChange={(e) => setOptions({ ...options, ignoreBrackets: e.target.checked })} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Ignore brackets [ ]</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.ignoreBraces} onChange={(e) => setOptions({ ...options, ignoreBraces: e.target.checked })} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Ignore braces {'{ }'}</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.ignoreHTML} onChange={(e) => setOptions({ ...options, ignoreHTML: e.target.checked })} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Ignore HTML tags</span>
                                            </label>
                                        </div>

                                        <label className="flex items-center mt-3 font-semibold">
                                            <input type="checkbox" checked={options.preserveCapitalization} onChange={(e) => setOptions({ ...options, preserveCapitalization: e.target.checked })} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-200">Preserve existing capitalization (CamelCase, brand caps)</span>
                                        </label>

                                        <div className="mt-3">
                                            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stop Words (Title Case only)</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. at, in, on (comma separated)"
                                                value={options.stopWords}
                                                onChange={(e) => setOptions({ ...options, stopWords: e.target.value })}
                                                className="mt-1 w-full text-sm border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Words stay lowercase unless they are the first or last word in the title segment.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* How It Works Tab */}
                {activeTab === 'how-it-works' && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
                        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 dark:text-white border-b pb-4">
                            Master the Case Converter
                        </h2>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <div className="flex items-center mb-4">
                                    <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full mr-3 text-orange-600 dark:text-orange-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">How It Works</h3>
                                </div>
                                <ol className="space-y-4 text-gray-600 dark:text-gray-300 ml-4 border-l-2 border-orange-200 dark:border-orange-800 pl-4">
                                    <li className="relative">
                                        <span className="absolute -left-6 bg-white dark:bg-gray-800 text-orange-500 font-bold border border-orange-200 dark:border-orange-900 rounded-full w-4 h-4 flex items-center justify-center text-xs mt-1">1</span>
                                        <strong className="block text-gray-800 dark:text-gray-100">Scope Selection</strong>
                                        Choose to convert the entire text, specific lines, or content wrapped in identifiers like <code>$$$START$$$</code>.
                                    </li>
                                    <li className="relative">
                                        <span className="absolute -left-6 bg-white dark:bg-gray-800 text-orange-500 font-bold border border-orange-200 dark:border-orange-900 rounded-full w-4 h-4 flex items-center justify-center text-xs mt-1">2</span>
                                        <strong className="block text-gray-800 dark:text-gray-100">Choose Your Style</strong>
                                        Select from professional standards like <span className="text-orange-600 font-medium">AP, APA, Chicago</span>, or simple case transformations.
                                    </li>
                                    <li className="relative">
                                        <span className="absolute -left-6 bg-white dark:bg-gray-800 text-orange-500 font-bold border border-orange-200 dark:border-orange-900 rounded-full w-4 h-4 flex items-center justify-center text-xs mt-1">3</span>
                                        <strong className="block text-gray-800 dark:text-gray-100">Refine with Precision</strong>
                                        Use selective controls to skip specific words, patterns (like URLs or ALL CAPS), or protect specific content.
                                    </li>
                                </ol>
                            </div>

                            <div>
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3 text-blue-600 dark:text-blue-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Styles Guide</h3>
                                </div>
                                <ul className="grid grid-cols-1 gap-3">
                                    <li className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-orange-500">
                                        <span className="font-bold text-gray-800 dark:text-white">AP Style:</span> Capitalizes principal words, keeps prepositions lowercase unless 4+ letters.
                                    </li>
                                    <li className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-blue-500">
                                        <span className="font-bold text-gray-800 dark:text-white">Chicago Style:</span> Standard for publishing. Capitalizes major words.
                                    </li>
                                    <li className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-green-500">
                                        <span className="font-bold text-gray-800 dark:text-white">MLA Style:</span> Academic standard. Treats prepositions similarly to Chicago.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

            </main >

            <Footer />
        </div >
    );
}
