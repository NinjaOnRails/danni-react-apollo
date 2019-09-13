const flagOptions = [
  { key: 'vi', value: 'vi', flag: 'vn', text: 'Tiếng Việt' },
  { key: 'en', value: 'en', flag: 'gb', text: 'English' },
  { key: 'cs', value: 'cs', flag: 'cz', text: 'Česky' },
  { key: 'de', value: 'de', flag: 'de', text: 'Deutsch' },
];

const languageOptions = {
  vi: 'VIETNAMESE',
  en: 'ENGLISH',
  cs: 'CZECH',
  de: 'GERMAN',
};

const languageOptionsLocal = {
  vi: 'Tiếng Việt',
  en: 'English',
  cs: 'Česky',
  de: 'Deutsch',
};

const defaultLanguage = 'en';

const getSupportedLanguage = browserLanguage => {
  const supportedLanguage = languageOptions[browserLanguage.slice(0, 2)];
  return supportedLanguage || 'ENGLISH';
};

export {
  flagOptions,
  languageOptions,
  defaultLanguage,
  getSupportedLanguage,
  languageOptionsLocal,
};
