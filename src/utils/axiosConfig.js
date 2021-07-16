import axios from 'axios';
import constants from './constants';
import {
  getAuthToken,
  getAuthRefreshToken,
  storeAuthToken,
  storeUserMetaData,
  storeAuthRefreshToken,
  storeUserCompanies,
  getPropId,
} from './storage';
import history from './history';

const fetchClient = () => {
  const defaultOptions = {
    baseURL: constants.BASE_URL.API,
    headers: {
      'Content-Type': 'application/json',
      app: 'client',
    },
  };

  // Create instance
  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(
    config => {
      const token = getAuthToken();
      const propId = getPropId();
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = token ? `Bearer ${token}` : '';
      // eslint-disable-next-line no-param-reassign
      config.headers.proprefid = token ? propId : '';
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    response => {
      return response;
    },
    err => {
      const originalReq = err.config;

      if (err.response.status === 401 && (err.response.data.errorCode === 'errTokenExpired' || err.response.data.errorCode === 'errHttpUnauthorized') && originalReq.url === constants.BASE_URL.API + constants.API.LOGIN.REFRESH_TOKEN) {
        storeUserMetaData(null);
        storeAuthRefreshToken(null);
        storeAuthToken(null);
        storeUserCompanies(null);
        history.push('/');
        return Promise.reject(err);
      }

      if (
        err.response.status === 401 &&
        err.response.data.errorCode === 'errTokenExpired' &&
        err.config &&
        // eslint-disable-next-line no-underscore-dangle
        !originalReq._retry
      ) {
        // eslint-disable-next-line no-underscore-dangle
        originalReq._retry = true;
        const refreshTok = getAuthRefreshToken();
        return instance
          .post(
            constants.BASE_URL.API + constants.API.LOGIN.REFRESH_TOKEN,
            {
              refreshToken: refreshTok,
            },
            {
              headers: {
                app: 'client',
              },
            },
          )
          .then(_res => {
            if (_res.data.success && _res.data.data.length) {
              const { token, refreshToken } = _res.data.data[0];
              if ('refreshToken' in _res.data.data[0]) {
                storeAuthRefreshToken(refreshToken);
              }
              if ('token' in _res.data.data[0]) {
                instance.defaults.headers.common.Authorization = token
                  ? `Bearer ${token}`
                  : '';
                storeAuthToken(token);
              }
              return Promise.resolve(instance(originalReq));
            }
            return Promise.reject(err);
          })
          .catch(error => {
            if (
              error.response.status === 401 &&
              (error.response.data.errorCode === 'errTokenExpired' || error.response.data.errorCode === 'errHttpUnauthorized')
            ) {
              storeUserMetaData(null);
              storeAuthRefreshToken(null);
              storeAuthToken(null);
              storeUserCompanies(null);
              history.push('/');
            }
            return Promise.reject(err);
          });
      }

      return Promise.reject(err);

      // return new Promise((resolve, _reject) => {
      //   const originalReq = err.config;
      //   if (
      //     err.response.status === 401 &&
      //     err.response.data.errorCode === 'errTokenExpired' &&
      //     err.config &&
      //     // eslint-disable-next-line no-underscore-dangle
      //     !err.config.__isRetryRequest
      //   ) {
      //     // eslint-disable-next-line no-underscore-dangle
      //     originalReq._retry = true;
      //     axios
      //       .post(
      //         constants.BASE_URL.API + constants.API.LOGIN.REFRESH_TOKEN,
      //         {
      //           refreshToken: getAuthRefreshToken(),
      //         },
      //         {
      //           headers: {
      //             app: 'client',
      //           },
      //         },
      //       )
      //       .then(_res => {
      //         if (_res.status === 401) {
      //           storeUserMetaData(null);
      //           storeAuthRefreshToken(null);
      //           storeAuthToken(null);
      //           storeUserCompanies(null);
      //           history.push('/');
      //           return _reject(err);
      //         }
      //         if (_res.data.success && _res.data.data.length) {
      //           const { token, refreshToken } = _res.data.data[0];
      //           if ('refreshToken' in _res.data.data[0]) {
      //             storeAuthRefreshToken(refreshToken);
      //           }
      //           if ('token' in _res.data.data[0]) {
      //             originalReq.headers.Authorization = token
      //               ? `Bearer ${token}`
      //               : '';
      //             storeAuthToken(token);
      //           }
      //         }
      //         return axios(originalReq);
      //       })
      //       .catch(_e => {
      //         if (_e.response.status === 401) {
      //           storeUserMetaData(null);
      //           storeAuthRefreshToken(null);
      //           storeAuthToken(null);
      //           storeUserCompanies(null);
      //           history.push('/');
      //           return _reject(err);
      //         }
      //         return _reject(err);
      //       });
      //   }
      //   return _reject(err);
      // });
    },
  );
  return instance;
};

export default fetchClient();
