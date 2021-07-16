import constants from '../constants';

export const storeUserMetaData = _userMetaData => {
  if (_userMetaData) {
    localStorage.setItem(constants.STORAGE.AUTH.USER_DATA, _userMetaData);
  } else {
    localStorage.removeItem(constants.STORAGE.AUTH.USER_DATA);
  }
};

export const storeUserCompanies = _companies => {
  if (_companies) {
    localStorage.setItem(constants.STORAGE.AUTH.COMPANIES, _companies);
  } else {
    localStorage.removeItem(constants.STORAGE.AUTH.COMPANIES);
  }
};

export const getUserCompanie = () => {
  return localStorage.getItem(constants.STORAGE.AUTH.COMPANIES);
};

export const getUserMetaData = () => {
  return localStorage.getItem(constants.STORAGE.AUTH.USER_DATA);
};

export const storeAuthToken = _token => {
  if (_token) {
    localStorage.setItem(constants.STORAGE.AUTH.TOKEN, _token);
  } else {
    localStorage.removeItem(constants.STORAGE.AUTH.TOKEN);
  }
};

export const getAuthToken = () => {
  return localStorage.getItem(constants.STORAGE.AUTH.TOKEN);
};

// Admin , Business
export const storeUserAppStatus = _status => {
  if (_status) {
    localStorage.setItem(constants.STORAGE.AUTH.USER_APP_STATUS, _status);
  } else {
    localStorage.removeItem(constants.STORAGE.AUTH.USER_APP_STATUS);
  }
};

export const getUserAppStatus = () => {
  return localStorage.getItem(constants.STORAGE.AUTH.USER_APP_STATUS);
};

export const storeAuthRefreshToken = _refreshToken => {
  if (_refreshToken) {
    localStorage.setItem(constants.STORAGE.AUTH.REFRESH_TOKEN, _refreshToken);
  } else {
    localStorage.removeItem(constants.STORAGE.AUTH.REFRESH_TOKEN);
  }
};

export const getAuthRefreshToken = () => {
  return localStorage.getItem(constants.STORAGE.AUTH.REFRESH_TOKEN);
};

export const getPropId = () => {
  if (localStorage.getItem(constants.STORAGE.AUTH.USER_DATA)) {
    return JSON.parse(localStorage.getItem(constants.STORAGE.AUTH.USER_DATA))
      .preference.propId;
  }
  return '';
};

/**
 * setUserPropertyId : in local storage we are storing property id
 * @param {string} _propertyId :
 */

export const setUserPropertyId = _propertyId => {
  if (_propertyId) {
    const userData = JSON.parse(
      localStorage.getItem(constants.STORAGE.AUTH.USER_DATA),
    );
    userData.preference.propId = _propertyId;
    localStorage.setItem(
      constants.STORAGE.AUTH.USER_DATA,
      JSON.stringify(userData),
    );
  }
};

export const getAppAccessList = () => {
  const userData = JSON.parse(getUserMetaData());
  const userAccessArray = [];
  if (userData && userData.propAccess && userData.propAccess.length !== 0) {
    userData.propAccess.forEach(item => {
      if (item.realm && item.realm.length !== 0) {
        userAccessArray.push(...item.realm);
      }
    });
  }
  return [...new Set(userAccessArray)];
};
