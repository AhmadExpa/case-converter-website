import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SeoHead from '../components/SeoHead';
import { analyzeText } from '../utils/analytics';
import { convertText, parseLineSelection } from '../utils/converters';
import { useTranslation } from '../utils/i18n';

const defaultOptions = {
  style: '',
  scope: 'entire',
  lineSelection: '',
  applyNumbers: false,
  applySymbols: false,
  applyAccented: false,
  applyEmoji: false,
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
  ignoreQuotes: false,
  ignoreParentheses: false,
  ignoreBrackets: false,
  ignoreBraces: false,
  ignoreHTML: false,
  preserveCapitalization: false,
  stopWords: '',
};

export default function Home() {
  const { t, locale, dir } = useTranslation();
  const [text, setText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [activeTab, setActiveTab] = useState('converter');
  const [subTab, setSubTab] = useState('input');
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [analytics, setAnalytics] = useState(analyzeText(''));
  const [options, setOptions] = useState({ ...defaultOptions });

  useEffect(() => {
    setAnalytics(analyzeText(text));
  }, [text]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      setErrorMsg(t('home.errors.onlyTextFiles'));
      setInfoMsg('');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setText(event.target.result);
      setFileName(file.name);
      setErrorMsg('');
      setInfoMsg('');
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setText('');
    setConvertedText('');
    setFileName('');
    setErrorMsg('');
    setInfoMsg(t('home.panels.cleared'));
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
    setOptions({ ...defaultOptions });
  };

  const handleConvert = () => {
    setErrorMsg('');
    setInfoMsg('');

    if (!text) {
      setErrorMsg(t('home.errors.missingText'));
      return;
    }

    if (!options.style) {
      setErrorMsg(t('home.errors.missingStyle'));
      return;
    }

    let lineNumbers = [];

    if (options.scope === 'identifiers') {
      const sIndex = text.indexOf('$$$START$$$');
      const eIndex = text.indexOf('$$$END$$$');

      if (sIndex === -1 || eIndex === -1) {
        setErrorMsg(t('home.errors.markersMissing'));
        return;
      }
      if (sIndex > eIndex) {
        setErrorMsg(t('home.errors.markerOrder'));
        return;
      }
    }

    if (options.scope === 'lines') {
      const totalLines = text.split(/\r?\n/).length;
      const { error, lines } = parseLineSelection(options.lineSelection, totalLines, {
        prompt: t('home.errors.lineSelection.prompt'),
        atLeastOne: t('home.errors.lineSelection.atLeastOne'),
        positive: t('home.errors.lineSelection.positive'),
        beyond: t('home.errors.lineSelection.beyond'),
        rangeInvalid: t('home.errors.lineSelection.rangeInvalid'),
        tokenInvalid: t('home.errors.lineSelection.tokenInvalid'),
      });
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

  const handleCopy = async () => {
    if (!convertedText) return;
    try {
      await navigator.clipboard.writeText(convertedText);
      setInfoMsg(t('home.panels.copied'));
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(t('home.errors.missingText'));
      setInfoMsg('');
    }
  };

  const handleStyleToggle = (styleValue) => {
    setOptions((prev) => ({
      ...prev,
      style: prev.style === styleValue ? '' : styleValue,
    }));
  };

  const setOptionWithConflict = (key, value) => {
    setOptions((prev) => {
      const sanitizedValue = typeof value === 'number' && value < 0 ? 0 : value;
      const newOptions = { ...prev, [key]: sanitizedValue };

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

  const titleStyles = t('home.caseModes.titleStyles') || [];
  const genericStyles = t('home.caseModes.genericStyles') || [];
  const heroBullets = t('home.heroBullets') || [];
  const howSteps = t('home.howItWorks.steps') || [];
  const styleGuide = t('home.howItWorks.styleGuide') || [];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 dark:bg-gray-900" dir={dir}>
      <SeoHead
        title={t('meta.home.title')}
        description={t('meta.home.description')}
        path="/"
        locale={locale}
      />

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            {t('home.heroTitle')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('home.heroSubtitle')}
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 grid grid-cols-1 md:grid-cols-2 gap-2 text-left max-w-4xl mx-auto">
            {heroBullets.map((item, idx) => (
              <div key={idx} className="flex items-start">
                <span className="mr-2 text-orange-500">•</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab('converter')}
            className={`px-6 py-2 rounded-l-lg font-medium transition-colors ${activeTab === 'converter'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
              }`}
          >
            {t('home.tabs.converter')}
          </button>
          <button
            onClick={() => setActiveTab('how-it-works')}
            className={`px-6 py-2 rounded-r-lg font-medium transition-colors ${activeTab === 'how-it-works'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
              }`}
          >
            {t('home.tabs.howItWorks')}
          </button>
        </div>

        {activeTab === 'converter' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1 w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  <h2 className="text-xl font-semibold dark:text-white">
                    {subTab === 'input' ? t('home.panels.inputTitle') : t('home.panels.outputTitle')}
                  </h2>
                  <button
                    onClick={() => setSubTab(subTab === 'input' ? 'output' : 'input')}
                    className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 flex items-center transition-colors"
                  >
                    {subTab === 'input' ? (
                      <>
                        {t('home.panels.viewOutput')} <span className="ml-1 text-lg">→</span>
                      </>
                    ) : (
                      <>
                        <span className="mr-1 text-lg">←</span> {t('home.panels.backToInput')}
                      </>
                    )}
                  </button>
                </div>

                {subTab === 'input' ? (
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
                    {fileName && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {t('home.panels.loadedFile', { file: fileName })}
                      </p>
                    )}

                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={t('home.panels.filePlaceholder')}
                      className="mt-4 w-full h-96 p-4 rounded-md border border-gray-300 bg-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 transition-colors font-mono resize-y"
                    />

                    <div className="flex justify-between items-center mt-2">
                      <button
                        onClick={handleClear}
                        className="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        {t('home.panels.clear')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in-up">
                    <textarea
                      readOnly
                      value={convertedText}
                      className="w-full h-96 p-4 rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 transition-colors font-mono resize-y"
                      placeholder={t('home.panels.outputPlaceholder')}
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                        {t('home.panels.copy')}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-medium transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"></path></svg>
                        {t('home.panels.download')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-sm shadow-sm">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-2">
                    {t('home.scope.title')}
                  </h4>
                  <select
                    value={options.scope}
                    onChange={(e) => setOptions({ ...options, scope: e.target.value })}
                    className="w-full text-sm border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white p-2"
                  >
                    <option value="entire">{t('home.scope.options.entire')}</option>
                    <option value="identifiers">{t('home.scope.options.identifiers')}</option>
                    <option value="lines">{t('home.scope.options.lines')}</option>
                  </select>

                  {options.scope === 'identifiers' && (
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                      {t('home.scope.identifiersHelp')}
                    </p>
                  )}
                  {options.scope === 'lines' && (
                    <div className="mt-2 text-xs space-y-2">
                      <input
                        type="text"
                        placeholder={t('home.scope.linesPlaceholder')}
                        value={options.lineSelection}
                        onChange={(e) => setOptions({ ...options, lineSelection: e.target.value })}
                        className="w-full border rounded p-2 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      />
                      <p className="text-[11px] text-gray-500 dark:text-gray-300">
                        {t('home.scope.linesHelp')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-sm shadow-sm">
                  <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2 border-b pb-1">
                    {t('home.analytics.title')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                    <div>{t('home.analytics.labels.chars')}: <span className="font-mono font-bold">{analytics.charCount}</span></div>
                    <div>{t('home.analytics.labels.words')}: <span className="font-mono font-bold">{analytics.wordCount}</span></div>
                    <div>{t('home.analytics.labels.sentences')}: <span className="font-mono font-bold">{analytics.sentenceCount}</span></div>
                    <div>{t('home.analytics.labels.lines')}: <span className="font-mono font-bold">{analytics.lineCount}</span></div>
                    <div>{t('home.analytics.labels.paragraphs')}: <span className="font-mono font-bold">{analytics.paragraphCount}</span></div>
                    <div>{t('home.analytics.labels.uniqueWords')}: <span className="font-mono font-bold">{analytics.uniqueWordCount}</span></div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">{t('home.analytics.topWords')}</h4>
                      <div className="flex flex-wrap gap-1">
                        {analytics.topWords.map((w, i) => (
                          <span key={i} className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded text-xs">{w.word} ({w.count})</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">{t('home.analytics.topLetters')}</h4>
                      <div className="flex flex-wrap gap-1">
                        {analytics.topLetters.map((l, i) => (
                          <span key={i} className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded text-xs">{l.letter} ({l.count})</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">{t('home.analytics.longestWords')}</h4>
                      <div className="flex flex-wrap gap-1">
                        {analytics.longestWords.map((w, i) => (
                          <span key={i} className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded text-xs overflow-hidden text-ellipsis max-w-full" title={w.word}>{w.word} ({w.length})</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">{t('home.analytics.sentenceStructure')}</h4>
                      <div className="max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                        {analytics.sentenceStructure.map((s, i) => (
                          <div key={i} className="text-xs text-gray-600 dark:text-gray-300 mb-0.5">
                            {t('home.analytics.sentenceDetail', {
                              count: s.count,
                              words: s.wordCount,
                              chars: s.charCount,
                            })}
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
                  {t('home.convert.cta')}
                </button>
                {errorMsg && <p className="mt-2 text-xs font-semibold text-center text-red-500">{errorMsg}</p>}
                {!errorMsg && infoMsg && (
                  <p className="mt-2 text-xs font-semibold text-center text-green-600 dark:text-green-400">{infoMsg}</p>
                )}
                <p className="text-xs text-gray-500 text-center">
                  {t('home.convert.disclaimer')}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 dark:text-white">{t('home.caseModes.title')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('home.caseModes.subtitle')}</p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                    {t('home.caseModes.chip')}
                  </span>
                </div>

                <div className="mt-4 space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{t('home.caseModes.titleLabel')}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {titleStyles.map((style) => {
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
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                                  {t('home.caseModes.beta')}
                                </span>
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{style.detail}</p>
                            <div className="mt-2 flex justify-end">
                              <span className={`text-[11px] px-2 py-0.5 rounded-full ${selected ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
                                {selected ? t('home.caseModes.selected') : t('home.caseModes.tap')}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{t('home.caseModes.genericLabel')}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {genericStyles.map((style) => {
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
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{style.detail}</p>
                            <div className="mt-2 flex justify-end">
                              <span className={`text-[11px] px-2 py-0.5 rounded-full ${selected ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
                                {selected ? t('home.caseModes.selected') : t('home.caseModes.tap')}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-1 dark:text-white">{t('home.controls.title')}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('home.controls.subtitle')}</p>
                <div className="space-y-6 max-h-128 overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('home.controls.apply.title')}
                      </h4>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">{t('home.controls.apply.hint')}</span>
                    </div>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-start">
                        <input type="checkbox" checked={options.applyNumbers} onChange={(e) => setOptions({ ...options, applyNumbers: e.target.checked })} className="rounded text-orange-600 mt-1" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.apply.numbers')}</span>
                      </label>
                      <label className="flex items-start">
                        <input type="checkbox" checked={options.applySymbols} onChange={(e) => setOptions({ ...options, applySymbols: e.target.checked })} className="rounded text-orange-600 mt-1" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.apply.symbols')}</span>
                      </label>
                      <label className="flex items-start">
                        <input type="checkbox" checked={options.applyAccented} onChange={(e) => setOptions({ ...options, applyAccented: e.target.checked })} className="rounded text-orange-600 mt-1" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.apply.accented')}</span>
                      </label>
                      <label className="flex items-start">
                        <input type="checkbox" checked={options.applyEmoji} onChange={(e) => setOptions({ ...options, applyEmoji: e.target.checked })} className="rounded text-orange-600 mt-1" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.apply.emoji')}</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      {t('home.controls.skip.title')}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.skipFirstWord} onChange={(e) => setOptionWithConflict('skipFirstWord', e.target.checked)} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.skip.firstWord')}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.skipLastWord} onChange={(e) => setOptionWithConflict('skipLastWord', e.target.checked)} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.skip.lastWord')}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.skipFirstSentence} onChange={(e) => setOptionWithConflict('skipFirstSentence', e.target.checked)} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.skip.firstSentence')}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.skipLastSentence} onChange={(e) => setOptionWithConflict('skipLastSentence', e.target.checked)} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.skip.lastSentence')}</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">{t('home.controls.skip.skipFirstNWords')}</label>
                        <input type="number" min="0" value={options.skipFirstNWords} onChange={(e) => setOptionWithConflict('skipFirstNWords', parseInt(e.target.value, 10) || 0)} className="w-full text-xs border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">{t('home.controls.skip.skipLastNWords')}</label>
                        <input type="number" min="0" value={options.skipLastNWords} onChange={(e) => setOptionWithConflict('skipLastNWords', parseInt(e.target.value, 10) || 0)} className="w-full text-xs border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">{t('home.controls.skip.skipShorterThan')}</label>
                        <input type="number" min="0" value={options.skipShorterThan} onChange={(e) => setOptionWithConflict('skipShorterThan', parseInt(e.target.value, 10) || 0)} className="w-full text-xs border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">{t('home.controls.skip.skipLongerThan')}</label>
                        <input type="number" min="0" value={options.skipLongerThan} onChange={(e) => setOptionWithConflict('skipLongerThan', parseInt(e.target.value, 10) || 0)} className="w-full text-xs border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">{t('home.controls.skip.skipFirstNSentences')}</label>
                        <input type="number" min="0" value={options.skipFirstNSentences} onChange={(e) => setOptionWithConflict('skipFirstNSentences', parseInt(e.target.value, 10) || 0)} className="w-full text-xs border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">{t('home.controls.skip.skipLastNSentences')}</label>
                        <input type="number" min="0" value={options.skipLastNSentences} onChange={(e) => setOptionWithConflict('skipLastNSentences', parseInt(e.target.value, 10) || 0)} className="w-full text-xs border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.skipAllCaps} onChange={(e) => setOptionWithConflict('skipAllCaps', e.target.checked)} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.skip.skipAllCaps')}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.skipLowercase} onChange={(e) => setOptionWithConflict('skipLowercase', e.target.checked)} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.skip.skipLowercase')}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.skipMixedCase} onChange={(e) => setOptionWithConflict('skipMixedCase', e.target.checked)} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.skip.skipMixedCase')}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.skipNumbers} onChange={(e) => setOptionWithConflict('skipNumbers', e.target.checked)} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.skip.skipNumbers')}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.skipSymbols} onChange={(e) => setOptions({ ...options, skipSymbols: e.target.checked })} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.skip.skipSymbols')}</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      {t('home.controls.structure.title')}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                      {t('home.controls.structure.subtitle')}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.ignoreQuotes} onChange={(e) => setOptions({ ...options, ignoreQuotes: e.target.checked })} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.structure.quotes')}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.ignoreParentheses} onChange={(e) => setOptions({ ...options, ignoreParentheses: e.target.checked })} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.structure.parentheses')}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.ignoreBrackets} onChange={(e) => setOptions({ ...options, ignoreBrackets: e.target.checked })} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.structure.brackets')}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.ignoreBraces} onChange={(e) => setOptions({ ...options, ignoreBraces: e.target.checked })} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.structure.braces')}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={options.ignoreHTML} onChange={(e) => setOptions({ ...options, ignoreHTML: e.target.checked })} className="rounded text-orange-600" />
                        <span className="ml-2 text-sm dark:text-gray-300">{t('home.controls.structure.html')}</span>
                      </label>
                    </div>

                    <label className="flex items-center mt-3 font-semibold">
                      <input type="checkbox" checked={options.preserveCapitalization} onChange={(e) => setOptions({ ...options, preserveCapitalization: e.target.checked })} className="rounded text-orange-600" />
                      <span className="ml-2 text-sm dark:text-gray-200">{t('home.controls.structure.preserveCaps')}</span>
                    </label>

                    <div className="mt-3">
                      <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('home.controls.structure.stopWordsLabel')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('home.controls.structure.stopWordsPlaceholder')}
                        value={options.stopWords}
                        onChange={(e) => setOptions({ ...options, stopWords: e.target.value })}
                        className="mt-1 w-full text-sm border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        {t('home.controls.structure.stopWordsNote')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'how-it-works' && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 dark:text-white border-b pb-4">
              {t('home.howItWorks.title')}
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full mr-3 text-orange-600 dark:text-orange-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('home.howItWorks.howTitle')}</h3>
                </div>
                <ol className="space-y-4 text-gray-600 dark:text-gray-300 ml-4 border-l-2 border-orange-200 dark:border-orange-800 pl-4">
                  {howSteps.map((step, idx) => (
                    <li key={idx} className="relative">
                      <span className="absolute -left-6 bg-white dark:bg-gray-800 text-orange-500 font-bold border border-orange-200 dark:border-orange-900 rounded-full w-4 h-4 flex items-center justify-center text-xs mt-1">
                        {idx + 1}
                      </span>
                      <strong className="block text-gray-800 dark:text-gray-100">{step.title}</strong>
                      {step.body}
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3 text-blue-600 dark:text-blue-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('home.howItWorks.styleGuideTitle')}</h3>
                </div>
                <ul className="grid grid-cols-1 gap-3">
                  {styleGuide.map((item, idx) => (
                    <li key={idx} className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-orange-500">
                      <span className="font-bold text-gray-800 dark:text-white">{item.label}</span> {item.body}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
