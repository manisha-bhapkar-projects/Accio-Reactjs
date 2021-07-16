/**
 * API CALL for Login
 */
import constants from '../utils/constants';
import fetchClient from '../utils/axiosConfig';
import { getAuthRefreshToken } from '../utils/storage';

const callLoginApiAction = _request => {
  return (_dispatch, _getState) => {
    return fetchClient.post(constants.API.LOGIN.SIGNUP, _request, {
      headers: {
        Authorization:
          'Basic uRMbzcionJqg5YIBCqYdxkB7pxJlYfvL06I6dI/cEbM8QyCFTm0u4yVdgQ5U70bJI+41MUpXUAHWUDnQ4N3OOg==',
        'grant-type': 'password',
        app: 'client',
      },
    });
  };
};

export const logoutApiAction = () => {
  return (_dispatch, _getState) => {
    return fetchClient.post(constants.API.LOGIN.LOGOUT, {
      refreshToken: getAuthRefreshToken(),
    });
  };
};

export default callLoginApiAction;
