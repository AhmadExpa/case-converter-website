
// Helper: Regular Expression Escape
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Helper: Capitalize
const capitalize = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

// Helper: Title Case Logic per Style
const titleCaseWord = (word, style, isFirst, isLast) => {
    const lower = word.toLowerCase();

    // Standard Minors (Articles, Conjunctions, Prepositions)
    // We will refine these lists per style requirements where possible.
    // Common default set:
    const baseMinors = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'at', 'by', 'in', 'of', 'on', 'to', 'up', 'as']);

    // Always capitalize first and last word (Standard Rule)
    if (isFirst || isLast) return capitalize(lower);

    // Style Specific Rules
    if (style === 'AP') {
        // AP: Capitalize words of 4 letters or more. Lowercase prepositions of 3 or fewer.
        // Actually AP says: Capitalize principal words. Lowercase articles, conjunctions, prepositions if < 4 chars?
        // Let's stick to the common interpretation:
        // Prepositions of 4+ letters are capitalized.
        // So minors are only 3 letters or less.
        if (lower.length >= 4) return capitalize(lower);
        if (baseMinors.has(lower)) return lower;
    }
    else if (style === 'APA') {
        // APA: Capitalize words of 4 letters or more.
        if (lower.length >= 4) return capitalize(lower);
        // Also capitalization of "major" words?
        // Standard APA converter logic:
        if (baseMinors.has(lower)) return lower;
    }
    else if (style === 'Chicago' || style === 'MLA' || style === 'BB') {
        // Bluebook (BB) is very similar to Chicago/MLA for titles.
        // Rule: Do not capitalize a, an, the, at, by, for, in, of, on, to, up, and, as, but, or, nor.
        // Unless first/last.
        if (baseMinors.has(lower)) return lower;

        // Chicago also lowercases "to" as infinitive, etc.
    }
    else if (style === 'AMA') {
        // AMA: Capitalize major words. Lowercase defined set + prepositions <= 3 letters.
        // So if length > 3, capitalize.
        if (lower.length > 3) return capitalize(lower);
        if (baseMinors.has(lower)) return lower;
    }

    // Default for unknown or if not minor
    return capitalize(lower);
}

