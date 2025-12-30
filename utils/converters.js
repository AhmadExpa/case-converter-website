const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const capitalize = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

const TOKEN_REGEX = /([A-Za-z0-9\u00C0-\u024F]+(?:[-_'’&][A-Za-z0-9\u00C0-\u024F]+)*)|([^A-Za-z0-9\u00C0-\u024F]+)/g;
const WORD_PATTERN = /^[A-Za-z0-9\u00C0-\u024F]+(?:[-_'’&][A-Za-z0-9\u00C0-\u024F]+)*$/;

const baseMinorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'at', 'by', 'in', 'of', 'on', 'to', 'up', 'as']);
const styleMinorMap = {
    AP: ['as', 'per', 'via'],
    APA: ['per', 'via'],
    Chicago: [],
    MLA: [],
    BB: [],
    AMA: [],
};

const protectStructure = (text, options) => {
    const placeholders = [];
    const addPlaceholder = (match) => {
        placeholders.push(match);
        return `__PLCHLDR_${placeholders.length - 1}__`;
    };

    let masked = text;
    if (options.ignoreHTML) masked = masked.replace(/<[^>]*>/g, addPlaceholder);
    if (options.ignoreQuotes) masked = masked.replace(/"[^"]*"|'[^']*'/g, addPlaceholder);
    if (options.ignoreParentheses) masked = masked.replace(/\([^)]*\)/g, addPlaceholder);
    if (options.ignoreBrackets) masked = masked.replace(/\[[^\]]*\]/g, addPlaceholder);
    if (options.ignoreBraces) masked = masked.replace(/\{[^}]*\}/g, addPlaceholder);

    return { masked, placeholders };
};

const restorePlaceholders = (text, placeholders) =>
    text.replace(/__PLCHLDR_(\d+)__/g, (match, id) => placeholders[parseInt(id, 10)] ?? match);

const detectFeatures = (token) => {
    const alnumOnly = token.replace(/[^A-Za-z0-9\u00C0-\u024F]/g, '');
    const hasNumber = /\d/.test(token);
    const hasSymbol = /[-_'’&]/.test(token) || /[^A-Za-z0-9\u00C0-\u024F'’_-]/.test(token);
    const hasAccented = /[\u00C0-\u024F]/.test(token);
    const hasEmojiOrNonLatin = Array.from(token).some((ch) => {
        const cp = ch.codePointAt(0);
        return cp && cp > 0x024f;
    });
    const isAllCaps = alnumOnly.length > 0 && /^[A-Z0-9]+$/.test(alnumOnly);
    const isLowercase = alnumOnly.length > 0 && /^[a-z0-9]+$/.test(alnumOnly);
    const isMixedCase = /[a-z]/.test(alnumOnly) && /[A-Z]/.test(alnumOnly);
    const hasInternalCapitalization = alnumOnly.length > 1 && /[A-Z]/.test(alnumOnly.slice(1));

    return {
        hasNumber,
        hasSymbol,
        hasAccented,
        hasEmojiOrNonLatin,
        isAllCaps,
        isLowercase,
        isMixedCase,
        hasInternalCapitalization,
    };
};

const buildSentenceRanges = (tokens) => {
    const ranges = [];
    let start = 0;
    tokens.forEach((token, idx) => {
        if (/[.!?]/.test(token)) {
            ranges.push([start, idx]);
            start = idx + 1;
        }
    });
    if (start < tokens.length) ranges.push([start, tokens.length - 1]);
    return ranges;
};

const findSentenceIndex = (tokenIndex, sentenceRanges) =>
    sentenceRanges.findIndex(([start, end]) => tokenIndex >= start && tokenIndex <= end);

const isFirstWordInSentence = (tokenIndex, tokens, sentenceRange) => {
    if (!sentenceRange) return tokenIndex === 0;
    for (let i = sentenceRange[0]; i <= sentenceRange[1]; i += 1) {
        if (WORD_PATTERN.test(tokens[i])) {
            return i === tokenIndex;
        }
    }
    return false;
};

