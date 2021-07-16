import { SET_USER_LANGUAGES, SET_PRIMARY_LANGUAGE } from '../types';
import apiPaths from '../utils/constants';
import fetchClient from '../utils/axiosConfig';
// import { languagesAll } from '../utils/DemoData/languages';
import { isLogin } from '../utils/utils';

export const setUserLanguages = list => ({
  type: SET_USER_LANGUAGES,
  list,
});

export const setPrimaryLanguage = lang => ({
  type: SET_PRIMARY_LANGUAGE,
  lang,
});

export const getIntervalUserLanguagesListAPIAction = () => {
  return (dispatch, _getState) => {
    setInterval(async () => {
      if (isLogin()) {
        fetchClient
          .get(`${apiPaths.API.GLOBAL.USER_LANGUAGE_PREFERENCE}`)
          .then(res => {
            if (res.data.success) {
              const langResonse = res.data.data[0].languages;
              const modifiedLangResponse = [];
              langResonse.forEach(locale => {
                const langObj = {
                  languageName: locale.name,
                  languageCode: locale.code, // .trim()
                  isPrimary: locale.isPrimary,
                };
                modifiedLangResponse.push(langObj);
              });
              dispatch(setUserLanguages(modifiedLangResponse));
              dispatch(
                setPrimaryLanguage(
                  modifiedLangResponse.find(item => item.isPrimary === true)
                    .languageCode,
                ),
              );
            }
          })
          .catch(err => {
            if (err) {
              dispatch(setUserLanguages([]));
              dispatch(setPrimaryLanguage('en'));
            }
          });
      }
    }, 30000);
  };
};

export const getUserLanguagesListAPIAction = () => {
  return (dispatch, _getState) => {
    if (isLogin()) {
      fetchClient
        .get(`${apiPaths.API.GLOBAL.USER_LANGUAGE_PREFERENCE}`)
        .then(res => {
          if (res.data.success) {
            const langResonse = res.data.data[0].languages;
            const modifiedLangResponse = [];
            langResonse.forEach(locale => {
              const langObj = {
                languageName: locale.name,
                languageCode: locale.code,
                isPrimary: locale.isPrimary,
              };
              modifiedLangResponse.push(langObj);
            });
            dispatch(setUserLanguages(modifiedLangResponse));
            dispatch(
              setPrimaryLanguage(
                modifiedLangResponse.find(item => item.isPrimary === true)
                  .languageCode,
              ),
            );
          }
        })
        .catch(err => {
          if (err) {
            dispatch(setUserLanguages([]));
            dispatch(setPrimaryLanguage('en'));
          }
        });
    }
  };
};

export const resetLanguages = () => {
  return (dispatch, _getState) => {
    dispatch(setUserLanguages([]));
  };
};

export const checkIsEditableDeletableAPIAction = (module, operation, refId) => {
  return () => {
    const reqParams = {
      module,
      operation,
      refId,
    };
    return fetchClient.post(
      `${apiPaths.API.GLOBAL.IS_ALLOW_DELETE_EDIT}`,
      reqParams,
    );
  };
};
