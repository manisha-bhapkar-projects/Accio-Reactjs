import englishMessages from './englishMessages';

const getMessageAsPerLanguage = language => {
  switch (language) {
    case 'en':
      return englishMessages;
    default:
      return englishMessages;
  }
};

export default getMessageAsPerLanguage;