const applyTitleCaseWord = (word, style, isFirst, isLast, stopWordsSet) => {
    const styleMinors = new Set([...(styleMinorMap[style] || []), ...baseMinorWords, ...stopWordsSet]);
    const parts = word.split(/(-|–)/);

    const transformSegment = (segment) => {
        const lower = segment.toLowerCase();
        if (!isFirst && !isLast) {
            if (stopWordsSet.has(lower)) return lower;
            if (styleMinors.has(lower)) return lower;
        }

        if (style === 'AP') {
            if (lower.length >= 4) return capitalize(lower);
            if (styleMinors.has(lower) && !isFirst && !isLast) return lower;
        } else if (style === 'APA') {
            if (lower.length >= 4) return capitalize(lower);
            if (styleMinors.has(lower) && !isFirst && !isLast) return lower;
        } else if (style === 'Chicago' || style === 'MLA' || style === 'BB') {
            if (styleMinors.has(lower) && !isFirst && !isLast) return lower;
        } else if (style === 'AMA') {
            if (lower.length > 3) return capitalize(lower);
            if (styleMinors.has(lower) && !isFirst && !isLast) return lower;
        }

        return capitalize(lower);
    };

    return parts
        .map((segment) => {
            if (segment === '-' || segment === '–') return segment;
            return transformSegment(segment);
        })
        .join('');
};

const applySentenceCase = (word, isFirstInSentence) =>
    isFirstInSentence ? capitalize(word.toLowerCase()) : word.toLowerCase();

const applyCaseStyle = (token, options, context) => {
    const { style, stopWordsSet } = options;
    const { isFirstWord, isLastWord, isFirstInSentence } = context;

    if (['AP', 'APA', 'Chicago', 'MLA', 'BB', 'AMA'].includes(style)) {
        return applyTitleCaseWord(token, style, isFirstWord, isLastWord, stopWordsSet);
    }

    if (style === 'UPPERCASE') return token.toUpperCase();
    if (style === 'lowercase') return token.toLowerCase();
    if (style === 'Sentence case') return applySentenceCase(token, isFirstInSentence);

    return token;
};

const applyConversionRules = (text, options) => {
    const tokens = [];
    text.replace(TOKEN_REGEX, (match) => {
        tokens.push(match);
        return match;
    });

    const wordIndices = [];
    tokens.forEach((token, idx) => {
        if (WORD_PATTERN.test(token)) wordIndices.push(idx);
    });
    const totalWords = wordIndices.length;

    const sentenceRanges =
        options.skipFirstSentence ||
        options.skipLastSentence ||
        options.skipFirstNSentences > 0 ||
        options.skipLastNSentences > 0 ||
        options.style === 'Sentence case'
            ? buildSentenceRanges(tokens)
            : [];

    const totalSentences = sentenceRanges.length;
    const anyApplyFilter =
        options.applyNumbers || options.applySymbols || options.applyAccented || options.applyEmoji;

    wordIndices.forEach((tokenIndex, wordPosition) => {
        const token = tokens[tokenIndex];
        const features = detectFeatures(token);

        if (options.preserveCapitalization && features.hasInternalCapitalization) return;

        if (options.skipFirstWord && wordPosition === 0) return;
        if (options.skipLastWord && wordPosition === totalWords - 1) return;
        if (options.skipFirstNWords > 0 && wordPosition < options.skipFirstNWords) return;
        if (options.skipLastNWords > 0 && wordPosition >= totalWords - options.skipLastNWords) return;

        let sentenceIndex = -1;
        if (sentenceRanges.length > 0) {
            sentenceIndex = findSentenceIndex(tokenIndex, sentenceRanges);
            if (sentenceIndex !== -1) {
                if (options.skipFirstSentence && sentenceIndex === 0) return;
                if (options.skipLastSentence && sentenceIndex === totalSentences - 1) return;
                if (options.skipFirstNSentences > 0 && sentenceIndex < options.skipFirstNSentences) return;
                if (options.skipLastNSentences > 0 && sentenceIndex >= totalSentences - options.skipLastNSentences)
                    return;
            }
        }

        if (options.skipShorterThan > 0 && token.length < options.skipShorterThan) return;
        if (options.skipLongerThan > 0 && token.length > options.skipLongerThan) return;

        if (options.skipAllCaps && features.isAllCaps) return;
        if (options.skipLowercase && features.isLowercase) return;
        if (options.skipMixedCase && features.isMixedCase) return;
        if (options.skipNumbers && features.hasNumber) return;
        if (options.skipSymbols && features.hasSymbol) return;

        if (anyApplyFilter) {
            const matchesFilter =
                (options.applyNumbers && features.hasNumber) ||
                (options.applySymbols && features.hasSymbol) ||
                (options.applyAccented && features.hasAccented) ||
                (options.applyEmoji && features.hasEmojiOrNonLatin);
            if (!matchesFilter) return;
        }

        const isStopWord = options.stopWordsSet.has(token.toLowerCase());
        if (isStopWord && ['AP', 'APA', 'Chicago', 'MLA', 'BB', 'AMA'].includes(options.style)) {
            if (wordPosition !== 0 && wordPosition !== totalWords - 1) {
                tokens[tokenIndex] = token.toLowerCase();
                return;
            }
        }

        const isFirstInSentence =
            sentenceIndex !== -1
                ? isFirstWordInSentence(tokenIndex, tokens, sentenceRanges[sentenceIndex])
                : wordPosition === 0;

        tokens[tokenIndex] = applyCaseStyle(token, options, {
            isFirstWord: wordPosition === 0,
            isLastWord: wordPosition === totalWords - 1,
            isFirstInSentence,
        });
    });

    return tokens.join('');
};

