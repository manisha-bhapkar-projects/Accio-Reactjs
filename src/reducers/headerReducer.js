import {
  SET_USER_PROPERTIES,
  SET_SEARCH_TEXT,
  SET_PROP_APP_STATUS,
} from '../types';

import { getUserAppStatus } from '../utils/storage';

const initialState = {
  propertyAccessList: [],
  searchText: '',
  propertyUserAppStatus: getUserAppStatus() === '' ? '' : getUserAppStatus(), // Panel user is using (admin,business)
};

const header = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_PROPERTIES:
      return {
        ...state,
        propertyAccessList: action.list,
      };
    case SET_PROP_APP_STATUS:
      return {
        ...state,
        propertyUserAppStatus: action.status,
      };
    case SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.searchText,
      };

    default:
      return state;
  }
};
export default header;
