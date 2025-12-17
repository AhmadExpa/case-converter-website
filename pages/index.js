import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { analyzeText } from '../utils/analytics';
import { convertText } from '../utils/converters';

export default function Home() {
    const [text, setText] = useState('');
    const [convertedText, setConvertedText] = useState('');
    const [activeTab, setActiveTab] = useState('converter');
    const [fileName, setFileName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

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
        <div className="min-h-screen flex flex-col transition-colors duration-200">
            <Head>
                <title>Precision Case Converter</title>
                <meta name="description" content="A Precision Case Converter for Professional & Academic Writing" />
            </Head>

            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
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

                        {/* File Upload Section */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 dark:text-white">1. Input Text / File Upload</h2>
                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                <div className="flex-1 w-full">
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
                                        placeholder="Paste your text here or upload a file..."
                                        className="mt-4 w-full h-48 p-4 rounded-md border border-gray-300 bg-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 transition-colors font-mono"
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

                                {/* Analytics Panel */}
                                <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-sm">
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
                            </div>
                        </div>

                        {/* Controls Section */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

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

                            {/* Action & Scope */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Scope</h4>
                                    <select
                                        value={options.scope}
                                        onChange={(e) => setOptions({ ...options, scope: e.target.value })}
                                        className="w-full text-sm border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                                    >
                                        <option value="entire">Entire Text</option>
                                        <option value="identifiers">Between Identifiers ($$$...$$$)</option>
                                        <option value="lines">Selected Lines Only</option>
                                    </select>

                                    {options.scope === 'lines' && (
                                        <div className="mt-2 text-xs">
                                            <input type="text" placeholder="Line Prefix (e.g. >)" value={options.linePrefix} onChange={(e) => setOptions({ ...options, linePrefix: e.target.value })} className="w-full border rounded p-1 mb-1" />
                                            <input type="text" placeholder="Line Keyword" value={options.lineKeyword} onChange={(e) => setOptions({ ...options, lineKeyword: e.target.value })} className="w-full border rounded p-1" />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={handleConvert}
                                        className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-105"
                                    >
                                        Convert
                                    </button>
                                    <p className="mt-4 text-xs text-gray-500 text-center">
                                        By clicking convert, you agree to the applied settings overriding the current text.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Output Section */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 dark:text-white">Output</h2>
                            <textarea
                                readOnly
                                value={convertedText}
                                className="w-full h-48 p-4 rounded-md border border-gray-300 bg-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 transition-colors font-mono"
                                placeholder="Converted text will appear here..."
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => navigator.clipboard.writeText(convertedText)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
                                >
                                    Copy to Clipboard
                                </button>
                            </div>
                        </div>

                    </div>
                )}

                {/* How It Works Tab */}
                {activeTab === 'how-it-works' && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md prose dark:prose-invert max-w-none">
                        <h2>How It Works</h2>
                        <h3>Identifier-Based Conversion</h3>
                        <ol>
                            <li>Wrap target text using <code>$$$START$$$</code> and <code>$$$END$$$</code></li>
                            <li>Paste the full content into the input box</li>
                            <li>Select <strong>Between Identifiers</strong> in the Scope settings</li>
                            <li>Choose your Case Format (e.g., AP Style)</li>
                            <li>Click Convert - only the wrapped text changes!</li>
                        </ol>

                        <h3>Advanced Controls</h3>
                        <ul>
                            <li><strong>Skip Logic:</strong> Prevent conversion of specific segments (first word, sentences, short words, etc).</li>
                            <li><strong>Stop Words:</strong> Add comma-separated words to exclude from Title Casing (e.g. "of, the").</li>
                            <li><strong>Structure:</strong> Preserve existing HTML tags or quoted strings while converting surrounding text.</li>
                        </ul>

                        <h3>Title Case Standards</h3>
                        <ul>
                            <li><strong>AP Style:</strong> Associated Press style. Capitalizes principal words. Prepositions of 4+ letters are capitalized.</li>
                            <li><strong>APA Style:</strong> American Psychological Association. Capitalizes words of 4+ letters.</li>
                            <li><strong>Chicago Style:</strong> Chicago Manual of Style. Standard for book publishing. Capitalizes major words.</li>
                            <li><strong>MLA Style:</strong> Modern Language Association. Common in humanities. Similar to Chicago.</li>
                            <li><strong>Bluebook Style:</strong> Legal citation style. Strict rules on prepositions 4 letters or fewer.</li>
                            <li><strong>AMA Style:</strong> American Medical Association. Capitalizes major words, strict on 3-letter prepositions.</li>
                        </ul>

                        <h3>Selective Controls</h3>
                        <ul>
                            <li><strong>Skip Controls:</strong> Skip specific words or sentences by position (First/Last) or pattern (ALL CAPS, Numbers).</li>
                            <li><strong>Convert Only:</strong> Apply conversion strictly to words matching a pattern (e.g., only Fix ALL CAPS words).</li>
                            <li><strong>Character Filtering:</strong> Only modify specific character types (e.g., touch Capitals but leave Symbols alone).</li>
                        </ul>

                        <h3>Structure & Formatting</h3>
                        <ul>
                            <li><strong>Ignored Content:</strong> Text inside Quotes, HTML tags, Parentheses, etc., remains untouched.</li>
                            <li><strong>Preserve Formatting:</strong> Prevents case changes completely, useful if just running analytics or minor cleanup.</li>
                        </ul>
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
}