const processSegment = (segment, options) => {
    const { masked, placeholders } = protectStructure(segment, options);
    const converted = applyConversionRules(masked, options);
    return restorePlaceholders(converted, placeholders);
};

export const convertText = (text, options) => {
    if (!text || !options.style) return text || '';

    const preparedOptions = {
        ...options,
        stopWordsSet: new Set((options.stopWords || []).map((w) => w.toLowerCase())),
    };

    if (options.scope === 'identifiers') {
        const startId = '$$$START$$$';
        const endId = '$$$END$$$';
        const regex = new RegExp(`(${escapeRegExp(startId)})([\\s\\S]*?)(${escapeRegExp(endId)})`, 'g');
        return text.replace(regex, (match, start, content, end) => `${start}${processSegment(content, preparedOptions)}${end}`);
    }

    if (options.scope === 'lines' && Array.isArray(options.lineNumbers)) {
        const lines = text.split(/\r?\n/);
        const lineSet = new Set(options.lineNumbers);
        const processed = lines.map((line, idx) =>
            lineSet.has(idx) ? processSegment(line, preparedOptions) : line
        );
        return processed.join('\n');
    }

    return processSegment(text, preparedOptions);
};

const defaultLineSelectionMessages = {
    prompt: 'Enter line numbers or ranges like 1,2,5-10.',
    atLeastOne: 'Enter at least one line number.',
    positive: 'Line numbers must be positive. "{{token}}" is invalid.',
    beyond: 'Line {{line}} is beyond the text length.',
    rangeInvalid: 'Range "{{token}}" is invalid. Use start-end with start <= end.',
    tokenInvalid: 'Token "{{token}}" is not a valid line number or range.',
};

export const parseLineSelection = (input, totalLines, messages = defaultLineSelectionMessages) => {
    if (!input || !input.trim()) return { error: messages.prompt, lines: [] };

    const tokens = input.split(',').map((t) => t.trim()).filter(Boolean);
    if (tokens.length === 0) return { error: messages.atLeastOne, lines: [] };

    const selected = new Set();

    for (const token of tokens) {
        if (/^\d+$/.test(token)) {
            const line = parseInt(token, 10);
            if (line < 1) return { error: messages.positive.replace('{{token}}', token), lines: [] };
            if (totalLines && line > totalLines)
                return { error: messages.beyond.replace('{{line}}', line), lines: [] };
            selected.add(line - 1);
        } else if (/^\d+-\d+$/.test(token)) {
            const [startStr, endStr] = token.split('-');
            const start = parseInt(startStr, 10);
            const end = parseInt(endStr, 10);
            if (start < 1 || end < 1 || end < start) {
                return { error: messages.rangeInvalid.replace('{{token}}', token), lines: [] };
            }
            if (totalLines && end > totalLines)
                return { error: messages.beyond.replace('{{line}}', end), lines: [] };
            for (let i = start; i <= end; i += 1) selected.add(i - 1);
        } else {
            return { error: messages.tokenInvalid.replace('{{token}}', token), lines: [] };
        }
    }

    return { error: null, lines: Array.from(selected).sort((a, b) => a - b) };
};
