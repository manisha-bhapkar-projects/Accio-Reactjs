// kept for future reference not required yet

import moment from 'moment';
import _ from 'lodash';

import { getUserMetaData, getAuthToken } from './storage';
import messages from './Locales/messages';
import constsidebar from './Locales/constsidebar';

const jwtDecode = require('jwt-decode');

export const getApiServerUrl = () => {
  let serverUrl = 'http://localhost:9090';
  serverUrl =
    process.env.REACT_APP_NODE_ENV === 'staging'
      ? 'https://stagingurl.com'
      : serverUrl;
  serverUrl =
    process.env.REACT_APP_NODE_ENV === 'production'
      ? 'https://productionurl.com'
      : serverUrl;

  return serverUrl;
};

/**
 * Common api handler. e.g. after every api error response you can check status code. if status code is 423 means token is expired and you can redirect user to login page
 * @param {Object} error api error object
 */
export const handleApiError = error => {
  if (
    error &&
    error.response &&
    error.response.status &&
    error.response.status === 423
  ) {
    // if user session is expired we will clear the storage
    // and redirect user to login page
    // localStorage.clear();
    // window.location.replace('/login');
    return {};
  }
  if (
    error &&
    error.response &&
    error.response.status &&
    error.response.status === 401
  ) {
    return error.response.data
      ? error.response.data.message
      : 'Unauthorized user';
  }
  if (
    error &&
    error.response &&
    error.response.status &&
    error.response.status === 400
  ) {
    return error.response.data
      ? error.response.data.message
      : 'Please check the details provides';
  }
  if (error && error.response) {
    return error.response.data
      ? error.response.data.message
      : messages.GLOBAL.SOMETHING_WENT_WRONG;
  }

  return messages.GLOBAL.SOMETHING_WENT_WRONG;
};

/**
 * getErrorMessage : it takes the error and return error message as per error
 * @param {Object} error : pass error object which comes from server
 */
export const getErrorMessage = error => {
  let ERROR_MESSAGE = '';
  if (error.response) {
    if (error.response.status === 401) {
      // ERROR_MESSAGE = error.response.data
      //   ? error.response.data.message
      //   : 'unauthorized user.';
      ERROR_MESSAGE = '';
      // auth.logout();
      // router.replace('/auth/login');
    } else {
      ERROR_MESSAGE = error.response.data
        ? error.response.data.message
        : messages.GLOBAL.SOMETHING_WENT_WRONG;
    }
  } else {
    // network error like timeout, connection refused etc...
    ERROR_MESSAGE = messages.GLOBAL.SOMETHING_WENT_WRONG;
  }
  return ERROR_MESSAGE;
};

export const getFormatedDate = (date, dateFormat) => {
  if (dateFormat) {
    return moment(date).format(dateFormat);
  }
  return moment(date).format('DD-MMM-YYYY'); // DD-MM-YYYY
};

export const scrollToTop = () => {
  window.scrollTo(0, 0);
};

/**
 * hasDuplicates: this function checks array having any duplicate record
 * @param {Array} array : array of elements which we want to check duplication
 *
 */

export const hasDuplicates = array => {
  // const findDuplicates = arr =>
  //   arr.filter((item, index) => arr.indexOf(item) !== index);

  // console.log([...new Set(findDuplicates(array))]); // Unique duplicates

  return _.uniq(array).length !== array.length;
};

export const getDuplicateItem = array => {
  const findDuplicates = arr =>
    arr.filter((item, index) => arr.indexOf(item) !== index);
  const duplicateItems = [...new Set(findDuplicates(array))];
  return duplicateItems[0];
};

/**
 * insertIsErrorInLabels : used in add or update phases , suphase and design form
 * insert isError for all labels
 * @param {Array} array
 *
 */

export const insertIsErrorInLabels = array => {
  array.forEach(arrayObj => {
    const data = arrayObj;
    data.isError = false;
    data.isFocus = false;
    data.errorMessage = '';
  });
  return array;
};

export const isLogin = () => {
  const userMetaData = getUserMetaData();
  if (userMetaData) {
    return true;
  }
  return false;
};

export const isJwtExpired = () => {
  if (getAuthToken()) {
    const decoded = jwtDecode(getAuthToken);
    /** prints 
  aud: "urn:http://0.0.0.0:5001"
  email: "mmcgonagall@mail.com"
  exp: 1590690008
  iat: 1590686408
  iss: "mmcgonagall@mail.com"
  uId: 2
  uRefId: "b47f508e-4b8f-4158-9334-72a73422e9ee"
  uType: "Owner"
  */
    const currentTime = new Date().getTime() / 1000;
    if (currentTime > decoded.exp) {
      /* expired */
      return true;
    }
    return false;
  }
  return false;
};

// getPrimaryLanguage : this function return primary language from store
export const getPrimaryLanguage = state => state.common.primaryLanguage;

// getLanguages : this function return languages from store
export const getLanguages = state => state.common.userLanguages;
export const getRouteWithoutParam = path => {
  const extractedPath =
    path.indexOf('/:') !== -1 ? path.substring(0, path.indexOf('/:')) : path;
  return extractedPath;
};

export const customSort = (rows, field, direction) => {
  const handleField = row => {
    if (row[field]) {
      return row[field].toLowerCase();
    }
    return row[field];
  };
  return _.orderBy(rows, handleField, direction);
};

// countCharacter : counts char from html data
export const countCharacter = content => {
  let DATA = content;
  DATA = DATA.replace(/<[^>]*>/g, ' ');
  DATA = DATA.replace(/\s+/g, ' ');
  DATA = DATA.replace(/&nbsp;/g, ' ');
  DATA = DATA.replace(/&amp;/g, '&');
  DATA = DATA.trim();
  const n = DATA.replace(/[\s\n\t\r\uFEFF\u200b]+/g, '').length;
  return n;
};

// sort field by any field
export const fieldSorter = fields => (a, b) => {
  return fields
    .map(item => {
      let data = item;
      let dir = 1;
      if (item[0] === '-') {
        dir = -1;
        data = data.substring(1);
      }
      if (a[data] > b[data]) {
        return dir;
      }
      if (a[data] < b[data]) {
        return -dir;
      }
      return 0;
    })
    .reduce((p, n) => p || n, 0);
};

// Business

/**
 * getTitleOfScreen : function which return title of screen from menu items 
 * @param {string} _url : url of screen from location.pathname
 * @param {Function} _callback : callback function to set title 
 * 
 * Use of this function: 
    const { location } = props;
    useEffect(() => {
      if (location.pathname) {
        getTitleOfScreen(location.pathname, title => setSubPhaseName(title));
      }
    }, [location]);
 * 
 */

export const getTitleOfScreen = (_url, _callback) => {
  const phasePath = `/${_url.split('/')[1]}`;
  const subPhasePath = `/${_url.split('/')[1]}/${_url.split('/')[2]}`;
  constsidebar.menuItems.forEach(phaseItem => {
    if (phaseItem.path === phasePath) {
      const subPhaseData = phaseItem.subphases.find(
        subPhaseItem => subPhaseItem.path === subPhasePath,
      );
      if (subPhaseData && subPhaseData.subphase) {
        _callback(subPhaseData.subphase);
      } else {
        _callback('');
      }
    }
  });
};

const utils = {
  handleApiError,
  getApiServerUrl,
  getFormatedDate,
  isLogin,
  isJwtExpired,
};

export default utils;
