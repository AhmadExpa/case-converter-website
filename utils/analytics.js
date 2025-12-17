export const analyzeText = (text) => {
    if (!text) {
        return {
            charCount: 0,
            wordCount: 0,
            sentenceCount: 0,
            lineCount: 0,
            paragraphCount: 0,
            uniqueWordCount: 0,
            topWords: [],
            topLetters: [],
            longestWords: [],
            sentenceAnalytics: [],
            sentenceStructure: [],
            keywordDensity: {},
        };
    }

    const charCount = text.length;
    // Basic splitting. Note: Simple regex for words, capable of handling basic punctuation.
    const words = text.match(/\b[\w']+\b/g) || [];
    const wordCount = words.length;

    // Sentences: roughly split by . ! ? followed by space or end of string.
    // This is a naive implementation but often sufficient for basic analytics.
    const sentences = text.split(/[.!?]+(?:\s+|$)/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    const lineCount = text.split(/\r\n|\r|\n/).length;
    const paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

    // New Analytics
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const uniqueWordCount = uniqueWords.size;

    // Word Frequency
    const wordFreq = {};
    words.forEach(w => {
        const lower = w.toLowerCase();
        wordFreq[lower] = (wordFreq[lower] || 0) + 1;
    });

    const sortedWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1]) // Sort by frequency desc
        .slice(0, 3);

    const topWords = sortedWords.map(([word, count]) => ({ word, count }));

    // Letter Frequency
    const letterFreq = {};
    for (const char of text) {
        if (/[a-zA-Z]/.test(char)) {
            const lower = char.toLowerCase();
            letterFreq[lower] = (letterFreq[lower] || 0) + 1;
        }
    }
    const topLetters = Object.entries(letterFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([letter, count]) => ({ letter, count }));

    // Longest Words
    const uniqueWordsList = Array.from(uniqueWords);
    const longestWords = uniqueWordsList
        .sort((a, b) => b.length - a.length)
        .slice(0, 3)
        .map(word => ({ word, length: word.length }));

    // Sentence Analytics
    const sentenceAnalytics = sentences.map(sentence => {
        const sWords = sentence.match(/\b[\w']+\b/g) || [];
        return {
            text: sentence.trim(),
            wordCount: sWords.length,
            charCount: sentence.length
        };
    });

    // Group sentence analytics for display (e.g., "11 sentences with 5 words, 10 characters")
    // The user requirement asked for grouping: "11 sentences with 5 words, 10 characters"
    // This implies grouping by (wordCount, charCount) tuple? Or just simple listing?
    // "Example output: 11 sentences with 5 words, 10 characters" suggests frequency mapping of sentence structures.

    const structureMap = new Map();
    sentenceAnalytics.forEach(({ wordCount, charCount }) => {
        const key = `${wordCount}-${charCount}`;
        if (!structureMap.has(key)) {
            structureMap.set(key, { count: 0, wordCount, charCount });
        }
        structureMap.get(key).count++;
    });

    const structureAnalytics = Array.from(structureMap.values()).sort((a, b) => b.count - a.count);

    return {
        charCount,
        wordCount,
        sentenceCount,
        lineCount,
        paragraphCount,
        uniqueWordCount,
        topWords,
        topLetters,
        longestWords,
        sentenceStructure: structureAnalytics, // This is what the UI will consume
    };
};
