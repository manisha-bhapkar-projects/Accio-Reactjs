import moment from 'moment';
import { SET_USER_LANGUAGES, SET_PRIMARY_LANGUAGE } from '../types';

const initialState = {
  userLanguages: [],
  primaryLanguage: 'en',
  timeStamp: '',
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_LANGUAGES: {
      const currentTimeStamp = moment().unix();
      return {
        ...state,
        userLanguages: action.list,
        // userLanguages: [
        //   { languageCode: 'en', languageName: 'English' },
        //   // { languageCode: 'zh', languageName: 'Chinese (Simplified)' },
        //   // { languageCode: 'fr', languageName: 'Franch' },
        // ],
        timeStamp: currentTimeStamp,
      };
    }
    case SET_PRIMARY_LANGUAGE:
      return {
        ...state,
        primaryLanguage: action.lang,
      };

    default:
      return state;
  }
};
export default commonReducer;
