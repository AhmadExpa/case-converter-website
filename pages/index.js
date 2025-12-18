import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import { analyzeText } from '../utils/analytics';
import { convertText } from '../utils/converters';

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
    const [options, setOptions] = useState({
        style: '',
        scope: 'entire',
        linePrefix: '',
        lineKeyword: '',

        // Selective Controls
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

        convertOnlyAllCaps: false,
        convertOnlyLowercase: false,
        convertOnlyMixedCase: false,
        convertOnlyNumbers: false,

        // Character Type Filters (A)
        selectedChars: {
            capitals: false,
            lowercase: false,
            numbers: false,
            symbols: false,
            accented: false,
            unicode: false,
            unspecified: true // logic default if none selected?
        },

        // Structure
        ignoreQuotes: false,
        ignoreParentheses: false,
        ignoreBrackets: false,
        ignoreBraces: false,
        ignoreHTML: false,
        preserveFormatting: false,

        // Stop words
        stopWords: '',
    });

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
        setOptions(prev => ({
            style: '',
            scope: 'entire',
            linePrefix: '',
            lineKeyword: '',
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
            convertOnlyAllCaps: false,
            convertOnlyLowercase: false,
            convertOnlyMixedCase: false,
            convertOnlyNumbers: false,
            selectedChars: {
                capitals: false,
                lowercase: false,
                numbers: false,
                symbols: false,
                accented: false,
                unicode: false,
                unspecified: true // Reset to true means "All enabled/No filter"
            },
            ignoreQuotes: false,
            ignoreParentheses: false,
            ignoreBrackets: false,
            ignoreBraces: false,
            ignoreHTML: false,
            preserveFormatting: false,
            stopWords: '',
        }));
    };

    const handleConvert = () => {
        setErrorMsg('');

        // Validation / Conflicts
        // Validation / Conflicts
        if (options.scope === 'identifiers') {
            const sIndex = text.indexOf('$$$START$$$');
            const eIndex = text.indexOf('$$$END$$$');

            if (sIndex === -1 || eIndex === -1) {
                setErrorMsg('Error: Identifiers $$$START$$$ and/or $$$END$$$ not found in text.');
                return;
            }
            if (sIndex > eIndex) {
                setErrorMsg('Error: Identifiers misordered. $$$START$$$ must appear before $$$END$$$.');
                return;
            }
        }

        const { skipFirstWord, skipFirstNWords, skipLastWord, skipLastNWords } = options;
        if (skipFirstWord && skipFirstNWords > 0) {
            setErrorMsg('Conflict: Cannot select both "Skip first word" and "Skip first N words".');
            setOptions({ ...options, skipFirstWord: false, skipFirstNWords: 0 }); // Auto-resolve behavior? User said "Conflicting options must be disabled immediately."
            return;
        }

        // Sentence Skipping Conflicts
        const { skipFirstSentence, skipFirstNSentences, skipLastSentence, skipLastNSentences } = options;
        if (skipFirstSentence && skipFirstNSentences > 0) {
            setErrorMsg('Conflict: Cannot select both "Skip first sentence" and "Skip first N sentences".');
            return;
        }
        if (skipLastSentence && skipLastNSentences > 0) {
            setErrorMsg('Conflict: Cannot select both "Skip last sentence" and "Skip last N sentences".');
            return;
        }

        // Stop Words Limit Check
        const stopWordList = options.stopWords.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
        if (stopWordList.length > 5) {
            setErrorMsg('Error: Custom stop-word list is limited to 5 words.');
            return;
        }

        // Character Filtering Logic Check
        // "At least one character type must be selected if filtering is enabled"
        // How do we know if filtering is enabled? 
        // Let's assume if ANY specific char type is checked, we treat it as filtering.
        // If ALL are unchecked, maybe we default to "All"? 
        const anyCharSelected = Object.values(options.selectedChars).some(v => v === true) && !options.selectedChars.unspecified;
        // Actually, let's keep it simple: If options.selectedChars.unspecified is false, we enforce.

        const conversionOptions = {
            conversionStyle: options.style,
            ...options,
            stopWords: options.stopWords.split(',').map(s => s.trim().toLowerCase()).filter(s => s)
        };

        const result = convertText(text, conversionOptions);
        setConvertedText(result);
        setSubTab('output');
    };

    // Helper to toggle selected chars
    const toggleChar = (key) => {
        setOptions(prev => {
            const newChars = { ...prev.selectedChars, [key]: !prev.selectedChars[key] };
            // Check if any is selected to toggle 'unspecified'
            const anySelected = Object.values(newChars).some(v => v === true);
            newChars.unspecified = !anySelected;
            return { ...prev, selectedChars: newChars };
        });
    };

    // Conflict Resolution Helper
    const setOptionWithConflict = (key, value) => {
        setOptions(prev => {
            const newOptions = { ...prev, [key]: value };

            // Mutual Exclusions: Skip vs Skip N
            if (key === 'skipFirstWord' && value) newOptions.skipFirstNWords = 0;
            if (key === 'skipFirstNWords' && value > 0) newOptions.skipFirstWord = false;

            if (key === 'skipLastWord' && value) newOptions.skipLastNWords = 0;
            if (key === 'skipLastNWords' && value > 0) newOptions.skipLastWord = false;

            if (key === 'skipFirstSentence' && value) newOptions.skipFirstNSentences = 0;
            if (key === 'skipFirstNSentences' && value > 0) newOptions.skipFirstSentence = false;

            if (key === 'skipLastSentence' && value) newOptions.skipLastNSentences = 0;
            if (key === 'skipLastNSentences' && value > 0) newOptions.skipLastSentence = false;

            // Mutual Exclusions: Skip Pattern vs Convert Only Pattern
            if (key === 'skipAllCaps' && value) newOptions.convertOnlyAllCaps = false;
            if (key === 'convertOnlyAllCaps' && value) newOptions.skipAllCaps = false;

            if (key === 'skipLowercase' && value) newOptions.convertOnlyLowercase = false;
            if (key === 'convertOnlyLowercase' && value) newOptions.skipLowercase = false;

            if (key === 'skipMixedCase' && value) newOptions.convertOnlyMixedCase = false;
            if (key === 'convertOnlyMixedCase' && value) newOptions.skipMixedCase = false;

            if (key === 'skipNumbers' && value) newOptions.convertOnlyNumbers = false;
            if (key === 'convertOnlyNumbers' && value) newOptions.skipNumbers = false;

            // Preserve Formatting overrides Convert Only
            if (key === 'preserveFormatting' && value) {
                newOptions.convertOnlyAllCaps = false;
                newOptions.convertOnlyLowercase = false;
                newOptions.convertOnlyMixedCase = false;
                newOptions.convertOnlyNumbers = false;
            }

            return newOptions;
        });
    };

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
                                            {errorMsg && <span className="text-red-500 text-sm font-bold">{errorMsg}</span>}
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
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() => navigator.clipboard.writeText(convertedText)}
                                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                                Copy to Clipboard
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

                                    {options.scope === 'lines' && (
                                        <div className="mt-2 text-xs">
                                            <input type="text" placeholder="Line Prefix (e.g. >)" value={options.linePrefix} onChange={(e) => setOptions({ ...options, linePrefix: e.target.value })} className="w-full border rounded p-1 mb-1 dark:bg-gray-600 dark:text-white dark:border-gray-500" />
                                            <input type="text" placeholder="Line Keyword" value={options.lineKeyword} onChange={(e) => setOptions({ ...options, lineKeyword: e.target.value })} className="w-full border rounded p-1 dark:bg-gray-600 dark:text-white dark:border-gray-500" />
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
                                <p className="text-xs text-gray-500 text-center">
                                    By clicking convert, you agree to the applied settings overriding the current text.
                                </p>
                            </div>
                        </div>

                        {/* Controls Section (2 Columns) - Now Persistent below the main row */}
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Style Selection */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-4 dark:text-white">Title Case Standards</h3>
                                <div className="flex flex-col space-y-2">
                                    {['AP', 'APA', 'Chicago', 'MLA', 'BB', 'AMA'].map(style => (
                                        <label key={style} className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="style"
                                                value={style}
                                                checked={options.style === style}
                                                onChange={(e) => setOptions({ ...options, style: e.target.value })}
                                                className="form-radio text-orange-600 focus:ring-orange-500 h-4 w-4"
                                            />
                                            <span className="ml-2 text-gray-700 dark:text-gray-300">{style} Style</span>
                                        </label>
                                    ))}
                                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                    {['UPPERCASE', 'lowercase', 'Sentence case'].map(style => (
                                        <label key={style} className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="style"
                                                value={style}
                                                checked={options.style === style}
                                                onChange={(e) => setOptions({ ...options, style: e.target.value })}
                                                className="form-radio text-orange-600 focus:ring-orange-500 h-4 w-4"
                                            />
                                            <span className="ml-2 text-gray-700 dark:text-gray-300">{style}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Selective Controls */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-4 dark:text-white">Selective Controls</h3>
                                <div className="space-y-4 max-h-128 overflow-y-auto pr-2 custom-scrollbar">


                                    {/* Character Type Filters */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Character Types</h4>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.selectedChars.capitals} onChange={() => toggleChar('capitals')} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Capitals</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.selectedChars.lowercase} onChange={() => toggleChar('lowercase')} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Lowercase</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.selectedChars.numbers} onChange={() => toggleChar('numbers')} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Numbers</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.selectedChars.symbols} onChange={() => toggleChar('symbols')} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Symbols</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.selectedChars.accented} onChange={() => toggleChar('accented')} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Accented</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={options.selectedChars.unicode} onChange={() => toggleChar('unicode')} className="rounded text-orange-600" />
                                                <span className="ml-2 text-sm dark:text-gray-300">Unicode/Emoji</span>
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2">* Uncheck all to convert all types.</p>
                                    </div>

                                    <hr className="border-gray-200 dark:border-gray-700 mb-4" />

                                    {/* Skip / Filter */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Skip Logic</h4>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.skipFirstWord} onChange={(e) => setOptionWithConflict('skipFirstWord', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Skip First Word</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.skipLastWord} onChange={(e) => setOptionWithConflict('skipLastWord', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Skip Last Word</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.skipFirstSentence} onChange={(e) => setOptionWithConflict('skipFirstSentence', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Skip First Sentence</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.skipLastSentence} onChange={(e) => setOptionWithConflict('skipLastSentence', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Skip Last Sentence</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div>
                                                <label className="text-xs text-gray-500">Skip First N Words</label>
                                                <input type="number" min="0" value={options.skipFirstNWords} onChange={(e) => setOptionWithConflict('skipFirstNWords', parseInt(e.target.value) || 0)} className="w-full text-xs border rounded p-1" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Skip Last N Words</label>
                                                <input type="number" min="0" value={options.skipLastNWords} onChange={(e) => setOptionWithConflict('skipLastNWords', parseInt(e.target.value) || 0)} className="w-full text-xs border rounded p-1" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Skip Shorter Than</label>
                                                <input type="number" min="0" value={options.skipShorterThan} onChange={(e) => setOptionWithConflict('skipShorterThan', parseInt(e.target.value) || 0)} className="w-full text-xs border rounded p-1" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Skip Longer Than</label>
                                                <input type="number" min="0" value={options.skipLongerThan} onChange={(e) => setOptionWithConflict('skipLongerThan', parseInt(e.target.value) || 0)} className="w-full text-xs border rounded p-1" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Skip First N Sentences</label>
                                                <input type="number" min="0" value={options.skipFirstNSentences} onChange={(e) => setOptionWithConflict('skipFirstNSentences', parseInt(e.target.value) || 0)} className="w-full text-xs border rounded p-1" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Skip Last N Sentences</label>
                                                <input type="number" min="0" value={options.skipLastNSentences} onChange={(e) => setOptionWithConflict('skipLastNSentences', parseInt(e.target.value) || 0)} className="w-full text-xs border rounded p-1" />
                                            </div>
                                        </div>

                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-2 mb-2">Skip Patterns</h4>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.skipAllCaps} onChange={(e) => setOptionWithConflict('skipAllCaps', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Skip ALL-CAPS</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.skipLowercase} onChange={(e) => setOptionWithConflict('skipLowercase', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Skip Lowercase</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.skipMixedCase} onChange={(e) => setOptionWithConflict('skipMixedCase', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Skip Mixed-Case</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.skipNumbers} onChange={(e) => setOptionWithConflict('skipNumbers', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Skip Numbers</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.skipSymbols} onChange={(e) => setOptions({ ...options, skipSymbols: e.target.checked })} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Skip Symbols</span>
                                        </label>
                                    </div>

                                    <hr className="border-gray-200 dark:border-gray-700" />

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Convert Only Matching</h4>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.convertOnlyAllCaps} onChange={(e) => setOptionWithConflict('convertOnlyAllCaps', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">ALL-CAPS Words</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.convertOnlyLowercase} onChange={(e) => setOptionWithConflict('convertOnlyLowercase', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Lowercase Words</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.convertOnlyMixedCase} onChange={(e) => setOptionWithConflict('convertOnlyMixedCase', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Mixed-Case Words</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.convertOnlyNumbers} onChange={(e) => setOptionWithConflict('convertOnlyNumbers', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Words with Numbers</span>
                                        </label>
                                    </div>

                                    <hr className="border-gray-200 dark:border-gray-700" />

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Structure</h4>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.ignoreQuotes} onChange={(e) => setOptions({ ...options, ignoreQuotes: e.target.checked })} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Ignore Quotes (" ")</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.ignoreParentheses} onChange={(e) => setOptions({ ...options, ignoreParentheses: e.target.checked })} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Ignore Parentheses ( )</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.ignoreBrackets} onChange={(e) => setOptions({ ...options, ignoreBrackets: e.target.checked })} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Ignore Brackets [ ]</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.ignoreBraces} onChange={(e) => setOptions({ ...options, ignoreBraces: e.target.checked })} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Ignore Braces {'{ }'}</span>
                                        </label>
                                        <label className="flex items-center mb-1">
                                            <input type="checkbox" checked={options.ignoreHTML} onChange={(e) => setOptions({ ...options, ignoreHTML: e.target.checked })} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-300">Ignore HTML Tags</span>
                                        </label>
                                        <label className="flex items-center mt-2 font-semibold">
                                            <input type="checkbox" checked={options.preserveFormatting} onChange={(e) => setOptionWithConflict('preserveFormatting', e.target.checked)} className="rounded text-orange-600" />
                                            <span className="ml-2 text-sm dark:text-gray-200">Preserve Existing Capitalization</span>
                                        </label>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Stop Words</h4>
                                        <input
                                            type="text"
                                            placeholder="e.g. at, in, on (comma separated)"
                                            value={options.stopWords}
                                            onChange={(e) => setOptions({ ...options, stopWords: e.target.value })}
                                            className="w-full text-sm border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
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
