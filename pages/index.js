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

  // Map UI text. Provide full English and a few concrete translations; others fallback to English.
  const messages = {
    English: {
      title: 'Case Converter',
      subtitle:
        'Convert your text instantly into multiple formats — sentence case, title case, UPPERCASE, lowercase, or even aLtErNaTiNg cAsE. Clean, format, and analyze your content with ease.',
      inputLabel: 'Input',
      inputPlaceholder: 'Type or paste your content here',
      outputLabel: 'Output',
      downloadFile: 'Download File',
      sentenceCase: 'Sentence case',
      lowerCase: 'lower case',
      upperCase: 'UPPER CASE',
      capitalizedCase: 'Capitalized Case',
      alternatingCase: 'aLtErNaTiNg cAsE',
      titleCase: 'Title Case',
      downloadText: 'Download Text',
      duplicateWordFinder: 'Duplicate Word Finder',
      removeDuplicateLines: 'Remove Duplicate Lines',
      charsToRemove: 'Chars to remove',
      removeCharacters: 'Remove Characters',
      wordFrequency: 'Word Frequency',
      removeUnderscores: 'Remove Underscores',
      sentenceCounter: 'Sentence Counter',
      find: 'Find',
      replace: 'Replace',
      replaceBtn: 'Replace',
      copyToClipboard: 'Copy to Clipboard',
      clear: 'Clear',
      removeTextFormatting: 'Remove Text Formatting',
      apply: 'Apply',
      statsLabelChars: 'Characters',
      statsLabelWords: 'Words',
      statsLabelSentences: 'Sentences',
      statsLabelLines: 'Lines',
      languagesSupported: 'Languages supported:',
      processingNote:
        'Processing is Unicode-aware and works with the languages listed above (and most others) using Unicode properties.',
      uploadFile: 'Upload File:',
      italics: 'Italics',
      dupWordsPrefix: 'Duplicate words:',
      noDupWords: 'No duplicate words found.',
      noWordsToAnalyse: 'No words to analyse.',
    },
    Deutsch: {
      title: 'Schreibweisenkonverter',
      subtitle: 'Geben Sie Ihren Text ein und wählen Sie die gewünschte Schreibweise.',
      inputLabel: 'Eingabe',
      inputPlaceholder: 'Text hier eingeben oder einfügen',
      outputLabel: 'Ausgabe',
      downloadFile: 'Datei herunterladen',
      sentenceCase: 'Satzanfang',
      lowerCase: 'kleinschreibung',
      upperCase: 'GROSSBUCHSTABEN',
      capitalizedCase: 'Wortanfänge Groß',
      alternatingCase: 'AbWeChSeLnD',
      titleCase: 'Titel-Schreibweise',
      downloadText: 'Text herunterladen',
      duplicateWordFinder: 'Doppelte Wörter finden',
      removeDuplicateLines: 'Doppelte Zeilen entfernen',
      charsToRemove: 'Zu entfernende Zeichen',
      removeCharacters: 'Zeichen entfernen',
      wordFrequency: 'Wortfrequenz',
      removeUnderscores: 'Unterstriche entfernen',
      sentenceCounter: 'Satz-Zähler',
      find: 'Suchen',
      replace: 'Ersetzen',
      replaceBtn: 'Ersetzen',
      copyToClipboard: 'In Zwischenablage kopieren',
      clear: 'Zurücksetzen',
      removeTextFormatting: 'Formatierung entfernen',
      apply: 'Anwenden',
      statsLabelChars: 'Zeichen',
      statsLabelWords: 'Wörter',
      statsLabelSentences: 'Sätze',
      statsLabelLines: 'Zeilen',
      languagesSupported: 'Unterstützte Sprachen:',
      processingNote:
        'Die Verarbeitung ist Unicode-fähig und funktioniert mit den oben genannten Sprachen (und den meisten anderen).',
      uploadFile: 'Datei hochladen:',
      italics: 'Kursiv',
      dupWordsPrefix: 'Doppelte Wörter:',
      noDupWords: 'Keine doppelten Wörter gefunden.',
      noWordsToAnalyse: 'Keine Wörter zum Analysieren.',
    },
    Ελληνικά: {
      title: 'Μετατροπέας πεζών/κεφαλαίων',
      subtitle: 'Πληκτρολογήστε το κείμενό σας και διαλέξτε τη μορφή.',
      inputLabel: 'Είσοδος',
      inputPlaceholder: 'Πληκτρολογήστε ή επικολλήστε εδώ',
      outputLabel: 'Έξοδος',
      downloadFile: 'Λήψη αρχείου',
      sentenceCase: 'Πρόταση',
      lowerCase: 'πεζά',
      upperCase: 'ΚΕΦΑΛΑΙΑ',
      capitalizedCase: 'Κάθε Λέξη Κεφαλαίο',
      alternatingCase: 'ΕναΛλαΣσόΜεΝα',
      titleCase: 'Τίτλος',
      downloadText: 'Λήψη κειμένου',
      duplicateWordFinder: 'Εύρεση διπλών λέξεων',
      removeDuplicateLines: 'Αφαίρεση διπλών γραμμών',
      charsToRemove: 'Χαρακτήρες για αφαίρεση',
      removeCharacters: 'Αφαίρεση χαρακτήρων',
      wordFrequency: 'Συχνότητα λέξεων',
      removeUnderscores: 'Αφαίρεση υπογράμμων',
      sentenceCounter: 'Μετρητής προτάσεων',
      find: 'Εύρεση',
      replace: 'Αντικατάσταση',
      replaceBtn: 'Αντικατάσταση',
      copyToClipboard: 'Αντιγραφή στο πρόχειρο',
      clear: 'Καθαρισμός',
      removeTextFormatting: 'Αφαίρεση μορφοποίησης',
      apply: 'Εφαρμογή',
      statsLabelChars: 'Χαρακτήρες',
      statsLabelWords: 'Λέξεις',
      statsLabelSentences: 'Προτάσεις',
      statsLabelLines: 'Γραμμές',
      languagesSupported: 'Υποστηριζόμενες γλώσσες:',
      processingNote:
        'Η επεξεργασία είναι συμβατή με Unicode και λειτουργεί με τις παραπάνω γλώσσες (και τις περισσότερες άλλες).',
      uploadFile: 'Μεταφόρτωση αρχείου:',
      italics: 'Πλάγια',
      dupWordsPrefix: 'Διπλές λέξεις:',
      noDupWords: 'Δεν βρέθηκαν διπλές λέξεις.',
      noWordsToAnalyse: 'Δεν υπάρχουν λέξεις για ανάλυση.',
    },
    Español: {
      title: 'Convertidor de mayúsculas y minúsculas',
      subtitle: 'Escribe tu texto y elige el formato deseado.',
      inputLabel: 'Entrada',
      inputPlaceholder: 'Escribe o pega tu contenido aquí',
      outputLabel: 'Salida',
      downloadFile: 'Descargar archivo',
      sentenceCase: 'Mayúscula inicial',
      lowerCase: 'minúsculas',
      upperCase: 'MAYÚSCULAS',
      capitalizedCase: 'Palabras Capitalizadas',
      alternatingCase: 'AlTeRnAdO',
      titleCase: 'Título Capitalizado',
      downloadText: 'Descargar texto',
      duplicateWordFinder: 'Buscar palabras duplicadas',
      removeDuplicateLines: 'Eliminar líneas duplicadas',
      charsToRemove: 'Caracteres a eliminar',
      removeCharacters: 'Eliminar caracteres',
      wordFrequency: 'Frecuencia de palabras',
      removeUnderscores: 'Quitar guiones bajos',
      sentenceCounter: 'Contador de oraciones',
      find: 'Buscar',
      replace: 'Reemplazar',
      replaceBtn: 'Reemplazar',
      copyToClipboard: 'Copiar al portapapeles',
      clear: 'Limpiar',
      removeTextFormatting: 'Eliminar formato de texto',
      apply: 'Aplicar',
      statsLabelChars: 'Caracteres',
      statsLabelWords: 'Palabras',
      statsLabelSentences: 'Oraciones',
      statsLabelLines: 'Líneas',
      languagesSupported: 'Idiomas disponibles:',
      processingNote:
        'El procesamiento es compatible con Unicode y funciona con los idiomas anteriores (y la mayoría de los demás).',
      uploadFile: 'Subir archivo:',
      italics: 'Cursiva',
      dupWordsPrefix: 'Palabras duplicadas:',
      noDupWords: 'No se encontraron palabras duplicadas.',
      noWordsToAnalyse: 'No hay palabras para analizar.',
    },
    Filipino: {
      title: 'Tagapagpalit ng Case',
      subtitle: 'Ilagay ang iyong teksto at piliin ang nais na anyo.',
      inputLabel: 'Input',
      inputPlaceholder: 'Mag-type o mag-paste dito',
      outputLabel: 'Output',
      downloadFile: 'I-download ang file',
      sentenceCase: 'Unang titik ng pangungusap',
      lowerCase: 'maliit na titik',
      upperCase: 'MALALAKING TITIK',
      capitalizedCase: 'Bawat Salitang May Kapital',
      alternatingCase: 'PaLiTaN',
      titleCase: 'Case ng Pamagat',
      downloadText: 'I-download ang teksto',
      duplicateWordFinder: 'Hanapin ang dobleng salita',
      removeDuplicateLines: 'Alisin ang dobleng linya',
      charsToRemove: 'Mga karakter na aalisin',
      removeCharacters: 'Alisin ang mga karakter',
      wordFrequency: 'Dalas ng salita',
      removeUnderscores: 'Alisin ang underscore',
      sentenceCounter: 'Bilang ng pangungusap',
      find: 'Hanapin',
      replace: 'Palitan',
      replaceBtn: 'Palitan',
      copyToClipboard: 'Kopyahin sa clipboard',
      clear: 'I-clear',
      removeTextFormatting: 'Alisin ang format ng teksto',
      apply: 'Ilapat',
      statsLabelChars: 'Mga karakter',
      statsLabelWords: 'Mga salita',
      statsLabelSentences: 'Mga pangungusap',
      statsLabelLines: 'Mga linya',
      languagesSupported: 'Sinusuportahang wika:',
      processingNote:
        'Unicode-aware ang pagproseso at gumagana sa mga wikang nasa itaas (at karamihan pa).',
      uploadFile: 'Mag-upload ng file:',
      italics: 'Italic',
      dupWordsPrefix: 'Dobleng salita:',
      noDupWords: 'Walang nakitang dobleng salita.',
      noWordsToAnalyse: 'Walang salitang susuriin.',
    },
    Français: {
      title: 'Convertisseur de casse',
      subtitle: 'Saisissez votre texte et choisissez le format souhaité.',
      inputLabel: 'Entrée',
      inputPlaceholder: 'Tapez ou collez votre contenu ici',
      outputLabel: 'Sortie',
      downloadFile: 'Télécharger le fichier',
      sentenceCase: 'Phrase',
      lowerCase: 'minuscules',
      upperCase: 'MAJUSCULES',
      capitalizedCase: 'Mots Capitalisés',
      alternatingCase: 'AlTeRnÉ',
      titleCase: 'Casse Titre',
      downloadText: 'Télécharger le texte',
      duplicateWordFinder: 'Mots en double',
      removeDuplicateLines: 'Supprimer les lignes en double',
      charsToRemove: 'Caractères à supprimer',
      removeCharacters: 'Supprimer les caractères',
      wordFrequency: 'Fréquence des mots',
      removeUnderscores: 'Supprimer les underscores',
      sentenceCounter: 'Compteur de phrases',
      find: 'Rechercher',
      replace: 'Remplacer',
      replaceBtn: 'Remplacer',
      copyToClipboard: 'Copier',
      clear: 'Effacer',
      removeTextFormatting: 'Supprimer la mise en forme',
      apply: 'Appliquer',
      statsLabelChars: 'Caractères',
      statsLabelWords: 'Mots',
      statsLabelSentences: 'Phrases',
      statsLabelLines: 'Lignes',
      languagesSupported: 'Langues prises en charge :',
      processingNote:
        'Le traitement est compatible Unicode et fonctionne avec les langues ci-dessus (et la plupart des autres).',
      uploadFile: 'Télécharger :',
      italics: 'Italique',
      dupWordsPrefix: 'Mots en double :',
      noDupWords: 'Aucun mot en double trouvé.',
      noWordsToAnalyse: 'Aucun mot à analyser.',
    },
    Magyar: {
      title: 'Kis- és nagybetű átalakító',
      subtitle: 'Írja be a szöveget, és válassza ki a kívánt formát.',
      inputLabel: 'Bemenet',
      inputPlaceholder: 'Írja be vagy illessze be ide',
      outputLabel: 'Kimenet',
      downloadFile: 'Fájl letöltése',
      sentenceCase: 'Mondatkezdő',
      lowerCase: 'kisbetűs',
      upperCase: 'NAGYBETŰS',
      capitalizedCase: 'Minden Szó Nagy Kezdőbetű',
      alternatingCase: 'VáLtAkOzÓ',
      titleCase: 'Cím stílus',
      downloadText: 'Szöveg letöltése',
      duplicateWordFinder: 'Duplikált szavak keresése',
      removeDuplicateLines: 'Duplikált sorok eltávolítása',
      charsToRemove: 'Eltávolítandó karakterek',
      removeCharacters: 'Karakterek eltávolítása',
      wordFrequency: 'Szógyakoriság',
      removeUnderscores: 'Aláhúzás jelek eltávolítása',
      sentenceCounter: 'Mondatszámláló',
      find: 'Keresés',
      replace: 'Csere',
      replaceBtn: 'Csere',
      copyToClipboard: 'Másolás a vágólapra',
      clear: 'Törlés',
      removeTextFormatting: 'Formázás eltávolítása',
      apply: 'Alkalmaz',
      statsLabelChars: 'Karakter',
      statsLabelWords: 'Szó',
      statsLabelSentences: 'Mondat',
      statsLabelLines: 'Sor',
      languagesSupported: 'Támogatott nyelvek:',
      processingNote:
        'A feldolgozás Unicode-kompatibilis, és működik a fenti (és a legtöbb más) nyelvvel.',
      uploadFile: 'Fájl feltöltése:',
      italics: 'Dőlt',
      dupWordsPrefix: 'Duplikált szavak:',
      noDupWords: 'Nem találhatók duplikált szavak.',
      noWordsToAnalyse: 'Nincs elemezhető szó.',
    },
    Italiano: {
      title: 'Convertitore di maiuscole/minuscole',
      subtitle: 'Inserisci il tuo testo e scegli il formato desiderato.',
      inputLabel: 'Input',
      inputPlaceholder: 'Digita o incolla qui',
      outputLabel: 'Output',
      downloadFile: 'Scarica file',
      sentenceCase: 'Frase',
      lowerCase: 'minuscolo',
      upperCase: 'MAIUSCOLO',
      capitalizedCase: 'Iniziali Maiuscole',
      alternatingCase: 'AlTeRnAtO',
      titleCase: 'Titolo',
      downloadText: 'Scarica testo',
      duplicateWordFinder: 'Trova parole duplicate',
      removeDuplicateLines: 'Rimuovi righe duplicate',
      charsToRemove: 'Caratteri da rimuovere',
      removeCharacters: 'Rimuovi caratteri',
      wordFrequency: 'Frequenza parole',
      removeUnderscores: 'Rimuovi underscore',
      sentenceCounter: 'Conteggio frasi',
      find: 'Trova',
      replace: 'Sostituisci',
      replaceBtn: 'Sostituisci',
      copyToClipboard: 'Copia negli appunti',
      clear: 'Pulisci',
      removeTextFormatting: 'Rimuovi formattazione',
      apply: 'Applica',
      statsLabelChars: 'Caratteri',
      statsLabelWords: 'Parole',
      statsLabelSentences: 'Frasi',
      statsLabelLines: 'Righe',
      languagesSupported: 'Lingue supportate:',
      processingNote:
        "L'elaborazione è compatibile con Unicode e funziona con le lingue sopra (e molte altre).",
      uploadFile: 'Carica file:',
      italics: 'Corsivo',
      dupWordsPrefix: 'Parole duplicate:',
      noDupWords: 'Nessuna parola duplicata trovata.',
      noWordsToAnalyse: 'Nessuna parola da analizzare.',
    },
    Polski: {
      title: 'Konwerter wielkości liter',
      subtitle: 'Wpisz tekst i wybierz żądaną formę zapisu.',
      inputLabel: 'Wejście',
      inputPlaceholder: 'Wpisz lub wklej tutaj',
      outputLabel: 'Wyjście',
      downloadFile: 'Pobierz plik',
      sentenceCase: 'Zapis zdaniowy',
      lowerCase: 'małe litery',
      upperCase: 'WIELKIE LITERY',
      capitalizedCase: 'Każde Słowo Wielką Literą',
      alternatingCase: 'NaPrZeMiEnNiE',
      titleCase: 'Zapis tytułowy',
      downloadText: 'Pobierz tekst',
      duplicateWordFinder: 'Znajdź duplikaty słów',
      removeDuplicateLines: 'Usuń zduplikowane wiersze',
      charsToRemove: 'Znaki do usunięcia',
      removeCharacters: 'Usuń znaki',
      wordFrequency: 'Częstość słów',
      removeUnderscores: 'Usuń podkreślenia',
      sentenceCounter: 'Licznik zdań',
      find: 'Szukaj',
      replace: 'Zastąp',
      replaceBtn: 'Zastąp',
      copyToClipboard: 'Kopiuj do schowka',
      clear: 'Wyczyść',
      removeTextFormatting: 'Usuń formatowanie',
      apply: 'Zastosuj',
      statsLabelChars: 'Znaki',
      statsLabelWords: 'Słowa',
      statsLabelSentences: 'Zdania',
      statsLabelLines: 'Wiersze',
      languagesSupported: 'Obsługiwane języki:',
      processingNote:
        'Przetwarzanie obsługuje Unicode i działa z powyższymi (i większością innych) językami.',
      uploadFile: 'Prześlij plik:',
      italics: 'Kursywa',
      dupWordsPrefix: 'Zduplikowane słowa:',
      noDupWords: 'Nie znaleziono zduplikowanych słów.',
      noWordsToAnalyse: 'Brak słów do analizy.',
    },
    Português: {
      title: 'Conversor de maiúsculas/minúsculas',
      subtitle: 'Digite seu texto e escolha o formato desejado.',
      inputLabel: 'Entrada',
      inputPlaceholder: 'Digite ou cole aqui',
      outputLabel: 'Saída',
      downloadFile: 'Baixar arquivo',
      sentenceCase: 'Frase',
      lowerCase: 'minúsculas',
      upperCase: 'MAIÚSCULAS',
      capitalizedCase: 'Cada Palavra em Maiúscula',
      alternatingCase: 'AlTeRnAdO',
      titleCase: 'Título',
      downloadText: 'Baixar texto',
      duplicateWordFinder: 'Encontrar palavras duplicadas',
      removeDuplicateLines: 'Remover linhas duplicadas',
      charsToRemove: 'Caracteres para remover',
      removeCharacters: 'Remover caracteres',
      wordFrequency: 'Frequência de palavras',
      removeUnderscores: 'Remover underscores',
      sentenceCounter: 'Contador de frases',
      find: 'Localizar',
      replace: 'Substituir',
      replaceBtn: 'Substituir',
      copyToClipboard: 'Copiar para a área de transferência',
      clear: 'Limpar',
      removeTextFormatting: 'Remover formatação',
      apply: 'Aplicar',
      statsLabelChars: 'Caracteres',
      statsLabelWords: 'Palavras',
      statsLabelSentences: 'Frases',
      statsLabelLines: 'Linhas',
      languagesSupported: 'Idiomas suportados:',
      processingNote:
        'O processamento é compatível com Unicode e funciona com os idiomas acima (and a maioria dos outros).',
      uploadFile: 'Enviar arquivo:',
      italics: 'Itálico',
      dupWordsPrefix: 'Palavras duplicadas:',
      noDupWords: 'Nenhuma palavra duplicada encontrada.',
      noWordsToAnalyse: 'Nenhuma palavra para analisar.',
    },
    Slovenščina: {
      title: 'Pretvornik velikosti črk',
      subtitle: 'Vnesite besedilo in izberite želeni zapis.',
      inputLabel: 'Vnos',
      inputPlaceholder: 'Vpišite ali prilepite tukaj',
      outputLabel: 'Izhod',
      downloadFile: 'Prenesi datoteko',
      sentenceCase: 'Stavčni zapis',
      lowerCase: 'male črke',
      upperCase: 'VELIKE ČRKE',
      capitalizedCase: 'Vsaka Beseda Velika',
      alternatingCase: 'IzMeNjEvAlNo',
      titleCase: 'Naslovni zapis',
      downloadText: 'Prenesi besedilo',
      duplicateWordFinder: 'Najdi podvojene besede',
      removeDuplicateLines: 'Odstrani podvojene vrstice',
      charsToRemove: 'Znaki za odstranitev',
      removeCharacters: 'Odstrani znake',
      wordFrequency: 'Pogostost besed',
      removeUnderscores: 'Odstrani podčrtaje',
      sentenceCounter: 'Števec stavkov',
      find: 'Najdi',
      replace: 'Zamenjaj',
      replaceBtn: 'Zamenjaj',
      copyToClipboard: 'Kopiraj v odložišče',
      clear: 'Počisti',
      removeTextFormatting: 'Odstrani oblikovanje besedila',
      apply: 'Uporabi',
      statsLabelChars: 'Znake',
      statsLabelWords: 'Besede',
      statsLabelSentences: 'Stavke',
      statsLabelLines: 'Vrstice',
      languagesSupported: 'Podprti jeziki:',
      processingNote:
        'Obdelava podpira Unicode in deluje z zgornjimi (in večino drugih) jeziki.',
      uploadFile: 'Naloži datoteko:',
      italics: 'Ležeče',
      dupWordsPrefix: 'Podvojene besede:',
      noDupWords: 'Ni najdenih podvojenih besed.',
      noWordsToAnalyse: 'Ni besed za analizo.',
    },
    Türkçe: {
      title: 'Büyük/Küçük Harf Dönüştürücü',
      subtitle: 'Metninizi girin ve istediğiniz biçimi seçin.',
      inputLabel: 'Girdi',
      inputPlaceholder: 'Buraya yazın veya yapıştırın',
      outputLabel: 'Çıktı',
      downloadFile: 'Dosyayı indir',
      sentenceCase: 'Cümle',
      lowerCase: 'küçük harf',
      upperCase: 'BÜYÜK HARF',
      capitalizedCase: 'Her Kelime Büyük',
      alternatingCase: 'AlTeRnAtIf',
      titleCase: 'Başlık',
      downloadText: 'Metni indir',
      duplicateWordFinder: 'Yinelenen kelimeleri bul',
      removeDuplicateLines: 'Yinelenen satırları kaldır',
      charsToRemove: 'Kaldırılacak karakterler',
      removeCharacters: 'Karakterleri kaldır',
      wordFrequency: 'Kelime sıklığı',
      removeUnderscores: 'Alt çizgileri kaldır',
      sentenceCounter: 'Cümle sayacı',
      find: 'Bul',
      replace: 'Değiştir',
      replaceBtn: 'Değiştir',
      copyToClipboard: 'Panoya kopyala',
      clear: 'Temizle',
      removeTextFormatting: 'Biçimlendirmeyi kaldır',
      apply: 'Uygula',
      statsLabelChars: 'Karakter',
      statsLabelWords: 'Kelime',
      statsLabelSentences: 'Cümle',
      statsLabelLines: 'Satır',
      languagesSupported: 'Desteklenen diller:',
      processingNote:
        'İşleme Unicode uyumludur ve yukarıdaki (ve çoğu başka) dillerle çalışır.',
      uploadFile: 'Dosya yükle:',
      italics: 'İtalik',
      dupWordsPrefix: 'Yinelenen kelimeler:',
      noDupWords: 'Yinelenen kelime bulunamadı.',
      noWordsToAnalyse: 'Analiz edilecek kelime yok.',
    },
    Українська: {
      title: 'Перетворювач регістру',
      subtitle: 'Введіть текст і оберіть потрібний формат.',
      inputLabel: 'Ввід',
      inputPlaceholder: 'Введіть або вставте тут',
      outputLabel: 'Вивід',
      downloadFile: 'Завантажити файл',
      sentenceCase: 'Речення',
      lowerCase: 'нижній регістр',
      upperCase: 'ВЕРХНІЙ РЕГІСТР',
      capitalizedCase: 'Кожне Слово З Великої',
      alternatingCase: 'ЧеРгУвАнНя',
      titleCase: 'Заголовок',
      downloadText: 'Завантажити текст',
      duplicateWordFinder: 'Пошук повторюваних слів',
      removeDuplicateLines: 'Видалити повторювані рядки',
      charsToRemove: 'Символи для видалення',
      removeCharacters: 'Видалити символи',
      wordFrequency: 'Частота слів',
      removeUnderscores: 'Видалити підкреслення',
      sentenceCounter: 'Лічильник речень',
      find: 'Знайти',
      replace: 'Замінити',
      replaceBtn: 'Замінити',
      copyToClipboard: 'Копіювати в буфер',
      clear: 'Очистити',
      removeTextFormatting: 'Видалити форматування',
      apply: 'Застосувати',
      statsLabelChars: 'Символи',
      statsLabelWords: 'Слова',
      statsLabelSentences: 'Речення',
      statsLabelLines: 'Рядки',
      languagesSupported: 'Підтримувані мови:',
      processingNote:
        'Обробка підтримує Unicode і працює з наведеними вище (та більшістю інших) мовами.',
      uploadFile: 'Завантажити файл:',
      italics: 'Курсив',
      dupWordsPrefix: 'Повторювані слова:',
      noDupWords: 'Повторюваних слів не знайдено.',
      noWordsToAnalyse: 'Немає слів для аналізу.',
    },
    'अंग्रेजी': {
      title: 'केस कन्वर्टर',
      subtitle: 'अपना पाठ दर्ज करें और मनचाहा केस चुनें।',
      inputLabel: 'इनपुट',
      inputPlaceholder: 'यहाँ टाइप करें या पेस्ट करें',
      outputLabel: 'आउटपुट',
      downloadFile: 'फ़ाइल डाउनलोड करें',
      sentenceCase: 'वाक्य केस',
      lowerCase: 'छोटे अक्षर',
      upperCase: 'बड़े अक्षर',
      capitalizedCase: 'हर शब्द का पहला अक्षर बड़ा',
      alternatingCase: 'आल्टरनेटिंग',
      titleCase: 'शीर्षक केस',
      downloadText: 'टेक्स्ट डाउनलोड करें',
      duplicateWordFinder: 'डुप्लीकेट शब्द खोजें',
      removeDuplicateLines: 'डुप्लीकेट लाइनें हटाएँ',
      charsToRemove: 'हटाने के अक्षर',
      removeCharacters: 'अक्षर हटाएँ',
      wordFrequency: 'शब्द आवृत्ति',
      removeUnderscores: 'अंडरस्कोर हटाएँ',
      sentenceCounter: 'वाक्य काउंटर',
      find: 'खोजें',
      replace: 'बदलें',
      replaceBtn: 'बदलें',
      copyToClipboard: 'क्लिपबोर्ड पर कॉपी करें',
      clear: 'साफ़ करें',
      removeTextFormatting: 'टेक्स्ट फ़ॉर्मैटिंग हटाएँ',
      apply: 'लागू करें',
      statsLabelChars: 'अक्षर',
      statsLabelWords: 'शब्द',
      statsLabelSentences: 'वाक्य',
      statsLabelLines: 'पंक्तियाँ',
      languagesSupported: 'समर्थित भाषाएँ:',
      processingNote:
        'प्रोसेसिंग Unicode-सक्षम है और ऊपर दी गई (और अधिकांश अन्य) भाषाओं के साथ काम करती है।',
      uploadFile: 'फ़ाइल अपलोड करें:',
      italics: 'इटैलिक',
      dupWordsPrefix: 'डुप्लीकेट शब्द:',
      noDupWords: 'कोई डुप्लीकेट शब्द नहीं मिला।',
      noWordsToAnalyse: 'विश्लेषण करने के लिए शब्द नहीं हैं।',
    },
  };

  // Fallback for languages not explicitly translated.
  const t = (key) =>
    (messages[language] && messages[language][key]) || messages.English[key] || key;

  // Map UI language to a locale tag for Intl.Segmenter.
  const langToLocale = (lang) => {
    const map = {
      Deutsch: 'de',
      Ελληνικά: 'el',
      English: 'en',
      Español: 'es',
      Filipino: 'fil',
      Français: 'fr',
      Magyar: 'hu',
      Italiano: 'it',
      Polski: 'pl',
      Português: 'pt',
      Slovenščina: 'sl',
      Türkçe: 'tr',
      Українська: 'uk',
      'अंग्रेजी': 'hi',
    };
    return map[lang] || 'und';
  };

  // Recompute stats any time text changes (Unicode-aware).
  useEffect(() => {
    const source = (outputText || inputText) || '';
    const chars = [...source].length;
    const words = tokenizeWords(source, langToLocale(language)).length;
    const sentencesMatch = source.match(/[^.!?]+[.!?]+/g);
    const sentences = sentencesMatch ? sentencesMatch.length : source.trim() ? 1 : 0;
    const lines = source.split(/\n/u).length;
    setStats({ chars, words, sentences, lines });
  }, [inputText, outputText, language]);

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
          .map((char) =>
            char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()
          )
          .join('');
        break;
      default:
        break;
    }
    setOutputText(text);
  }

  function duplicateWordFinder() {
    const words = tokenizeWords(inputText, langToLocale(language)).map((w) =>
      w.toLowerCase()
    );
    const counts = {};
    for (const w of words) counts[w] = (counts[w] || 0) + 1;
    const duplicates = Object.keys(counts).filter((k) => counts[k] > 1);
    setOutputText(
      duplicates.length ? `${t('dupWordsPrefix')} ${duplicates.join(', ')}` : t('noDupWords')
    );
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
    if (formatOptions.removeNonAlphanumeric)
      text = text.replace(/[^\p{L}\p{N}\s]/gu, '');
    if (formatOptions.removeEmojis)
      text = text.replace(/\p{Extended_Pictographic}/gu, '');
    if (formatOptions.removePunctuation)
      text = text.replace(/[\p{P}\p{S}]/gu, '');
    setOutputText(text);
  }

  function handleWordFrequency() {
    const words = tokenizeWords(inputText, langToLocale(language)).map((w) =>
      w.toLowerCase()
    );
    const total = words.length;
    if (!total) {
      setOutputText(t('noWordsToAnalyse'));
      return;
    }
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
    const words = inputText.trim()
      ? tokenizeWords(inputText, langToLocale(language)).length
      : 0;
    const sentencesMatch = inputText.match(/[^.!?]+[.!?]+/g);
    const sentences = sentencesMatch ? sentencesMatch.length : inputText.trim() ? 1 : 0;
    const lines = inputText.split(/\n/u).length;
    setOutputText(
      `${t('statsLabelChars')}: ${chars}\n${t('statsLabelWords')}: ${words}\n${t(
        'statsLabelSentences'
      )}: ${sentences}\n${t('statsLabelLines')}: ${lines}`
    );
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
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-center">
          {t('title')}
        </h1>

        {/* <AdPlaceholder className="mx-auto max-w-4xl h-20" /> */}

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('subtitle')}
        </p>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/2">
            <label className="block text-sm mb-2">{t('inputLabel')}</label>
            <textarea
              dir="auto"
              className={`w-full h-48 md:h-64 rounded-md p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary ${isItalic ? 'italic' : ''
                }`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('inputPlaceholder')}
            />
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <label className="inline-flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={isItalic}
                  onChange={() => setIsItalic(!isItalic)}
                  className="mr-2"
                />
                {t('italics')}
              </label>
              <label className="inline-flex items-center text-sm">
                <span className="mr-2">{t('uploadFile')}</span>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="text-sm"
                />
              </label>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <label className="block text-sm mb-2">{t('outputLabel')}</label>
            <textarea
              dir="auto"
              className={`w-full h-48 md:h-64 rounded-md p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none ${isItalic ? 'italic' : ''
                }`}
              value={outputText}
              readOnly
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleDownloadFile}
                className="px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-md text-sm hover:bg-primary-dark"
              >
                {t('downloadFile')}
              </button>
            </div>
          </div>
        </div>

        {/* Three attractive blocks */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Case Conversion */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-md flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Case Conversion
            </h2>

            <button
              onClick={() => handleCase('sentence')}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200 shadow-sm hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700"
            >
              {t('sentenceCase')}
            </button>
            <button
              onClick={() => handleCase('lower')}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200 shadow-sm hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700"
            >
              {t('lowerCase')}
            </button>
            <button
              onClick={() => handleCase('upper')}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200 shadow-sm hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700"
            >
              {t('upperCase')}
            </button>
            <button
              onClick={() => handleCase('capitalized')}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200 shadow-sm hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700"
            >
              {t('capitalizedCase')}
            </button>
            <button
              onClick={() => handleCase('alternating')}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200 shadow-sm hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700"
            >
              {t('alternatingCase')}
            </button>
            <button
              onClick={() => handleCase('title')}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200 shadow-sm hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700"
            >
              {t('titleCase')}
            </button>
          </section>

          {/* Text Cleanup */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-md flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Text Cleanup
            </h2>

            <button
              onClick={removeDuplicateLines}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-800 border border-green-200 shadow-sm hover:bg-green-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-green-900 dark:text-green-100 dark:border-green-700"
            >
              {t('removeDuplicateLines')}
            </button>

            <button
              onClick={duplicateWordFinder}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-800 border border-green-200 shadow-sm hover:bg-green-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-green-900 dark:text-green-100 dark:border-green-700"
            >
              {t('duplicateWordFinder')}
            </button>

            <div className="flex flex-col gap-2 mt-1">
              <input
                type="text"
                placeholder={t('charsToRemove')}
                value={removeChars}
                onChange={(e) => setRemoveChars(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm"
              />
              <button
                onClick={handleRemoveChars}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-800 border border-green-200 shadow-sm hover:bg-green-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-green-900 dark:text-green-100 dark:border-green-700"
              >
                {t('removeCharacters')}
              </button>
            </div>

            <button
              onClick={handleRemoveUnderscores}
              className="w-full mt-1 px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-800 border border-green-200 shadow-sm hover:bg-green-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-green-900 dark:text-green-100 dark:border-green-700"
            >
              {t('removeUnderscores')}
            </button>
          </section>

          {/* Find, Replace & Analyze */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-md flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Find, Replace &amp; Analyze
            </h2>

            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-2 w-full">
                <input
                  type="text"
                  placeholder={t('find')}
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className="flex-1 min-w-[120px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  placeholder={t('replace')}
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="flex-1 min-w-[120px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm"
                />
              </div>

              <button
                onClick={handleReplace}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 shadow-sm hover:bg-yellow-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700"
              >
                {t('replaceBtn')}
              </button>
            </div>


            <button
              onClick={handleWordFrequency}
              className="w-full mt-1 px-4 py-2 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 shadow-sm hover:bg-yellow-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700"
            >
              {t('wordFrequency')}
            </button>
            <button
              onClick={handleSentenceCount}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 shadow-sm hover:bg-yellow-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700"
            >
              {t('sentenceCounter')}
            </button>
            <button
              onClick={handleDownloadFile}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 shadow-sm hover:bg-yellow-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700"
            >
              {t('downloadText')}
            </button>
            <button
              onClick={handleCopy}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 shadow-sm hover:bg-yellow-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700"
            >
              {t('copyToClipboard')}
            </button>
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
              className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 shadow-sm hover:bg-yellow-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700"
            >
              {t('clear')}
            </button>

            <details className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-2 text-sm">
              <summary className="cursor-pointer select-none">
                {t('removeTextFormatting')}
              </summary>
              <div className="mt-2 space-y-1">
                {Object.keys(formatOptions).map((key) => (
                  <label key={key} className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={formatOptions[key]}
                      onChange={() =>
                        setFormatOptions((opts) => ({
                          ...opts,
                          [key]: !opts[key],
                        }))
                      }
                      className="mr-2"
                    />
                    {humanReadable(key)}
                  </label>
                ))}
                <button
                  onClick={handleRemoveFormatting}
                  className="mt-2 px-3 py-1 bg-primary dark:bg-primary-dark text-white rounded text-xs hover:bg-primary-dark"
                >
                  {t('apply')}
                </button>
              </div>
            </details>
          </section>
        </div>

        <div className="mt-2 text-xs text-gray-400">
          {t('statsLabelChars')}: {stats.chars} | {t('statsLabelWords')}:{' '}
          {stats.words} | {t('statsLabelSentences')}: {stats.sentences} |{' '}
          {t('statsLabelLines')}: {stats.lines}
        </div>

        <div className="mt-8">
          {/* <AdPlaceholder className="w-full h-24" /> */}
        </div>

        <div className="mt-8">
          <label className="block mb-2 text-sm">{t('languagesSupported')}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2 text-sm"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-500">{t('processingNote')}</p>
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
    try {
      const seg = new Intl.Segmenter(locale, { granularity: 'word' });
      return Array.from(seg.segment(s))
        .filter(({ isWordLike }) => isWordLike)
        .map(({ segment }) => segment);
    } catch (e) {
      // Fallback if locale not supported by environment
    }
  }
  // Fallback: sequences of letters/numbers in any script
  return s.match(/[\p{L}\p{N}]+/gu) || [];
}

function humanReadable(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}