export const convertText = (text, options) => {
    if (!text) return "";

    // 1. Structure Ignoring logic (Quotes, HTML, etc.)
    // We replace ignored content with placeholders to protect them from ANY change.
    let processingText = text;
    const placeholders = [];

    const addPlaceholder = (match) => {
        placeholders.push(match);
        return `__PLCHLDR_${placeholders.length - 1}__`;
    };

    if (options.ignoreHTML) {
        processingText = processingText.replace(/<[^>]*>/g, addPlaceholder);
    }
    // Markdown syntax removal is complex, let's do basic code blocks? Or just user requested "Markdown syntax".
    // "Ignore Markdown syntax" usually means `code`, **bold**, etc. 
    // Implementing basic inline code ignoring for now as it's most common structure to preserve case.
    if (options.ignoreMarkdown) { // Assuming option key
        processingText = processingText.replace(/`[^`]*`/g, addPlaceholder);
    }

    if (options.ignoreQuotes) {
        processingText = processingText.replace(/"[^"]*"|'[^']*'/g, addPlaceholder);
    }
    if (options.ignoreParentheses) {
        processingText = processingText.replace(/\([^)]*\)/g, addPlaceholder);
    }
    if (options.ignoreBrackets) {
        processingText = processingText.replace(/\[[^\]]*\]/g, addPlaceholder);
    }
    if (options.ignoreBraces) {
        processingText = processingText.replace(/\{[^}]*\}/g, addPlaceholder);
    }

    // 2. Scope Logic: Identifiers or Lines
    if (options.scope === 'identifiers') {
        const startId = "$$$START$$$";
        const endId = "$$$END$$$";

        // Strict Check: Missing or Misordered
        const sIndex = processingText.indexOf(startId);
        const eIndex = processingText.indexOf(endId);

        if (sIndex === -1 || eIndex === -1 || sIndex > eIndex) {
            // "If identifiers are missing or misordered → no conversion"
            // We return the ORIGINAL text (with placeholders restored? No, original input text).
            // But we already modified processingText with placeholders. 
            // Better to return early if we can, but text was modified.
            // Let's return the processingText logic but simply NOT apply conversion.
            // Actually, avoiding side effects on ignored text is best.
            // But if we return `text`, we lose the "Ignore" logic? 
            // Wait, "Identifier logic is ignored" if scope != identifiers.
            // If scope IS identifiers, and they fail, we do NOTHING.
            return restorePlaceholders(processingText, placeholders);
        }

        // Regex for identifiers
        const regex = new RegExp(`(${escapeRegExp(startId)})([\\s\\S]*?)(${escapeRegExp(endId)})`, 'g');

        processingText = processingText.replace(regex, (match, start, content, end) => {
            return start + applyConversionRules(content, options) + end;
        });

        return restorePlaceholders(processingText, placeholders);
    }

    if (options.scope === 'lines') {
        const lines = processingText.split('\n');
        const processedLines = lines.map(line => {
            // Apply line filters
            if (options.linePrefix && !line.startsWith(options.linePrefix)) return line;
            if (options.lineKeyword && !line.includes(options.lineKeyword)) return line;
            return applyConversionRules(line, options);
        });
        processingText = processedLines.join('\n');
    } else {
        // Entire text (or fallback from identifiers if implemented differently)
        processingText = applyConversionRules(processingText, options);
    }

    return restorePlaceholders(processingText, placeholders);
};

const applyConversionRules = (text, options) => {
    // 3. Tokenization
    // We need to identify words vs non-words to reconstruct the string perfectly.
    const tokenRegex = /([\w'’]+)|([^\w'’]+)/g;
    const tokens = text.match(tokenRegex) || [];

    // Identify indices of "Words" for positional skipping
    const wordIndices = [];
    tokens.forEach((t, i) => {
        if (/^[\w'’]+$/.test(t)) wordIndices.push(i);
    });
    const totalWords = wordIndices.length;

    // We also need "Sentence" awareness if "Skip first N sentences" is active.
    // This is hard with simple token array.
    // If we need sentence skipping, we should process per sentence?
    // "Skip first N sentences".
    // Implementation: Since we are processing a block of text, we can detect sentences boundaries roughly.
    // But modifying tokens in place is easier (token map).
    // Let's ignore sentence skipping complexity for this pass if not strictly required or use a heuristic.
    // User asked for "Skip first N sentences".
    // We can pre-calculate sentence ranges.

    // Pre-calc Sentence Indices if needed
    let sentenceRanges = []; // [startTokenIndex, endTokenIndex]
    if (options.skipFirstSentence || options.skipLastSentence || options.skipFirstNSentences > 0 || options.skipLastNSentences > 0) {
        // Naive sentence detector on tokens
        let start = 0;
        tokens.forEach((t, i) => {
            if (/[.!?]+/.test(t)) { // Sentence Ender
                sentenceRanges.push([start, i]);
                start = i + 1;
            }
        });
        if (start < tokens.length) sentenceRanges.push([start, tokens.length - 1]);
    }
    const totalSentences = sentenceRanges.length;


    wordIndices.forEach((tokenIndex, currentWordIndex) => {
        let token = tokens[tokenIndex];

        // --- 4. SKIP LOGIC ---

        // Position - Words
        if (options.skipFirstWord && currentWordIndex === 0) return;
        if (options.skipLastWord && currentWordIndex === totalWords - 1) return;
        if (options.skipFirstNWords > 0 && currentWordIndex < options.skipFirstNWords) return;
        if (options.skipLastNWords > 0 && currentWordIndex >= totalWords - options.skipLastNWords) return;

        // Position - Sentences
        // Find which sentence this token belongs to
        let sentIndex = -1;
        if (sentenceRanges.length > 0) {
            sentIndex = sentenceRanges.findIndex(r => tokenIndex >= r[0] && tokenIndex <= r[1]);
            if (sentIndex !== -1) {
                if (options.skipFirstSentence && sentIndex === 0) return;
                if (options.skipLastSentence && sentIndex === totalSentences - 1) return;
                if (options.skipFirstNSentences > 0 && sentIndex < options.skipFirstNSentences) return;
                if (options.skipLastNSentences > 0 && sentIndex >= totalSentences - options.skipLastNSentences) return;
            }
        }

        // Length
        if (options.skipShorterThan > 0 && token.length < options.skipShorterThan) return;
        if (options.skipLongerThan > 0 && token.length > options.skipLongerThan) return;

        // Pattern
        const isAllCaps = /^[A-Z0-9]+$/.test(token) && /[A-Z]/.test(token);
        const isLowercase = /^[a-z0-9]+$/.test(token) && /[a-z]/.test(token);
        const hasNumber = /\d/.test(token);
        const isMixed = /[a-z]/.test(token) && /[A-Z]/.test(token);
        // "Symbols" for skip pattern: Words containing symbols? 
        // Our tokenizer splits non-words. But words can have ' (apostrophe).
        // Let's assume "Symbols" means things like @, # inside? 
        // Tokenizer `[\w'’]+` primarily admits alphanumeric + ' + ’.
        // So symbols won't be inside "Words" unless we count underscores or others allowed by \w.

        if (options.skipAllCaps && isAllCaps) return;
        if (options.skipLowercase && isLowercase) return;
        if (options.skipMixedCase && isMixed) return;
        if (options.skipNumbers && hasNumber) return;


        // -- 5. CONVERT ONLY LOGIC ---
        // "Convert Only Matching Words" - if checked, we SKIP if NOT matching.
        if (options.convertOnlyAllCaps && !isAllCaps) return;
        if (options.convertOnlyLowercase && !isLowercase) return;
        if (options.convertOnlyMixedCase && !isMixed) return;
        if (options.convertOnlyNumbers && !hasNumber) return; // Word containing numbers

        // -- 6. STOP WORDS ---
        if (options.stopWords && options.stopWords.length > 0) {
            if (options.stopWords.includes(token.toLowerCase())) return;
        }


        // -- 7. TRANSFORMATION ---

        // Preserve Formatting overrides everything?
        // "Preserve existing capitalization: Disables all “Convert only …” options"
        // Actually, "Preserve formatting" usually means "Don't change case". 
        // If checked, we basically skip all case changes?
        if (options.preserveFormatting) {
            // "Preserve existing capitalization" -> Checkbox.
            // If true, we do NOT run Title Case or Upper/Lower.
            // Why does the tool exist then?
            // Maybe it runs "Replacements" or other logic?
            // User says: "Preserve formatting to protect existing capitalization and structure".
            // If selected, we assume we skip case conversion.
            return;
        }

        // Determine Target
        let target = token;

        if (['AP', 'APA', 'Chicago', 'MLA', 'BB', 'AMA'].includes(options.style)) {
            const isFirst = (currentWordIndex === 0);
            const isLast = (currentWordIndex === totalWords - 1);
            // Also need to check if it's the start of a sentence?
            // Usually Title Case treats the whole block as a Title.
            // But if we have multiple sentences, we might want "Title Case" applied to the *Segment*.
            // The user prompt implies "Title Case Formats".
            target = titleCaseWord(token, options.style, isFirst, isLast);
        }
        else if (options.style === 'UPPERCASE') {
            target = token.toUpperCase();
        }
        else if (options.style === 'lowercase') {
            target = token.toLowerCase();
        }
        else if (options.style === 'Sentence case') {
            // Sentence case: Capitalize first word of sentence.
            // Check sentIndex from earlier.
            if (sentIndex !== -1) {
                // Find start of this sentence in wordIndices
                const sentStartTokenIndex = sentenceRanges[sentIndex][0];
                // Is this token the first WORD in that sentence?
                // We need to find the first token fitting "word" criteria in that range.
                // Naive: if tokenIndex is the first word index in the sentence range.
                // Find first word token >= sentStartTokenIndex
                let isFirstInSentence = false;
                for (let k = sentStartTokenIndex; k <= sentenceRanges[sentIndex][1]; k++) {
                    if (/^[\w'’]+$/.test(tokens[k])) {
                        if (k === tokenIndex) isFirstInSentence = true;
                        break; // Found first word
                    }
                }
                if (isFirstInSentence) target = capitalize(token.toLowerCase());
                else target = token.toLowerCase();
            } else {
                // Fallback if no sentence detection (single line?)
                if (currentWordIndex === 0) target = capitalize(token.toLowerCase());
                else target = token.toLowerCase();
            }
        }

        // -- 8. CHARACTER TYPE FILTERING (Masking) --
        // Check "Convert Only Selected Character Types"
        // If NO types are selected, we assume ALL allowed? 
        // User Rules: "At least one character type must be selected if filtering is enabled"
        // In UI we pass `unspecified: true` if nothing selected.
        if (!options.selectedChars.unspecified) {
            target = applyCharacterMask(token, target, options.selectedChars);
        }

        tokens[tokenIndex] = target;
    });

    return tokens.join('');
}

const applyCharacterMask = (original, target, allowedTypes) => {
    let result = '';
    for (let i = 0; i < original.length; i++) {
        const oChar = original[i];
        const tChar = target[i] || oChar;

        if (oChar === tChar) {
            result += oChar;
            continue;
        }

        let isAllowed = false;
        // Check type of the ORIGINAL character
        if (/[A-Z]/.test(oChar)) {
            if (allowedTypes.capitals) isAllowed = true;
        }
        else if (/[a-z]/.test(oChar)) {
            if (allowedTypes.lowercase) isAllowed = true;
        }
        else if (/[0-9]/.test(oChar)) {
            if (allowedTypes.numbers) isAllowed = true;
        }
        else if (/[à-üÀ-Ü]/.test(oChar)) { // Basic Accented range
            if (allowedTypes.accented) isAllowed = true;
            // Fallback: If 'accented' is NOT in allowedTypes (e.g. old state), maybe treat as symbols?
            // But valid state will have it.
        }
        else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(oChar)) { // Common keyboard symbols
            if (allowedTypes.symbols) isAllowed = true;
        }
        else {
            // Emoji / Other Unicode
            if (allowedTypes.unicode) isAllowed = true;
        }

        result += isAllowed ? tChar : oChar;
    }
    return result;
}

const restorePlaceholders = (text, placeholders) => {
    return text.replace(/__PLCHLDR_(\d+)__/g, (match, id) => placeholders[parseInt(id)] || match);
}
