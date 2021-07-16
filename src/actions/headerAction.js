import {
  SET_USER_PROPERTIES,
  SET_SEARCH_TEXT,
  SET_PROP_APP_STATUS,
} from '../types';

import apiPaths from '../utils/constants';
import fetchClient from '../utils/axiosConfig';

export const setuserProperties = list => ({
  type: SET_USER_PROPERTIES,
  list,
});

export const setpropappStatus = status => ({
  type: SET_PROP_APP_STATUS,
  status,
});

export const getUserPropertiesAPIAction = () => {
  return dispatch => {
    fetchClient
      .get(apiPaths.API.HEADER.USER_PROPERTIES)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data;
          const modifiedApiData = [];

          apiData.forEach(property => {
            const propObj = {
              key: property.proprefid,
              value: property.proprefid,
              text: property.propname,
              // isDefaultProperty: property.isdefault,
            };
            modifiedApiData.push(propObj);
          });

          dispatch(setuserProperties(modifiedApiData));
        }
      })
      .catch(err => {
        if (err) {
          dispatch(setuserProperties([]));
        }
      });
  };
};

export const setSearchText = searchText => ({
  type: SET_SEARCH_TEXT,
  searchText,
});
