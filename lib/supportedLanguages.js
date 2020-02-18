const flagOptions = [
  { key: 'vi', value: 'VIETNAMESE', flag: 'vn', text: 'Tiếng Việt' },
  // { key: 'en', value: 'ENGLISH', flag: 'gb', text: 'English' },
  { key: 'cs', value: 'CZECH', flag: 'cz', text: 'Česky' },
  // { key: 'de', value: 'GERMAN', flag: 'de', text: 'Deutsch' },
];

const languageOptions = {
  vi: 'VIETNAMESE',
  en: 'ENGLISH',
  cs: 'CZECH',
  de: 'GERMAN',
};

const defaultLanguage = 'CZECH';

const getSupportedLanguage = browserLanguage => {
  const supportedLanguage = languageOptions[browserLanguage.slice(0, 2)];
  return supportedLanguage || 'ENGLISH';
};

export { flagOptions, languageOptions, defaultLanguage, getSupportedLanguage };
